export interface Project {
  id: number
  name: string
  description: string | null
  status: 'active' | 'archived' | 'completed'
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  project_id: number | null
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
  created_at: string
  updated_at: string
  assignee_id?: number
  position?: number
}

export interface TaskWithMetadata extends Task {
  labels?: Label[]
  assignee?: Creator
  project?: Project
}

export interface Page {
  id: number
  title: string
  content: string
  parent_id: number | null
  created_at: string
  updated_at: string
}

export interface Creator {
  id: number
  name: string
  email: string | null
  role: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface MeetingNote {
  id: number
  title: string
  content: string
  meeting_date: string
  attendees: string | null
  project_id: number | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: number
  title: string
  content: string
  report_type: string
  project_id: number | null
  created_by: number | null
  created_at: string
  updated_at: string
}

export interface Label {
  id: number
  name: string
  color: string
  created_at: string
}

export interface TaskLabel {
  task_id: number
  label_id: number
}

export interface ProjectMember {
  project_id: number
  creator_id: number
  role: string
  joined_at: string
}

export type CreateProject = Omit<Project, 'id' | 'created_at' | 'updated_at'>
export type UpdateProject = Partial<CreateProject>

export type CreateTask = Omit<Task, 'id' | 'created_at' | 'updated_at'>
export type UpdateTask = Partial<CreateTask>

export type CreatePage = Omit<Page, 'id' | 'created_at' | 'updated_at'>
export type UpdatePage = Partial<CreatePage>

export type CreateCreator = Omit<Creator, 'id' | 'created_at' | 'updated_at'>
export type UpdateCreator = Partial<CreateCreator>

export type CreateMeetingNote = Omit<MeetingNote, 'id' | 'created_at' | 'updated_at'>
export type UpdateMeetingNote = Partial<CreateMeetingNote>

export type CreateReport = Omit<Report, 'id' | 'created_at' | 'updated_at'>
export type UpdateReport = Partial<CreateReport>

export type CreateLabel = Omit<Label, 'id' | 'created_at'>
