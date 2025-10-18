import { useState, useEffect, useCallback } from 'react'
import { Project } from '../../shared/database-types'
import Modal from '../components/ui/Modal'
import ProjectForm from '../components/projects/ProjectForm'
import '../styles/components.css'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | Project['status']>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('updated')

  const filterAndSortProjects = useCallback(() => {
    let filtered = [...projects]

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }, [projects, filterStatus, searchQuery, sortBy])

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    filterAndSortProjects()
  }, [filterAndSortProjects])

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await window.electronAPI.database.projects.getAll()
      
      if (response.success) {
        setProjects(response.data || [])
      } else {
        setError(response.error || 'Failed to load projects')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
    
    setLoading(false)
  }

  const handleCreateProject = async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true)
    const response = await window.electronAPI.database.projects.create(data)
    setIsSubmitting(false)

    if (response.success) {
      setIsModalOpen(false)
      loadProjects()
    } else {
      setError(response.error || 'Failed to create project')
    }
  }

  const handleUpdateProject = async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingProject) return

    setIsSubmitting(true)
    const response = await window.electronAPI.database.projects.update(editingProject.id, data)
    setIsSubmitting(false)

    if (response.success) {
      setIsModalOpen(false)
      setEditingProject(null)
      loadProjects()
    } else {
      setError(response.error || 'Failed to update project')
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return
    }

    const response = await window.electronAPI.database.projects.delete(id)

    if (response.success) {
      loadProjects()
    } else {
      setError(response.error || 'Failed to delete project')
    }
  }

  const openCreateModal = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return '#10b981'
      case 'completed':
        return '#3b82f6'
      case 'archived':
        return '#6b7280'
      default:
        return '#888'
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p>Loading projects...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>Projects</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Manage your projects and track progress
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + New Project
        </button>
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search projects..."
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
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          style={{ width: 'auto' }}
        >
          <option value="updated">Sort by Updated</option>
          <option value="created">Sort by Created</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <h3 className="empty-state-title">
            {projects.length === 0 ? 'No projects yet' : 'No projects found'}
          </h3>
          <p className="empty-state-description">
            {projects.length === 0
              ? 'Create your first project to get started'
              : 'Try adjusting your filters or search query'}
          </p>
          {projects.length === 0 && (
            <button className="btn btn-primary" onClick={openCreateModal}>
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
          {filteredProjects.map((project) => (
            <div key={project.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                  {project.name}
                </h3>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: getStatusColor(project.status) + '33',
                    color: getStatusColor(project.status),
                    textTransform: 'capitalize'
                  }}
                >
                  {project.status}
                </span>
              </div>
              
              <p style={{
                margin: '0 0 1rem 0',
                color: '#9ca3af',
                fontSize: '0.875rem',
                minHeight: '2.5rem'
              }}>
                {project.description || 'No description'}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid #333',
                fontSize: '0.813rem',
                color: '#6b7280'
              }}>
                <span>
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => openEditModal(project)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'Create Project'}
      >
        <ProjectForm
          project={editingProject || undefined}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
