import { useState, useEffect } from 'react'
import type { Project } from '../../shared/database-types'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

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

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Projects</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Projects</h1>
        <div style={{ color: 'red', marginTop: '1rem' }}>
          Error: {error}
        </div>
        <button onClick={loadProjects} style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Projects</h1>
      <p>Database connection successful! Found {projects.length} projects.</p>
      
      <div style={{ marginTop: '2rem' }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#1e1e1e'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{project.name}</h3>
            <p style={{ margin: '0 0 0.5rem 0', color: '#888' }}>
              {project.description || 'No description'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
              <span>
                Status: <strong>{project.status}</strong>
              </span>
              <span style={{ color: '#666' }}>
                Created: {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
