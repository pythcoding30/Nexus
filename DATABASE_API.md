# Database API Documentation

## Overview

This document describes the SQLite database layer and IPC data services available in Nexus OS. The database is automatically initialized in the Electron main process and stored in the application's userData directory.

## Database Location

The SQLite database file is stored at:
- **Windows**: `%APPDATA%/nexus-os/nexus-os.db`
- **macOS**: `~/Library/Application Support/nexus-os/nexus-os.db`
- **Linux**: `~/.config/nexus-os/nexus-os.db`

## Data Models

### Project
```typescript
interface Project {
  id: number
  name: string
  description: string | null
  status: 'active' | 'archived' | 'completed'
  created_at: string
  updated_at: string
}
```

### Task
```typescript
interface Task {
  id: number
  project_id: number | null
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
  created_at: string
  updated_at: string
}
```

### Page
```typescript
interface Page {
  id: number
  title: string
  content: string
  parent_id: number | null
  created_at: string
  updated_at: string
}
```

### Creator
```typescript
interface Creator {
  id: number
  name: string
  email: string | null
  role: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
```

### MeetingNote
```typescript
interface MeetingNote {
  id: number
  title: string
  content: string
  meeting_date: string
  attendees: string | null
  project_id: number | null
  created_at: string
  updated_at: string
}
```

### Report
```typescript
interface Report {
  id: number
  title: string
  content: string
  report_type: string
  project_id: number | null
  created_by: number | null
  created_at: string
  updated_at: string
}
```

### Label
```typescript
interface Label {
  id: number
  name: string
  color: string
  created_at: string
}
```

## API Response Format

All database operations return a response object:

```typescript
interface IpcResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
```

## Usage from Renderer Process

All database operations are available via `window.electronAPI.database`. Here are examples for each module:

### Projects

```typescript
// Get all projects
const response = await window.electronAPI.database.projects.getAll()
if (response.success) {
  const projects = response.data // Project[]
}

// Get a specific project
const response = await window.electronAPI.database.projects.get(1)
if (response.success) {
  const project = response.data // Project
}

// Create a new project
const response = await window.electronAPI.database.projects.create({
  name: 'My New Project',
  description: 'Project description',
  status: 'active'
})
if (response.success) {
  const newProject = response.data // Project
}

// Update a project
const response = await window.electronAPI.database.projects.update(1, {
  status: 'completed'
})
if (response.success) {
  const updatedProject = response.data // Project
}

// Delete a project
const response = await window.electronAPI.database.projects.delete(1)
if (response.success) {
  // Project deleted successfully
}

// Get project members
const response = await window.electronAPI.database.projects.getMembers(1)
if (response.success) {
  const members = response.data // Array<Creator & { role: string; joined_at: string }>
}

// Add member to project
const response = await window.electronAPI.database.projects.addMember(1, 2, 'member')

// Remove member from project
const response = await window.electronAPI.database.projects.removeMember(1, 2)

// Update member role
const response = await window.electronAPI.database.projects.updateMemberRole(1, 2, 'lead')
```

### Tasks

```typescript
// Get all tasks (optionally filter by project)
const response = await window.electronAPI.database.tasks.getAll()
// or
const response = await window.electronAPI.database.tasks.getAll(1) // projectId

// Get a specific task
const response = await window.electronAPI.database.tasks.get(1)

// Create a new task
const response = await window.electronAPI.database.tasks.create({
  project_id: 1,
  title: 'Implement feature X',
  description: 'Detailed description',
  status: 'todo',
  priority: 'high',
  due_date: '2024-12-31'
})

// Update a task
const response = await window.electronAPI.database.tasks.update(1, {
  status: 'in_progress'
})

// Delete a task
const response = await window.electronAPI.database.tasks.delete(1)

// Get task labels
const response = await window.electronAPI.database.tasks.getLabels(1)

// Add label to task
const response = await window.electronAPI.database.tasks.addLabel(1, 2)

// Remove label from task
const response = await window.electronAPI.database.tasks.removeLabel(1, 2)
```

### Pages

```typescript
// Get all pages (optionally filter by parent)
const response = await window.electronAPI.database.pages.getAll()
// or get top-level pages
const response = await window.electronAPI.database.pages.getAll(null)
// or get child pages
const response = await window.electronAPI.database.pages.getAll(1) // parentId

// Get a specific page
const response = await window.electronAPI.database.pages.get(1)

// Create a new page
const response = await window.electronAPI.database.pages.create({
  title: 'New Page',
  content: '# Page content here',
  parent_id: null
})

// Update a page
const response = await window.electronAPI.database.pages.update(1, {
  content: 'Updated content'
})

// Delete a page
const response = await window.electronAPI.database.pages.delete(1)
```

### Creators

```typescript
// Get all creators
const response = await window.electronAPI.database.creators.getAll()

// Get a specific creator
const response = await window.electronAPI.database.creators.get(1)

// Create a new creator
const response = await window.electronAPI.database.creators.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Developer',
  avatar_url: null
})

// Update a creator
const response = await window.electronAPI.database.creators.update(1, {
  role: 'Senior Developer'
})

// Delete a creator
const response = await window.electronAPI.database.creators.delete(1)
```

### Meeting Notes

