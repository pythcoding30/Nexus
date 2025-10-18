import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'

interface KanbanColumnProps {
  id: string
  title: string
  icon: string
  count: number
  children: ReactNode
}

export default function KanbanColumn({ id, title, icon, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '500px',
        border: isOver ? '2px solid #3b82f6' : '2px solid #2a2a2a',
        transition: 'border-color 0.2s'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #333'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>{icon}</span>
          <h3 style={{ margin: 0, fontSize: '0.938rem', fontWeight: 600 }}>
            {title}
          </h3>
        </div>
        <span style={{
          padding: '0.125rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: '#374151',
          color: '#9ca3af'
        }}>
          {count}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
