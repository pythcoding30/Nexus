# Projects & Tasks Module

This document describes the comprehensive Projects & Tasks management module implemented for Nexus OS.

## Features Implemented

### 1. Projects Management

#### Features
- **CRUD Operations**: Create, Read, Update, Delete projects via modal dialogs
- **List View**: Grid-based card layout showing all projects
- **Filtering**: Filter by project status (active, archived, completed)
- **Sorting**: Sort by name, created date, or updated date
- **Search**: Full-text search across project names and descriptions
- **Status Badges**: Visual indicators for project status

#### Components
- `src/renderer/pages/Projects.tsx` - Main projects page
- `src/renderer/components/projects/ProjectForm.tsx` - Project creation/editing form
- `src/renderer/components/ui/Modal.tsx` - Reusable modal dialog

### 2. Tasks Management

#### Features
- **CRUD Operations**: Create, Read, Update, Delete tasks via modal dialogs
- **Dual View Modes**:
  - **List View**: Vertical list with inline status updates
  - **Kanban Board**: Drag-and-drop board with status columns
- **Advanced Filtering**:
  - Filter by status (todo, in_progress, done, cancelled)
  - Filter by priority (low, medium, high, urgent)
  - Filter by project
- **Sorting**: Sort by title, created date, updated date, due date, or priority
- **Search**: Full-text search across task titles and descriptions
- **Label Management**: Add/remove labels from tasks
- **Task Metadata Display**:
  - Priority badges with color coding
  - Status badges
  - Due dates with overdue indicators
  - Associated project
  - Labels/tags

#### Components
- `src/renderer/pages/Tasks.tsx` - Main tasks page with view toggle
- `src/renderer/components/tasks/TaskForm.tsx` - Task creation/editing form
- `src/renderer/components/tasks/TaskCard.tsx` - Reusable task card component
- `src/renderer/components/tasks/KanbanBoard.tsx` - Kanban board with drag-and-drop
- `src/renderer/components/tasks/KanbanColumn.tsx` - Droppable column component

### 3. UI Components

#### Reusable Components
- **Modal** (`ui/Modal.tsx`): Configurable dialog with sizes (small/medium/large)
- **Badge** (`ui/Badge.tsx`): Status and priority badges
- **LabelTag** (`ui/LabelTag.tsx`): Tag component with optional remove button

#### Styling System
- `src/renderer/styles/modal.css` - Modal dialog styles
- `src/renderer/styles/components.css` - Reusable component styles (buttons, forms, badges, cards)

### 4. Drag & Drop

The Kanban board uses `@dnd-kit` for drag-and-drop functionality:
- **Drag tasks** between status columns
- **Visual feedback** during drag operations
- **Drag overlay** showing the dragged task
- **Instant updates** when dropping tasks in new columns

### 5. Navigation Integration

Projects and Tasks are integrated into the sidebar navigation:
- 📁 Projects - `/projects`
- ✓ Tasks - `/tasks`

## Database Schema

The module uses the existing SQLite database tables:

### Projects Table
- `id` - Auto-incrementing primary key
- `name` - Project name (required)
- `description` - Project description
- `status` - 'active' | 'archived' | 'completed'
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Tasks Table
- `id` - Auto-incrementing primary key
- `project_id` - Foreign key to projects (optional)
- `title` - Task title (required)
- `description` - Task description
- `status` - 'todo' | 'in_progress' | 'done' | 'cancelled'
- `priority` - 'low' | 'medium' | 'high' | 'urgent'
- `due_date` - Due date (optional)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Labels Table
- `id` - Auto-incrementing primary key
- `name` - Label name (unique)
- `color` - Hex color code
- `created_at` - Timestamp

### Task-Label Relationship
- `task_labels` - Many-to-many junction table

## API Usage

All database operations use the IPC bridge via `window.electronAPI.database`:

