import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Creator, CreatorNote, PerformanceReport, Task } from '../../shared/database-types'
import MeetingNotesTab from '../components/creators/MeetingNotesTab'
import PerformanceReportsTab from '../components/creators/PerformanceReportsTab'
import AssignedTasksTab from '../components/creators/AssignedTasksTab'
import MetricsTab from '../components/creators/MetricsTab'
import '../styles/components.css'

type TabType = 'notes' | 'reports' | 'tasks' | 'metrics'

export default function CreatorDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('notes')

  useEffect(() => {
    loadCreator()
  }, [id])

  const loadCreator = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response = await window.electronAPI.database.creators.get(parseInt(id))

      if (response.success && response.data) {
        setCreator(response.data)
      } else {
        setError(response.error || 'Creator not found')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p>Loading creator...</p>
      </div>
    )
  }

  if (error || !creator) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#7f1d1d',
          color: '#fca5a5',
          borderRadius: '6px'
        }}>
          {error || 'Creator not found'}
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/creators')}>
          ← Back to Creators
        </button>
      </div>
    )
  }

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'notes', label: 'Meeting Notes', icon: '📝' },
    { id: 'reports', label: 'Performance Reports', icon: '📊' },
    { id: 'tasks', label: 'Assigned Tasks', icon: '✓' },
    { id: 'metrics', label: 'Metrics', icon: '📈' }
  ]

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <button
        className="btn btn-ghost"
        onClick={() => navigate('/creators')}
        style={{ marginBottom: '1rem' }}
      >
        ← Back to Creators
      </button>

      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 600,
            color: '#10b981'
          }}>
            {creator.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 0.5rem 0' }}>{creator.name}</h1>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {creator.role && (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: '#3b82f633',
                  color: '#3b82f6'
                }}>
                  {creator.role}
                </span>
              )}
              {creator.email && (
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  ✉️ {creator.email}
                </span>
              )}
              <span style={{ color: '#6b7280', fontSize: '0.813rem' }}>
                Joined {new Date(creator.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        borderBottom: '1px solid #333',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #10b981' : '2px solid transparent',
                color: activeTab === tab.id ? '#10b981' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'notes' && <MeetingNotesTab creatorId={creator.id} />}
        {activeTab === 'reports' && <PerformanceReportsTab creatorId={creator.id} />}
        {activeTab === 'tasks' && <AssignedTasksTab creatorId={creator.id} />}
        {activeTab === 'metrics' && <MetricsTab creatorId={creator.id} />}
      </div>
    </div>
  )
}
