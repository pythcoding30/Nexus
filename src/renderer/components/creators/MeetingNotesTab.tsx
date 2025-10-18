import { useState, useEffect } from 'react'
import { CreatorNote } from '../../../shared/database-types'
import Modal from '../ui/Modal'
import RichTextEditor from '../ui/RichTextEditor'

interface MeetingNotesTabProps {
  creatorId: number
}

export default function MeetingNotesTab({ creatorId }: MeetingNotesTabProps) {
  const [notes, setNotes] = useState<CreatorNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<CreatorNote | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [creatorId])

  const loadNotes = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await window.electronAPI.database.creatorNotes.getAll(creatorId)

      if (response.success) {
        setNotes(response.data || [])
      } else {
        setError(response.error || 'Failed to load notes')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }

    setLoading(false)
  }

  const openCreateModal = () => {
    setEditingNote(null)
    setFormTitle('')
    setFormContent('')
    setIsModalOpen(true)
  }

  const openEditModal = (note: CreatorNote) => {
    setEditingNote(note)
    setFormTitle(note.title)
    setFormContent(note.content)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingNote(null)
    setFormTitle('')
    setFormContent('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formTitle.trim()) {
      setError('Note title is required')
      return
    }

    setIsSubmitting(true)

    try {
      if (editingNote) {
        const response = await window.electronAPI.database.creatorNotes.update(editingNote.id, {
          title: formTitle,
          content: formContent
        })

        if (response.success) {
          closeModal()
          loadNotes()
        } else {
          setError(response.error || 'Failed to update note')
        }
      } else {
        const response = await window.electronAPI.database.creatorNotes.create({
          creator_id: creatorId,
          title: formTitle,
          content: formContent
        })

        if (response.success) {
          closeModal()
          loadNotes()
        } else {
          setError(response.error || 'Failed to create note')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }

    setIsSubmitting(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }

    const response = await window.electronAPI.database.creatorNotes.delete(id)

    if (response.success) {
      loadNotes()
    } else {
      setError(response.error || 'Failed to delete note')
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading notes...</p>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Meeting Notes</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No notes yet</h3>
          <p className="empty-state-description">
            Create your first meeting note to get started
          </p>
          <button className="btn btn-primary" onClick={openCreateModal}>
            Create Note
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notes.map(note => (
            <div key={note.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{note.title}</h3>
                  <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                    {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => openEditModal(note)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(note.id)}>
                    Delete
                  </button>
                </div>
              </div>
              
              <div
                style={{
                  color: '#d1d5db',
                  lineHeight: '1.6',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingNote ? 'Edit Note' : 'Create Note'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="title">
              Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter note title"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              Content
            </label>
            <RichTextEditor
              value={formContent}
              onChange={setFormContent}
              placeholder="Enter note content..."
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingNote ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
