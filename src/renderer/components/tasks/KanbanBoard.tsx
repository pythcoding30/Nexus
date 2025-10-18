import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { Task, Label, Project } from '../../../shared/database-types'
import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'

interface KanbanBoardProps {
  tasks: Task[]
  taskLabels: Map<number, Label[]>
  projects: Project[]
  onTaskClick: (task: Task) => void
  onTaskStatusChange: (taskId: number, status: Task['status']) => void
}

const COLUMNS: { id: Task['status']; title: string; icon: string }[] = [
  { id: 'todo', title: 'To Do', icon: '📋' },
  { id: 'in_progress', title: 'In Progress', icon: '🔄' },
  { id: 'done', title: 'Done', icon: '✅' },
  { id: 'cancelled', title: 'Cancelled', icon: '❌' }
]

export default function KanbanBoard({
  tasks,
  taskLabels,
  projects,
  onTaskClick,
  onTaskStatusChange
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id.toString() === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }

    const taskId = Number(active.id)
    const task = tasks.find(t => t.id === taskId)

    if (!task) {
      setActiveTask(null)
      return
    }

    const newStatus = over.id as Task['status']

    if (task.status !== newStatus && COLUMNS.some(col => col.id === newStatus)) {
      onTaskStatusChange(taskId, newStatus)
    }

    setActiveTask(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        minHeight: '500px'
      }}>
        {COLUMNS.map(column => {
          const columnTasks = getTasksByStatus(column.id)
          
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              icon={column.icon}
              count={columnTasks.length}
            >
              <SortableContext
                items={columnTasks.map(t => t.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {columnTasks.map(task => {
                    const labels = taskLabels.get(task.id) || []
                    const project = projects.find(p => p.id === task.project_id)
                    
                    return (
                      <div
                        key={task.id}
                        style={{ cursor: 'grab' }}
                        onClick={() => onTaskClick(task)}
                      >
                        <TaskCard
                          task={task}
                          labels={labels}
                          project={project}
                          isDragging={activeTask?.id === task.id}
                        />
                      </div>
                    )
                  })}
                </div>
              </SortableContext>
            </KanbanColumn>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            labels={taskLabels.get(activeTask.id) || []}
            project={projects.find(p => p.id === activeTask.project_id)}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
