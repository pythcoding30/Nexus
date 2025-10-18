import { Label } from '../../../shared/database-types'

interface LabelTagProps {
  label: Label
  onRemove?: () => void
}

export default function LabelTag({ label, onRemove }: LabelTagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: label.color,
        color: '#fff'
      }}
    >
      {label.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem',
            opacity: 0.8
          }}
          aria-label="Remove label"
        >
          ✕
        </button>
      )}
    </span>
  )
}
