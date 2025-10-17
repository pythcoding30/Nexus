import { Task, Label, Project } from '../../../shared/database-types'
import Badge from '../ui/Badge'
import LabelTag from '../ui/LabelTag'
import '../../styles/components.css'

interface TaskCardProps {
  task: Task
  labels?: Label[]
  project?: Project
  onClick?: () => void
  onStatusChange?: (status: Task['status']) => void
  isDragging?: boolean
}

export default function TaskCard({
  task,
  labels = [],
  project,
  onClick,
  onStatusChange,
  isDragging = false
}: TaskCardProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div
      className={`card card-clickable ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.938rem', fontWeight: 600, flex: 1 }}>
          {task.title}
        </h4>
        <Badge variant="priority" value={task.priority} />
      </div>

      {task.description && (
        <p style={{
          margin: '0 0 0.75rem 0',
          fontSize: '0.813rem',
          color: '#9ca3af',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {onStatusChange ? (
          <select
            className="form-select"
            value={task.status}
            onChange={(e) => {
              e.stopPropagation()
              onStatusChange(e.target.value as Task['status'])
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
        ) : (
          <Badge variant="status" value={task.status} />
        )}
        
        {labels.map(label => (
          <LabelTag key={label.id} label={label} />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {project && (
            <span>📁 {project.name}</span>
          )}
          {task.due_date && (
            <span style={{ color: isOverdue ? '#ef4444' : '#6b7280' }}>
              📅 {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
        <span style={{ color: '#4b5563' }}>
          #{task.id}
        </span>
      </div>
    </div>
  )
}
