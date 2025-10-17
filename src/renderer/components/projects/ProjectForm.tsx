import { useState, useEffect } from 'react'
import { Project, CreateProject } from '../../../shared/database-types'
import '../../styles/components.css'

interface ProjectFormProps {
  project?: Project
  onSubmit: (data: CreateProject) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ProjectForm({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState<CreateProject>({
    name: '',
    description: '',
    status: 'active'
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreateProject, string>>>({})

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status
      })
    }
  }, [project])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateProject, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label required">
          Project Name
        </label>
        <input
          id="name"
          type="text"
          className="form-input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading}
          placeholder="Enter project name"
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
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
          placeholder="Enter project description"
        />
      </div>

      <div className="form-group">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          id="status"
          className="form-select"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as CreateProject['status'] })}
          disabled={isLoading}
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="completed">Completed</option>
        </select>
      </div>

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
            project ? 'Update Project' : 'Create Project'
          )}
        </button>
      </div>
    </form>
  )
}
