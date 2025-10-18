import { useState, useEffect } from 'react'
import type { Task, Label } from '../../shared/database-types'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskLabels, setTaskLabels] = useState<Map<number, Label[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await window.electronAPI.database.tasks.getAll()
      
      if (response.success) {
        const tasksList = response.data || []
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
        setError(response.error || 'Failed to load tasks')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
    
    setLoading(false)
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return '#888'
      case 'in_progress':
        return '#3b82f6'
      case 'done':
        return '#10b981'
      case 'cancelled':
        return '#ef4444'
      default:
        return '#888'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return '#10b981'
      case 'medium':
        return '#f59e0b'
      case 'high':
        return '#ef4444'
      case 'urgent':
        return '#dc2626'
      default:
        return '#888'
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Tasks</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Tasks</h1>
        <div style={{ color: 'red', marginTop: '1rem' }}>
          Error: {error}
        </div>
        <button onClick={loadTasks} style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tasks</h1>
      <p>Found {tasks.length} tasks in the database.</p>
      
      <div style={{ marginTop: '2rem' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#1e1e1e'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{task.title}</h3>
              <span
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  backgroundColor: getPriorityColor(task.priority),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {task.priority}
              </span>
            </div>
            
            <p style={{ margin: '0 0 0.5rem 0', color: '#888' }}>
              {task.description || 'No description'}
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span style={{ color: getStatusColor(task.status) }}>
                Status: <strong>{task.status.replace('_', ' ')}</strong>
              </span>
              {task.due_date && (
                <span style={{ color: '#666' }}>
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>

            {taskLabels.get(task.id) && taskLabels.get(task.id)!.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {taskLabels.get(task.id)!.map((label) => (
                  <span
                    key={label.id}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      backgroundColor: label.color,
                      color: 'white'
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
