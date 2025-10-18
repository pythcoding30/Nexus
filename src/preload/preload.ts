import { contextBridge, ipcRenderer } from 'electron'
import type {
  Project, Task, Page, Creator, MeetingNote, Report, Label,
  CreatorNote, PerformanceReport,
  CreateProject, UpdateProject,
  CreateTask, UpdateTask,
  CreatePage, UpdatePage,
  CreateCreator, UpdateCreator,
  CreateMeetingNote, UpdateMeetingNote,
  CreateReport, UpdateReport,
  CreateLabel,
  CreateCreatorNote, UpdateCreatorNote,
  CreatePerformanceReport, UpdatePerformanceReport
} from '../shared/database-types'

interface IpcResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

const databaseAPI = {
  projects: {
    getAll: (): Promise<IpcResponse<Project[]>> => ipcRenderer.invoke('db:projects:getAll'),
    get: (id: number): Promise<IpcResponse<Project>> => ipcRenderer.invoke('db:projects:get', id),
    create: (data: CreateProject): Promise<IpcResponse<Project>> => ipcRenderer.invoke('db:projects:create', data),
    update: (id: number, data: UpdateProject): Promise<IpcResponse<Project>> => ipcRenderer.invoke('db:projects:update', id, data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:projects:delete', id),
    getMembers: (projectId: number): Promise<IpcResponse<Array<Creator & { role: string; joined_at: string }>>> => ipcRenderer.invoke('db:projects:getMembers', projectId),
    addMember: (projectId: number, creatorId: number, role: string): Promise<IpcResponse> => ipcRenderer.invoke('db:projects:addMember', projectId, creatorId, role),
    removeMember: (projectId: number, creatorId: number): Promise<IpcResponse> => ipcRenderer.invoke('db:projects:removeMember', projectId, creatorId),
    updateMemberRole: (projectId: number, creatorId: number, role: string): Promise<IpcResponse> => ipcRenderer.invoke('db:projects:updateMemberRole', projectId, creatorId, role)
  },
  tasks: {
    getAll: (projectId?: number): Promise<IpcResponse<Task[]>> => ipcRenderer.invoke('db:tasks:getAll', projectId),
    get: (id: number): Promise<IpcResponse<Task>> => ipcRenderer.invoke('db:tasks:get', id),
    create: (data: CreateTask): Promise<IpcResponse<Task>> => ipcRenderer.invoke('db:tasks:create', data),
    update: (id: number, data: UpdateTask): Promise<IpcResponse<Task>> => ipcRenderer.invoke('db:tasks:update', id, data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:tasks:delete', id),
    getLabels: (taskId: number): Promise<IpcResponse<Label[]>> => ipcRenderer.invoke('db:tasks:getLabels', taskId),
    addLabel: (taskId: number, labelId: number): Promise<IpcResponse> => ipcRenderer.invoke('db:tasks:addLabel', taskId, labelId),
    removeLabel: (taskId: number, labelId: number): Promise<IpcResponse> => ipcRenderer.invoke('db:tasks:removeLabel', taskId, labelId),
    getByAssignee: (creatorId: number): Promise<IpcResponse<Task[]>> => ipcRenderer.invoke('db:tasks:getByAssignee', creatorId)
  },
  pages: {
    getAll: (parentId?: number | null): Promise<IpcResponse<Page[]>> => ipcRenderer.invoke('db:pages:getAll', parentId),
    get: (id: number): Promise<IpcResponse<Page>> => ipcRenderer.invoke('db:pages:get', id),
    create: (data: CreatePage): Promise<IpcResponse<Page>> => ipcRenderer.invoke('db:pages:create', data),
    update: (id: number, data: UpdatePage): Promise<IpcResponse<Page>> => ipcRenderer.invoke('db:pages:update', id, data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:pages:delete', id)
  },
  creators: {
    getAll: (): Promise<IpcResponse<Creator[]>> => ipcRenderer.invoke('db:creators:getAll'),
    get: (id: number): Promise<IpcResponse<Creator>> => ipcRenderer.invoke('db:creators:get', id),
    create: (data: CreateCreator): Promise<IpcResponse<Creator>> => ipcRenderer.invoke('db:creators:create', data),
    update: (id: number, data: UpdateCreator): Promise<IpcResponse<Creator>> => ipcRenderer.invoke('db:creators:update', id, data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:creators:delete', id)
  },
  meetingNotes: {
    getAll: (projectId?: number): Promise<IpcResponse<MeetingNote[]>> => ipcRenderer.invoke('db:meetingNotes:getAll', projectId),
    get: (id: number): Promise<IpcResponse<MeetingNote>> => ipcRenderer.invoke('db:meetingNotes:get', id),
    create: (data: CreateMeetingNote): Promise<IpcResponse<MeetingNote>> => ipcRenderer.invoke('db:meetingNotes:create', data),
    update: (id: number, data: UpdateMeetingNote): Promise<IpcResponse<MeetingNote>> => ipcRenderer.invoke('db:meetingNotes:update', id, data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:meetingNotes:delete', id)
  },
  reports: {
    getAll: (projectId?: number): Promise<IpcResponse<Report[]>> => ipcRenderer.invoke('db:reports:getAll', projectId),
    get: (id: number): Promise<IpcResponse<Report>> => ipcRenderer.invoke('db:reports:get', id),
    create: (data: CreateReport): Promise<IpcResponse<Report>> => ipcRenderer.invoke('db:reports:create', data),
    update: (id: number, data: UpdateReport): Promise<IpcResponse<Report>> => ipcRenderer.invoke('db:reports:update', id, data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:reports:delete', id)
  },
  labels: {
    getAll: (): Promise<IpcResponse<Label[]>> => ipcRenderer.invoke('db:labels:getAll'),
    get: (id: number): Promise<IpcResponse<Label>> => ipcRenderer.invoke('db:labels:get', id),
    create: (data: CreateLabel): Promise<IpcResponse<Label>> => ipcRenderer.invoke('db:labels:create', data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:labels:delete', id)
  },
  creatorNotes: {
    getAll: (creatorId: number): Promise<IpcResponse<CreatorNote[]>> => ipcRenderer.invoke('db:creatorNotes:getAll', creatorId),
    get: (id: number): Promise<IpcResponse<CreatorNote>> => ipcRenderer.invoke('db:creatorNotes:get', id),
    create: (data: CreateCreatorNote): Promise<IpcResponse<CreatorNote>> => ipcRenderer.invoke('db:creatorNotes:create', data),
    update: (id: number, data: UpdateCreatorNote): Promise<IpcResponse<CreatorNote>> => ipcRenderer.invoke('db:creatorNotes:update', id, data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:creatorNotes:delete', id)
  },
  performanceReports: {
    getAll: (creatorId: number): Promise<IpcResponse<PerformanceReport[]>> => ipcRenderer.invoke('db:performanceReports:getAll', creatorId),
    get: (id: number): Promise<IpcResponse<PerformanceReport>> => ipcRenderer.invoke('db:performanceReports:get', id),
    create: (data: CreatePerformanceReport): Promise<IpcResponse<PerformanceReport>> => ipcRenderer.invoke('db:performanceReports:create', data),
    update: (id: number, data: UpdatePerformanceReport): Promise<IpcResponse<PerformanceReport>> => ipcRenderer.invoke('db:performanceReports:update', id, data),
    delete: (id: number): Promise<IpcResponse> => ipcRenderer.invoke('db:performanceReports:delete', id)
  }
}

const fileAPI = {
  selectFile: (): Promise<IpcResponse<string>> => ipcRenderer.invoke('file:selectFile'),
  saveUpload: (sourcePath: string, fileName: string): Promise<IpcResponse<{ file_name: string; file_path: string; file_size: number; file_type: string }>> => 
    ipcRenderer.invoke('file:saveUpload', sourcePath, fileName),
  openExternal: (filePath: string): Promise<IpcResponse> => ipcRenderer.invoke('file:openExternal', filePath),
  deleteUpload: (filePath: string): Promise<IpcResponse> => ipcRenderer.invoke('file:deleteUpload', filePath)
}

const api = {
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
  },
  platform: () => process.platform,
  send: (channel: string, data: unknown) => {
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: (...args: unknown[]) => void) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args))
    }
  },
  database: databaseAPI,
  file: fileAPI
}

contextBridge.exposeInMainWorld('electronAPI', api)

export type ElectronAPI = typeof api