```typescript
// Get all meeting notes (optionally filter by project)
const response = await window.electronAPI.database.meetingNotes.getAll()
// or
const response = await window.electronAPI.database.meetingNotes.getAll(1) // projectId

// Get a specific meeting note
const response = await window.electronAPI.database.meetingNotes.get(1)

// Create a new meeting note
const response = await window.electronAPI.database.meetingNotes.create({
  title: 'Sprint Planning',
  content: 'Meeting notes...',
  meeting_date: '2024-10-20',
  attendees: 'Alice, Bob, Charlie',
  project_id: 1
})

// Update a meeting note
const response = await window.electronAPI.database.meetingNotes.update(1, {
  content: 'Updated notes'
})

// Delete a meeting note
const response = await window.electronAPI.database.meetingNotes.delete(1)
```

### Reports

```typescript
// Get all reports (optionally filter by project)
const response = await window.electronAPI.database.reports.getAll()
// or
const response = await window.electronAPI.database.reports.getAll(1) // projectId

// Get a specific report
const response = await window.electronAPI.database.reports.get(1)

// Create a new report
const response = await window.electronAPI.database.reports.create({
  title: 'Q4 Report',
  content: 'Report content...',
  report_type: 'quarterly',
  project_id: 1,
  created_by: 1
})

// Update a report
const response = await window.electronAPI.database.reports.update(1, {
  content: 'Updated report'
})

// Delete a report
const response = await window.electronAPI.database.reports.delete(1)
```

### Labels

```typescript
// Get all labels
const response = await window.electronAPI.database.labels.getAll()

// Get a specific label
const response = await window.electronAPI.database.labels.get(1)

// Create a new label
const response = await window.electronAPI.database.labels.create({
  name: 'urgent',
  color: '#ff0000'
})

// Delete a label
const response = await window.electronAPI.database.labels.delete(1)
```

## Error Handling

All API calls return a response object with a `success` flag. Always check this before accessing data:

```typescript
const response = await window.electronAPI.database.projects.getAll()

if (response.success) {
  // Operation succeeded
  const projects = response.data
  console.log('Projects:', projects)
} else {
  // Operation failed
  console.error('Error:', response.error)
  // Show error message to user
}
```

## React Usage Example

Here's a complete example of using the database API in a React component:

```typescript
import { useEffect, useState } from 'react'
import type { Project } from '../shared/database-types'

function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    
    const response = await window.electronAPI.database.projects.getAll()
    
    if (response.success) {
      setProjects(response.data || [])
    } else {
      setError(response.error || 'Failed to load projects')
    }
    
    setLoading(false)
  }

  const createProject = async () => {
    const response = await window.electronAPI.database.projects.create({
      name: 'New Project',
      description: 'A new project',
      status: 'active'
    })

    if (response.success) {
      loadProjects() // Reload the list
    } else {
      setError(response.error || 'Failed to create project')
    }
  }

  const deleteProject = async (id: number) => {
    const response = await window.electronAPI.database.projects.delete(id)

    if (response.success) {
      loadProjects() // Reload the list
    } else {
      setError(response.error || 'Failed to delete project')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Projects</h1>
      <button onClick={createProject}>Create Project</button>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>Status: {project.status}</p>
            <button onClick={() => deleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectsList
```

## Seed Data

The database is automatically seeded with sample data on first initialization:

- **3 Projects**: Nexus OS Development, Documentation, Marketing Campaign
- **6 Tasks**: Various tasks across different projects with different statuses and priorities
- **4 Pages**: Getting Started (with 2 sub-pages), API Reference
- **3 Creators**: Alice Johnson, Bob Smith, Charlie Davis
- **2 Meeting Notes**: Sprint Planning, Design Review
- **2 Reports**: Q3 Progress Report, Security Audit
- **4 Labels**: bug, feature, documentation, urgent
- Multiple project members and task-label relationships

You can view this seed data to understand the structure and use it as reference data during development.

## Database Schema

The database uses the following tables with relationships:

- `projects` - Main project entities
- `tasks` - Tasks that can be linked to projects
- `pages` - Hierarchical pages with parent-child relationships
- `creators` - Team members/users
- `meeting_notes` - Meeting notes linked to projects
- `reports` - Reports linked to projects and creators
- `labels` - Tags/labels for categorization
- `task_labels` - Many-to-many relationship between tasks and labels
- `project_members` - Many-to-many relationship between projects and creators

All tables include automatic timestamp management (created_at, updated_at) and proper foreign key constraints with cascading deletes where appropriate.

## Best Practices

1. **Always check response.success** before accessing data
2. **Handle errors gracefully** and display user-friendly error messages
3. **Validate input** before sending to the database (the IPC handlers do basic validation)
4. **Use TypeScript types** from `shared/database-types` for type safety
5. **Reload data** after create/update/delete operations to keep UI in sync
6. **Consider caching** frequently accessed data in component state
7. **Use proper loading states** to improve user experience
8. **Implement optimistic updates** for better perceived performance

## Security Notes

- The database is stored locally and not encrypted by default
- All IPC handlers include basic validation to prevent invalid data
- The preload script uses context isolation and sandbox for security
- No direct SQL queries are exposed to the renderer process
- All database operations go through validated IPC handlers
