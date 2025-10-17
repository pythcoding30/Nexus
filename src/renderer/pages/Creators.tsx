import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Creator } from '../../shared/database-types'
import Modal from '../components/ui/Modal'
import CreatorForm from '../components/creators/CreatorForm'
import '../styles/components.css'

export default function Creators() {
  const navigate = useNavigate()
  const [creators, setCreators] = useState<Creator[]>([])
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | string>('all')

  const filterCreators = useCallback(() => {
    let filtered = [...creators]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.role?.toLowerCase().includes(query)
      )
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(c => c.role === filterRole)
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name))

    setFilteredCreators(filtered)
  }, [creators, searchQuery, filterRole])

  useEffect(() => {
    loadCreators()
  }, [])

  useEffect(() => {
    filterCreators()
  }, [filterCreators])

  const loadCreators = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await window.electronAPI.database.creators.getAll()
      
      if (response.success) {
        setCreators(response.data || [])
      } else {
        setError(response.error || 'Failed to load creators')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
    
    setLoading(false)
  }

  const handleCreateCreator = async (data: Omit<Creator, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true)
    const response = await window.electronAPI.database.creators.create(data)
    setIsSubmitting(false)

    if (response.success) {
      setIsModalOpen(false)
      loadCreators()
    } else {
      setError(response.error || 'Failed to create creator')
    }
  }

  const handleUpdateCreator = async (data: Omit<Creator, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingCreator) return

    setIsSubmitting(true)
    const response = await window.electronAPI.database.creators.update(editingCreator.id, data)
    setIsSubmitting(false)

    if (response.success) {
      setIsModalOpen(false)
      setEditingCreator(null)
      loadCreators()
    } else {
      setError(response.error || 'Failed to update creator')
    }
  }

  const handleDeleteCreator = async (id: number) => {
    if (!confirm('Are you sure you want to delete this creator? This will also delete all associated data.')) {
      return
    }

    const response = await window.electronAPI.database.creators.delete(id)

    if (response.success) {
      loadCreators()
    } else {
      setError(response.error || 'Failed to delete creator')
    }
  }

  const openCreateModal = () => {
    setEditingCreator(null)
    setIsModalOpen(true)
  }

  const openEditModal = (creator: Creator) => {
    setEditingCreator(creator)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCreator(null)
  }

  const getUniqueRoles = () => {
    const roles = creators.map(c => c.role).filter((role): role is string => role !== null && role !== undefined)
    return [...new Set(roles)]
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p>Loading creators...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>Creators Hub</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Manage your team members and creators
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + New Creator
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
          placeholder="Search creators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        
        <select
          className="form-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="all">All Roles</option>
          {getUniqueRoles().map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {filteredCreators.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3 className="empty-state-title">
            {creators.length === 0 ? 'No creators yet' : 'No creators found'}
          </h3>
          <p className="empty-state-description">
            {creators.length === 0
              ? 'Add your first creator to get started'
              : 'Try adjusting your filters or search query'}
          </p>
          {creators.length === 0 && (
            <button className="btn btn-primary" onClick={openCreateModal}>
              Add Creator
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredCreators.map((creator) => (
            <div key={creator.id} className="card" style={{ cursor: 'pointer' }}>
              <div onClick={() => navigate(`/creators/${creator.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#10b981'
                  }}>
                    {creator.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', fontWeight: 600 }}>
                      {creator.name}
                    </h3>
                    {creator.role && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#3b82f633',
                        color: '#3b82f6'
                      }}>
                        {creator.role}
                      </span>
                    )}
                  </div>
                </div>
                
                {creator.email && (
                  <p style={{
                    margin: '0 0 0.5rem 0',
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                  }}>
                    ✉️ {creator.email}
                  </p>
                )}

                <div style={{
                  fontSize: '0.813rem',
                  color: '#6b7280',
                  marginTop: '1rem'
                }}>
                  Joined {new Date(creator.created_at).toLocaleDateString()}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #333',
                marginTop: '1rem'
              }}>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditModal(creator)
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteCreator(creator.id)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCreator ? 'Edit Creator' : 'Create Creator'}
      >
        <CreatorForm
          creator={editingCreator || undefined}
          onSubmit={editingCreator ? handleUpdateCreator : handleCreateCreator}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
