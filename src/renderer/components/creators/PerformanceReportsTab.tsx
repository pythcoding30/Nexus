import { useState, useEffect } from 'react'
import { PerformanceReport } from '../../../shared/database-types'
import Modal from '../ui/Modal'

interface PerformanceReportsTabProps {
  creatorId: number
}

export default function PerformanceReportsTab({ creatorId }: PerformanceReportsTabProps) {
  const [reports, setReports] = useState<PerformanceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [selectedFilePath, setSelectedFilePath] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadReports()
  }, [creatorId])

  const loadReports = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await window.electronAPI.database.performanceReports.getAll(creatorId)

      if (response.success) {
        setReports(response.data || [])
      } else {
        setError(response.error || 'Failed to load reports')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }

    setLoading(false)
  }

  const openCreateModal = () => {
    setFormTitle('')
    setFormDescription('')
    setSelectedFilePath('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormTitle('')
    setFormDescription('')
    setSelectedFilePath('')
  }

  const handleSelectFile = async () => {
    const response = await window.electronAPI.file.selectFile()

    if (response.success && response.data) {
      setSelectedFilePath(response.data)
    } else if (response.error) {
      setError(response.error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formTitle.trim()) {
      setError('Report title is required')
      return
    }

    if (!selectedFilePath) {
      setError('Please select a file to upload')
      return
    }

    setIsSubmitting(true)

    try {
      const fileName = selectedFilePath.split(/[\\/]/).pop() || 'file'
      
      const uploadResponse = await window.electronAPI.file.saveUpload(selectedFilePath, fileName)

      if (!uploadResponse.success || !uploadResponse.data) {
        setError(uploadResponse.error || 'Failed to upload file')
        setIsSubmitting(false)
        return
      }

      const { file_name, file_path, file_size, file_type } = uploadResponse.data

      const response = await window.electronAPI.database.performanceReports.create({
        creator_id: creatorId,
        title: formTitle,
        description: formDescription || null,
        file_name,
        file_path,
        file_size,
        file_type
      })

      if (response.success) {
        closeModal()
        loadReports()
      } else {
        setError(response.error || 'Failed to create report')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }

    setIsSubmitting(false)
  }

  const handleDelete = async (report: PerformanceReport) => {
    if (!confirm('Are you sure you want to delete this report? This will also delete the uploaded file.')) {
      return
    }

    await window.electronAPI.file.deleteUpload(report.file_path)

    const response = await window.electronAPI.database.performanceReports.delete(report.id)

    if (response.success) {
      loadReports()
    } else {
      setError(response.error || 'Failed to delete report')
    }
  }

  const handleOpenFile = async (filePath: string) => {
    const response = await window.electronAPI.file.openExternal(filePath)

    if (!response.success) {
      setError(response.error || 'Failed to open file')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading reports...</p>
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
        <h2 style={{ margin: 0 }}>Performance Reports</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Upload Report
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No reports yet</h3>
          <p className="empty-state-description">
            Upload your first performance report to get started
          </p>
          <button className="btn btn-primary" onClick={openCreateModal}>
            Upload Report
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {reports.map(report => (
            <div key={report.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#3b82f633',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600 }}>
                    {report.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '0.813rem',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {report.file_name}
                  </p>
                </div>
              </div>

              {report.description && (
                <p style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  lineHeight: '1.5'
                }}>
                  {report.description}
                </p>
              )}

              <div style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.813rem',
                color: '#6b7280',
                marginBottom: '1rem'
              }}>
                <span>{formatFileSize(report.file_size)}</span>
                <span>•</span>
                <span>{new Date(report.uploaded_at).toLocaleDateString()}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleOpenFile(report.file_path)}
                  style={{ flex: 1 }}
                >
                  Open
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(report)}
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
        title="Upload Performance Report"
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
              placeholder="Enter report title"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-input"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter report description"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              File <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleSelectFile}
                disabled={isSubmitting}
              >
                Select File
              </button>
              {selectedFilePath && (
                <span style={{ fontSize: '0.875rem', color: '#9ca3af', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedFilePath.split(/[\\/]/).pop()}
                </span>
              )}
            </div>
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
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
