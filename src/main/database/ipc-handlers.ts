import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { databaseService } from './database-service'
import {
  CreateProject, UpdateProject,
  CreateTask, UpdateTask,
  CreatePage, UpdatePage,
  CreateCreator, UpdateCreator,
  CreateMeetingNote, UpdateMeetingNote,
  CreateReport, UpdateReport,
  CreateLabel,
  CreateCreatorNote, UpdateCreatorNote,
  CreatePerformanceReport, UpdatePerformanceReport
} from '../../shared/database-types'

interface IpcResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

function handleError(error: unknown): IpcResponse {
  console.error('Database operation error:', error)
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error occurred'
  }
}

export function registerDatabaseHandlers(): void {
  ipcMain.handle('db:projects:getAll', async (): Promise<IpcResponse> => {
    try {
      const projects = databaseService.getProjects()
      return { success: true, data: projects }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:projects:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const project = databaseService.getProject(id)
      if (!project) {
        return { success: false, error: 'Project not found' }
      }
      return { success: true, data: project }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:projects:create', async (_event: IpcMainInvokeEvent, data: CreateProject): Promise<IpcResponse> => {
    try {
      if (!data.name || data.name.trim().length === 0) {
        return { success: false, error: 'Project name is required' }
      }
      const project = databaseService.createProject(data)
      return { success: true, data: project }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:projects:update', async (_event: IpcMainInvokeEvent, id: number, data: UpdateProject): Promise<IpcResponse> => {
    try {
      const project = databaseService.updateProject(id, data)
      if (!project) {
        return { success: false, error: 'Project not found' }
      }
      return { success: true, data: project }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:projects:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deleteProject(id)
      if (!success) {
        return { success: false, error: 'Project not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:getAll', async (_event: IpcMainInvokeEvent, projectId?: number): Promise<IpcResponse> => {
    try {
      const tasks = databaseService.getTasks(projectId)
      return { success: true, data: tasks }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const task = databaseService.getTask(id)
      if (!task) {
        return { success: false, error: 'Task not found' }
      }
      return { success: true, data: task }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:create', async (_event: IpcMainInvokeEvent, data: CreateTask): Promise<IpcResponse> => {
    try {
      if (!data.title || data.title.trim().length === 0) {
        return { success: false, error: 'Task title is required' }
      }
      const task = databaseService.createTask(data)
      return { success: true, data: task }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:update', async (_event: IpcMainInvokeEvent, id: number, data: UpdateTask): Promise<IpcResponse> => {
    try {
      const task = databaseService.updateTask(id, data)
      if (!task) {
        return { success: false, error: 'Task not found' }
      }
      return { success: true, data: task }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deleteTask(id)
      if (!success) {
        return { success: false, error: 'Task not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:pages:getAll', async (_event: IpcMainInvokeEvent, parentId?: number | null): Promise<IpcResponse> => {
    try {
      const pages = databaseService.getPages(parentId)
      return { success: true, data: pages }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:pages:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const page = databaseService.getPage(id)
      if (!page) {
        return { success: false, error: 'Page not found' }
      }
      return { success: true, data: page }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:pages:create', async (_event: IpcMainInvokeEvent, data: CreatePage): Promise<IpcResponse> => {
    try {
      if (!data.title || data.title.trim().length === 0) {
        return { success: false, error: 'Page title is required' }
      }
      const page = databaseService.createPage(data)
      return { success: true, data: page }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:pages:update', async (_event: IpcMainInvokeEvent, id: number, data: UpdatePage): Promise<IpcResponse> => {
    try {
      const page = databaseService.updatePage(id, data)
      if (!page) {
        return { success: false, error: 'Page not found' }
      }
      return { success: true, data: page }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:pages:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deletePage(id)
      if (!success) {
        return { success: false, error: 'Page not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creators:getAll', async (): Promise<IpcResponse> => {
    try {
      const creators = databaseService.getCreators()
      return { success: true, data: creators }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creators:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const creator = databaseService.getCreator(id)
      if (!creator) {
        return { success: false, error: 'Creator not found' }
      }
      return { success: true, data: creator }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creators:create', async (_event: IpcMainInvokeEvent, data: CreateCreator): Promise<IpcResponse> => {
    try {
      if (!data.name || data.name.trim().length === 0) {
        return { success: false, error: 'Creator name is required' }
      }
      const creator = databaseService.createCreator(data)
      return { success: true, data: creator }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creators:update', async (_event: IpcMainInvokeEvent, id: number, data: UpdateCreator): Promise<IpcResponse> => {
    try {
      const creator = databaseService.updateCreator(id, data)
      if (!creator) {
        return { success: false, error: 'Creator not found' }
      }
      return { success: true, data: creator }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creators:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deleteCreator(id)
      if (!success) {
        return { success: false, error: 'Creator not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:meetingNotes:getAll', async (_event: IpcMainInvokeEvent, projectId?: number): Promise<IpcResponse> => {
    try {
      const notes = databaseService.getMeetingNotes(projectId)
      return { success: true, data: notes }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:meetingNotes:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const note = databaseService.getMeetingNote(id)
      if (!note) {
        return { success: false, error: 'Meeting note not found' }
      }
      return { success: true, data: note }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:meetingNotes:create', async (_event: IpcMainInvokeEvent, data: CreateMeetingNote): Promise<IpcResponse> => {
    try {
      if (!data.title || data.title.trim().length === 0) {
        return { success: false, error: 'Meeting note title is required' }
      }
      const note = databaseService.createMeetingNote(data)
      return { success: true, data: note }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:meetingNotes:update', async (_event: IpcMainInvokeEvent, id: number, data: UpdateMeetingNote): Promise<IpcResponse> => {
    try {
      const note = databaseService.updateMeetingNote(id, data)
      if (!note) {
        return { success: false, error: 'Meeting note not found' }
      }
      return { success: true, data: note }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:meetingNotes:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deleteMeetingNote(id)
      if (!success) {
        return { success: false, error: 'Meeting note not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:reports:getAll', async (_event: IpcMainInvokeEvent, projectId?: number): Promise<IpcResponse> => {
    try {
      const reports = databaseService.getReports(projectId)
      return { success: true, data: reports }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:reports:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const report = databaseService.getReport(id)
      if (!report) {
        return { success: false, error: 'Report not found' }
      }
      return { success: true, data: report }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:reports:create', async (_event: IpcMainInvokeEvent, data: CreateReport): Promise<IpcResponse> => {
    try {
      if (!data.title || data.title.trim().length === 0) {
        return { success: false, error: 'Report title is required' }
      }
      const report = databaseService.createReport(data)
      return { success: true, data: report }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:reports:update', async (_event: IpcMainInvokeEvent, id: number, data: UpdateReport): Promise<IpcResponse> => {
    try {
      const report = databaseService.updateReport(id, data)
      if (!report) {
        return { success: false, error: 'Report not found' }
      }
      return { success: true, data: report }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:reports:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deleteReport(id)
      if (!success) {
        return { success: false, error: 'Report not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:labels:getAll', async (): Promise<IpcResponse> => {
    try {
      const labels = databaseService.getLabels()
      return { success: true, data: labels }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:labels:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const label = databaseService.getLabel(id)
      if (!label) {
        return { success: false, error: 'Label not found' }
      }
      return { success: true, data: label }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:labels:create', async (_event: IpcMainInvokeEvent, data: CreateLabel): Promise<IpcResponse> => {
    try {
      if (!data.name || data.name.trim().length === 0) {
        return { success: false, error: 'Label name is required' }
      }
      const label = databaseService.createLabel(data)
      return { success: true, data: label }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:labels:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deleteLabel(id)
      if (!success) {
        return { success: false, error: 'Label not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:getLabels', async (_event: IpcMainInvokeEvent, taskId: number): Promise<IpcResponse> => {
    try {
      const labels = databaseService.getTaskLabels(taskId)
      return { success: true, data: labels }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:addLabel', async (_event: IpcMainInvokeEvent, taskId: number, labelId: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.addTaskLabel(taskId, labelId)
      if (!success) {
        return { success: false, error: 'Failed to add label to task' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:removeLabel', async (_event: IpcMainInvokeEvent, taskId: number, labelId: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.removeTaskLabel(taskId, labelId)
      if (!success) {
        return { success: false, error: 'Failed to remove label from task' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:projects:getMembers', async (_event: IpcMainInvokeEvent, projectId: number): Promise<IpcResponse> => {
    try {
      const members = databaseService.getProjectMembers(projectId)
      return { success: true, data: members }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:projects:addMember', async (_event: IpcMainInvokeEvent, projectId: number, creatorId: number, role: string): Promise<IpcResponse> => {
    try {
      const success = databaseService.addProjectMember(projectId, creatorId, role)
      if (!success) {
        return { success: false, error: 'Failed to add member to project' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:projects:removeMember', async (_event: IpcMainInvokeEvent, projectId: number, creatorId: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.removeProjectMember(projectId, creatorId)
      if (!success) {
        return { success: false, error: 'Failed to remove member from project' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:projects:updateMemberRole', async (_event: IpcMainInvokeEvent, projectId: number, creatorId: number, role: string): Promise<IpcResponse> => {
    try {
      const success = databaseService.updateProjectMemberRole(projectId, creatorId, role)
      if (!success) {
        return { success: false, error: 'Failed to update member role' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creatorNotes:getAll', async (_event: IpcMainInvokeEvent, creatorId: number): Promise<IpcResponse> => {
    try {
      const notes = databaseService.getCreatorNotes(creatorId)
      return { success: true, data: notes }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creatorNotes:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const note = databaseService.getCreatorNote(id)
      if (!note) {
        return { success: false, error: 'Note not found' }
      }
      return { success: true, data: note }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creatorNotes:create', async (_event: IpcMainInvokeEvent, data: CreateCreatorNote): Promise<IpcResponse> => {
    try {
      if (!data.title || data.title.trim().length === 0) {
        return { success: false, error: 'Note title is required' }
      }
      const note = databaseService.createCreatorNote(data)
      return { success: true, data: note }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creatorNotes:update', async (_event: IpcMainInvokeEvent, id: number, data: UpdateCreatorNote): Promise<IpcResponse> => {
    try {
      const note = databaseService.updateCreatorNote(id, data)
      if (!note) {
        return { success: false, error: 'Note not found' }
      }
      return { success: true, data: note }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:creatorNotes:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deleteCreatorNote(id)
      if (!success) {
        return { success: false, error: 'Note not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:performanceReports:getAll', async (_event: IpcMainInvokeEvent, creatorId: number): Promise<IpcResponse> => {
    try {
      const reports = databaseService.getPerformanceReports(creatorId)
      return { success: true, data: reports }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:performanceReports:get', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const report = databaseService.getPerformanceReport(id)
      if (!report) {
        return { success: false, error: 'Report not found' }
      }
      return { success: true, data: report }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:performanceReports:create', async (_event: IpcMainInvokeEvent, data: CreatePerformanceReport): Promise<IpcResponse> => {
    try {
      if (!data.title || data.title.trim().length === 0) {
        return { success: false, error: 'Report title is required' }
      }
      const report = databaseService.createPerformanceReport(data)
      return { success: true, data: report }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:performanceReports:update', async (_event: IpcMainInvokeEvent, id: number, data: UpdatePerformanceReport): Promise<IpcResponse> => {
    try {
      const report = databaseService.updatePerformanceReport(id, data)
      if (!report) {
        return { success: false, error: 'Report not found' }
      }
      return { success: true, data: report }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:performanceReports:delete', async (_event: IpcMainInvokeEvent, id: number): Promise<IpcResponse> => {
    try {
      const success = databaseService.deletePerformanceReport(id)
      if (!success) {
        return { success: false, error: 'Report not found' }
      }
      return { success: true }
    } catch (error) {
      return handleError(error)
    }
  })

  ipcMain.handle('db:tasks:getByAssignee', async (_event: IpcMainInvokeEvent, creatorId: number): Promise<IpcResponse> => {
    try {
      const tasks = databaseService.getTasksByAssignee(creatorId)
      return { success: true, data: tasks }
    } catch (error) {
      return handleError(error)
    }
  })
}
