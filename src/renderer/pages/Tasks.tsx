import { useState, useEffect, useCallback } from 'react'
import { Task, Label, Project, CreateTask } from '../../shared/database-types'
import Modal from '../components/ui/Modal'
import TaskForm from '../components/tasks/TaskForm'
import TaskCard from '../components/tasks/TaskCard'
import KanbanBoard from '../components/tasks/KanbanBoard'
import '../styles/components.css'

type ViewMode = 'list' | 'kanban'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [taskLabels, setTaskLabels] = useState<Map<number, Label[]>>(new Map())
  const [projects, setProjects] = useState<Project[]>([])
  const [allLabels, setAllLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | Task['priority']>('all')
  const [filterProject, setFilterProject] = useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'created' | 'updated' | 'due_date' | 'priority'>('updated')

  const filterAndSortTasks = useCallback(() => {
    let filtered = [...tasks]

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus)
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === filterPriority)
    }

    if (filterProject !== 'all') {
      filtered = filtered.filter(t => t.project_id === filterProject)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      )
    }

    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'due_date':
          if (!a.due_date && !b.due_date) return 0
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        default:
          return 0
      }
    })

    setFilteredTasks(filtered)
  }, [tasks, filterStatus, filterPriority, filterProject, searchQuery, sortBy])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAndSortTasks()
  }, [filterAndSortTasks])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [tasksResponse, projectsResponse, labelsResponse] = await Promise.all([
        window.electronAPI.database.tasks.getAll(),
        window.electronAPI.database.projects.getAll(),
        window.electronAPI.database.labels.getAll()
      ])
      
      if (tasksResponse.success) {
        const tasksList = tasksResponse.data || []
        setTasks(tasksList)
        
        const labelsMap = new Map<number, Label[]>()
        for (const task of tasksList) {
          const labelsResponse = await window.electronAPI.database.tasks.getLabels(task.id)
          if (labelsResponse.success) {
            labelsMap.set(task.id, labelsResponse.data || [])
          }
        }
        setTaskLabels(labelsMap)
      } else {
        setError(tasksResponse.error || 'Failed to load tasks')
      }

      if (projectsResponse.success) {
        setProjects(projectsResponse.data || [])
      }

      if (labelsResponse.success) {
        setAllLabels(labelsResponse.data || [])
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
    
    setLoading(false)
  }

  const handleCreateTask = async (data: CreateTask, labelIds: number[]) => {
    setIsSubmitting(true)
    const response = await window.electronAPI.database.tasks.create(data)
    
    if (response.success && response.data) {
      for (const labelId of labelIds) {
        await window.electronAPI.database.tasks.addLabel(response.data.id, labelId)
      }
      setIsModalOpen(false)
      loadData()
    } else {
      setError(response.error || 'Failed to create task')
    }
    
    setIsSubmitting(false)
  }

  const handleUpdateTask = async (data: CreateTask, labelIds: number[]) => {
    if (!editingTask) return

    setIsSubmitting(true)
    const response = await window.electronAPI.database.tasks.update(editingTask.id, data)
    
    if (response.success) {
      const existingLabels = taskLabels.get(editingTask.id) || []
      const existingLabelIds = existingLabels.map(l => l.id)
      
      const toAdd = labelIds.filter(id => !existingLabelIds.includes(id))
      const toRemove = existingLabelIds.filter(id => !labelIds.includes(id))
      
      for (const labelId of toAdd) {
        await window.electronAPI.database.tasks.addLabel(editingTask.id, labelId)
      }
      
      for (const labelId of toRemove) {
        await window.electronAPI.database.tasks.removeLabel(editingTask.id, labelId)
      }
      
      setIsModalOpen(false)
      setEditingTask(null)
      loadData()
    } else {
      setError(response.error || 'Failed to update task')
    }
    
    setIsSubmitting(false)
  }

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    const response = await window.electronAPI.database.tasks.delete(id)

    if (response.success) {
      loadData()
    } else {
      setError(response.error || 'Failed to delete task')
    }
  }

  const handleStatusChange = async (taskId: number, status: Task['status']) => {
    const response = await window.electronAPI.database.tasks.update(taskId, { status })
    
    if (response.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
    } else {
      setError(response.error || 'Failed to update task status')
    }
  }

  const openCreateModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p>Loading tasks...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: viewMode === 'kanban' ? '100%' : '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>Tasks</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Manage and track your tasks
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ display: 'flex', backgroundColor: '#1e1e1e', borderRadius: '6px', padding: '0.25rem', border: '1px solid #333' }}>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('list')}
              style={{ borderRadius: '4px' }}
            >
              📋 List
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('kanban')}
              style={{ borderRadius: '4px' }}
            >
              📊 Kanban
            </button>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + New Task
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#7f1d1d',
          color: '#fca5a5',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{error}</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {viewMode === 'list' && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="form-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as typeof filterPriority)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            className="form-select"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            style={{ width: 'auto' }}
          >
            <option value="all">All Projects</option>
            <option value={0}>No Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{ width: 'auto' }}
          >
            <option value="updated">Sort by Updated</option>
            <option value="created">Sort by Created</option>
            <option value="due_date">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✓</div>
          <h3 className="empty-state-title">
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
          </h3>
          <p className="empty-state-description">
            {tasks.length === 0
              ? 'Create your first task to get started'
              : 'Try adjusting your filters or search query'}
          </p>
          {tasks.length === 0 && (
            <button className="btn btn-primary" onClick={openCreateModal}>
              Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredTasks.map(task => {
                const labels = taskLabels.get(task.id) || []
                const project = projects.find(p => p.id === task.project_id)
                
                return (
                  <div key={task.id} style={{ position: 'relative' }}>
                    <TaskCard
                      task={task}
                      labels={labels}
                      project={project}
                      onClick={() => openEditModal(task)}
                      onStatusChange={(status) => handleStatusChange(task.id, status)}
                    />
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTask(task.id)
                      }}
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <KanbanBoard
              tasks={filteredTasks}
              taskLabels={taskLabels}
              projects={projects}
              onTaskClick={openEditModal}
              onTaskStatusChange={handleStatusChange}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        size="large"
      >
        <TaskForm
          task={editingTask || undefined}
          taskLabels={editingTask ? taskLabels.get(editingTask.id) : undefined}
          projects={projects}
          labels={allLabels}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
