import { useState, useEffect } from 'react'

interface MetricsTabProps {
  creatorId: number
}

export default function MetricsTab({ creatorId }: MetricsTabProps) {
  const [metrics, setMetrics] = useState({
    totalNotes: 0,
    totalReports: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
  }, [creatorId])

  const loadMetrics = async () => {
    setLoading(true)

    try {
      const [notesResponse, reportsResponse, tasksResponse] = await Promise.all([
        window.electronAPI.database.creatorNotes.getAll(creatorId),
        window.electronAPI.database.performanceReports.getAll(creatorId),
        window.electronAPI.database.tasks.getByAssignee(creatorId)
      ])

      const notes = notesResponse.success ? notesResponse.data || [] : []
      const reports = reportsResponse.success ? reportsResponse.data || [] : []
      const tasks = tasksResponse.success ? tasksResponse.data || [] : []

      setMetrics({
        totalNotes: notes.length,
        totalReports: reports.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'done').length,
        inProgressTasks: tasks.filter(t => t.status === 'in_progress').length
      })
    } catch (err) {
      console.error('Failed to load metrics', err)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading metrics...</p>
      </div>
    )
  }

  const completionRate = metrics.totalTasks > 0
    ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
    : 0

  return (
    <div>
      <h2 style={{ margin: '0 0 1.5rem 0' }}>Performance Metrics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Total Notes
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
            {metrics.totalNotes}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Performance Reports
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>
            {metrics.totalReports}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Total Tasks
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
            {metrics.totalTasks}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Completed Tasks
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
            {metrics.completedTasks}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            In Progress
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>
            {metrics.inProgressTasks}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Completion Rate
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: completionRate >= 80 ? '#10b981' : completionRate >= 50 ? '#f59e0b' : '#ef4444' }}>
            {completionRate}%
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>Task Progress</h3>
        
        {metrics.totalTasks > 0 ? (
          <div>
            <div style={{
              width: '100%',
              height: '24px',
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <div style={{
                height: '100%',
                width: `${completionRate}%`,
                backgroundColor: '#10b981',
                transition: 'width 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {completionRate > 10 && `${completionRate}%`}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
              <span>{metrics.completedTasks} completed</span>
              <span>{metrics.totalTasks - metrics.completedTasks} remaining</span>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, color: '#6b7280' }}>No tasks assigned yet</p>
        )}
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Activity Overview</h3>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
          This creator has contributed {metrics.totalNotes} meeting notes, 
          submitted {metrics.totalReports} performance reports, 
          and has {metrics.totalTasks} tasks assigned with {metrics.completedTasks} completed.
        </p>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center' }}>
          💡 More detailed analytics and visualizations coming soon
        </p>
      </div>
    </div>
  )
}
