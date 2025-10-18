import { useState, useEffect } from 'react'
import { Task, CreateTask, Project, Label } from '../../../shared/database-types'
import LabelTag from '../ui/LabelTag'
import '../../styles/components.css'

interface TaskFormProps {
  task?: Task
  taskLabels?: Label[]
  projects?: Project[]
  labels?: Label[]
  onSubmit: (data: CreateTask, labelIds: number[]) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function TaskForm({
  task,
  taskLabels = [],
  projects = [],
  labels = [],
  onSubmit,
  onCancel,
  isLoading
}: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTask>({
    project_id: null,
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: null
  })

  const [selectedLabels, setSelectedLabels] = useState<number[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTask, string>>>({})

  useEffect(() => {
    if (task) {
      setFormData({
        project_id: task.project_id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date
      })
    }
    if (taskLabels.length > 0) {
      setSelectedLabels(taskLabels.map(l => l.id))
    }
  }, [task, taskLabels])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTask, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData, selectedLabels)
    }
  }

  const toggleLabel = (labelId: number) => {
    setSelectedLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title" className="form-label required">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          className="form-input"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={isLoading}
          placeholder="Enter task title"
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          className="form-textarea"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isLoading}
          placeholder="Enter task description"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as CreateTask['status'] })}
            disabled={isLoading}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            className="form-select"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as CreateTask['priority'] })}
            disabled={isLoading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="project" className="form-label">
            Project
          </label>
          <select
            id="project"
            className="form-select"
            value={formData.project_id || ''}
            onChange={(e) => setFormData({ ...formData, project_id: e.target.value ? Number(e.target.value) : null })}
            disabled={isLoading}
          >
            <option value="">No Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="due_date" className="form-label">
            Due Date
          </label>
          <input
            id="due_date"
            type="date"
            className="form-input"
            value={formData.due_date || ''}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value || null })}
            disabled={isLoading}
          />
        </div>
      </div>

      {labels.length > 0 && (
        <div className="form-group">
          <label className="form-label">Labels</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {labels.map(label => (
              <button
                key={label.id}
                type="button"
                onClick={() => toggleLabel(label.id)}
                style={{
                  opacity: selectedLabels.includes(label.id) ? 1 : 0.5,
                  cursor: 'pointer',
                  border: selectedLabels.includes(label.id) ? '2px solid #3b82f6' : '2px solid transparent',
                  borderRadius: '6px',
                  padding: '2px'
                }}
                disabled={isLoading}
              >
                <LabelTag label={label} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="modal-footer" style={{ padding: 0, border: 0, marginTop: '1.5rem' }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Saving...
            </>
          ) : (
            task ? 'Update Task' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  )
}