### Projects
```typescript
// Get all projects
const projects = await window.electronAPI.database.projects.getAll()

// Create project
const project = await window.electronAPI.database.projects.create({
  name: 'My Project',
  description: 'Description',
  status: 'active'
})

// Update project
await window.electronAPI.database.projects.update(projectId, { status: 'completed' })

// Delete project
await window.electronAPI.database.projects.delete(projectId)
```

### Tasks
```typescript
// Get all tasks
const tasks = await window.electronAPI.database.tasks.getAll()

// Get tasks for a specific project
const projectTasks = await window.electronAPI.database.tasks.getAll(projectId)

// Create task
const task = await window.electronAPI.database.tasks.create({
  project_id: 1,
  title: 'Task title',
  description: 'Description',
  status: 'todo',
  priority: 'high',
  due_date: '2024-12-31'
})

// Update task status
await window.electronAPI.database.tasks.update(taskId, { status: 'done' })

// Get task labels
const labels = await window.electronAPI.database.tasks.getLabels(taskId)

// Add label to task
await window.electronAPI.database.tasks.addLabel(taskId, labelId)

// Remove label from task
await window.electronAPI.database.tasks.removeLabel(taskId, labelId)
```

## State Management

The module uses React hooks for state management:
- `useState` - Component state
- `useEffect` - Side effects and data loading
- `useCallback` - Memoized callbacks to prevent unnecessary re-renders

### Key Patterns
1. **Loading States**: Display spinners during data fetch
2. **Error Handling**: Show user-friendly error messages with dismiss option
3. **Optimistic Updates**: Update status immediately, reload on success
4. **State Sync**: Reload data after CRUD operations to ensure consistency

## User Experience

### Projects Page
1. **Grid Layout**: Projects displayed in responsive card grid
2. **Quick Actions**: Edit and Delete buttons on each card
3. **Status Indicators**: Color-coded status badges
4. **Empty State**: Helpful message when no projects exist
5. **Modal Forms**: Clean, focused editing experience

### Tasks Page
1. **View Toggle**: Switch between List and Kanban views
2. **List View**:
   - Inline status updates via dropdown
   - Full task details visible
   - Delete button on each card
3. **Kanban View**:
   - Four columns: To Do, In Progress, Done, Cancelled
   - Drag tasks between columns
   - Task count per column
   - Visual drop zones
4. **Filters & Sort**: Comprehensive filtering and sorting options
5. **Empty State**: Helpful message when no tasks exist

## Future Enhancements

Potential improvements for future iterations:

1. **Task Assignees**: Add support for assigning tasks to team members
2. **Subtasks**: Implement hierarchical task relationships
3. **Comments**: Add commenting system for tasks
4. **Task Ordering**: Custom ordering within Kanban columns (persist position)
5. **Bulk Operations**: Select multiple tasks for batch updates
6. **Advanced Search**: Filter by labels, assignees, date ranges
7. **Quick Add**: Inline task creation in Kanban columns
8. **Task Details Panel**: Slide-out panel for detailed task information
9. **Activity Log**: Track changes to projects and tasks
10. **Export/Import**: Export tasks to CSV/JSON

## Technical Notes

### Dependencies
- `@dnd-kit/core` - Drag and drop core
- `@dnd-kit/sortable` - Sortable list utilities
- `@dnd-kit/utilities` - DnD helper utilities

### Performance Considerations
- Use `useCallback` for filter/sort functions to prevent unnecessary re-renders
- Memoize expensive computations
- Lazy load task labels to avoid N+1 queries
- Consider pagination for large task lists

### Accessibility
- Keyboard support for modal dialogs (ESC to close)
- Semantic HTML elements
- ARIA labels where appropriate
- Focus management in modals

## Testing Recommendations

1. **Component Tests**: Test individual components in isolation
2. **Integration Tests**: Test full CRUD flows
3. **E2E Tests**: Test user workflows (create project → add tasks → move in Kanban)
4. **Edge Cases**: Empty states, error handling, network failures
5. **Performance Tests**: Test with large numbers of projects/tasks
