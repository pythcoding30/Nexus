import { useState, useEffect } from 'react'
import { Task } from '../../../shared/database-types'
import Badge from '../ui/Badge'

interface AssignedTasksTabProps {
  creatorId: number
}

export default function AssignedTasksTab({ creatorId }: AssignedTasksTabProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
  }, [creatorId])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await window.electronAPI.database.tasks.getByAssignee(creatorId)

      if (response.success) {
        setTasks(response.data || [])
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
        return '#6b7280'
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

  const formatStatus = (status: Task['status']) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading tasks...</p>
      </div>
    )
  }

  return (
    <div>
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

      <h2 style={{ margin: '0 0 1.5rem 0' }}>Assigned Tasks</h2>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✓</div>
          <h3 className="empty-state-title">No tasks assigned</h3>
          <p className="empty-state-description">
            This creator has no tasks assigned yet
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map(task => (
            <div key={task.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                  {task.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: getStatusColor(task.status) + '33',
                      color: getStatusColor(task.status),
                      textTransform: 'capitalize'
                    }}
                  >
                    {formatStatus(task.status)}
                  </span>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: getPriorityColor(task.priority) + '33',
                      color: getPriorityColor(task.priority),
                      textTransform: 'capitalize'
                    }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>

              {task.description && (
                <p style={{
                  margin: '0 0 1rem 0',
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  {task.description}
                </p>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.813rem',
                color: '#6b7280',
                paddingTop: '0.75rem',
                borderTop: '1px solid #333'
              }}>
                <span>
                  Created {new Date(task.created_at).toLocaleDateString()}
                </span>
                {task.due_date && (
                  <>
                    <span>•</span>
                    <span>
                      Due {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
