import { useState, useEffect } from 'react'
import { Creator } from '../../../shared/database-types'

interface CreatorFormProps {
  creator?: Creator
  onSubmit: (data: Omit<Creator, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function CreatorForm({ creator, onSubmit, onCancel, isLoading }: CreatorFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (creator) {
      setName(creator.name)
      setEmail(creator.email || '')
      setRole(creator.role || '')
    }
  }, [creator])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name,
      email: email || null,
      role: role || null,
      avatar_url: null
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <label className="form-label" htmlFor="name">
          Name <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          placeholder="Enter creator name"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          placeholder="creator@example.com"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" htmlFor="role">
          Role
        </label>
        <input
          id="role"
          type="text"
          className="form-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isLoading}
          placeholder="e.g., Developer, Designer, Manager"
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
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
          {isLoading ? 'Saving...' : creator ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
