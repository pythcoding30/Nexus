import type {
  Project, Task, Page, Creator, MeetingNote, Report, Label,
  CreateProject, UpdateProject,
  CreateTask, UpdateTask,
  CreatePage, UpdatePage,
  CreateCreator, UpdateCreator,
  CreateMeetingNote, UpdateMeetingNote,
  CreateReport, UpdateReport,
  CreateLabel
} from './database-types'

interface IpcResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface ElectronAPI {
  versions: {
    node: () => string
    chrome: () => string
    electron: () => string
  }
  platform: () => string
  send: (channel: string, data: unknown) => void
  receive: (channel: string, func: (...args: unknown[]) => void) => void
  database: {
    projects: {
      getAll: () => Promise<IpcResponse<Project[]>>
      get: (id: number) => Promise<IpcResponse<Project>>
      create: (data: CreateProject) => Promise<IpcResponse<Project>>
      update: (id: number, data: UpdateProject) => Promise<IpcResponse<Project>>
      delete: (id: number) => Promise<IpcResponse>
      getMembers: (projectId: number) => Promise<IpcResponse<Array<Creator & { role: string; joined_at: string }>>>
      addMember: (projectId: number, creatorId: number, role: string) => Promise<IpcResponse>
      removeMember: (projectId: number, creatorId: number) => Promise<IpcResponse>
      updateMemberRole: (projectId: number, creatorId: number, role: string) => Promise<IpcResponse>
    }
    tasks: {
      getAll: (projectId?: number) => Promise<IpcResponse<Task[]>>
      get: (id: number) => Promise<IpcResponse<Task>>
      create: (data: CreateTask) => Promise<IpcResponse<Task>>
      update: (id: number, data: UpdateTask) => Promise<IpcResponse<Task>>
      delete: (id: number) => Promise<IpcResponse>
      getLabels: (taskId: number) => Promise<IpcResponse<Label[]>>
      addLabel: (taskId: number, labelId: number) => Promise<IpcResponse>
      removeLabel: (taskId: number, labelId: number) => Promise<IpcResponse>
    }
    pages: {
      getAll: (parentId?: number | null) => Promise<IpcResponse<Page[]>>
      get: (id: number) => Promise<IpcResponse<Page>>
      create: (data: CreatePage) => Promise<IpcResponse<Page>>
      update: (id: number, data: UpdatePage) => Promise<IpcResponse<Page>>
      delete: (id: number) => Promise<IpcResponse>
    }
    creators: {
      getAll: () => Promise<IpcResponse<Creator[]>>
      get: (id: number) => Promise<IpcResponse<Creator>>
      create: (data: CreateCreator) => Promise<IpcResponse<Creator>>
      update: (id: number, data: UpdateCreator) => Promise<IpcResponse<Creator>>
      delete: (id: number) => Promise<IpcResponse>
    }
    meetingNotes: {
      getAll: (projectId?: number) => Promise<IpcResponse<MeetingNote[]>>
      get: (id: number) => Promise<IpcResponse<MeetingNote>>
      create: (data: CreateMeetingNote) => Promise<IpcResponse<MeetingNote>>
      update: (id: number, data: UpdateMeetingNote) => Promise<IpcResponse<MeetingNote>>
      delete: (id: number) => Promise<IpcResponse>
    }
    reports: {
      getAll: (projectId?: number) => Promise<IpcResponse<Report[]>>
      get: (id: number) => Promise<IpcResponse<Report>>
      create: (data: CreateReport) => Promise<IpcResponse<Report>>
      update: (id: number, data: UpdateReport) => Promise<IpcResponse<Report>>
      delete: (id: number) => Promise<IpcResponse>
    }
    labels: {
      getAll: () => Promise<IpcResponse<Label[]>>
      get: (id: number) => Promise<IpcResponse<Label>>
      create: (data: CreateLabel) => Promise<IpcResponse<Label>>
      delete: (id: number) => Promise<IpcResponse>
    }
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}
