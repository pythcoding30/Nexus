import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { initializeSchema, seedDatabase } from './schema'
import {
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
} from '../../shared/database-types'

class DatabaseService {
  private db: Database.Database | null = null

  initialize(): void {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'nexus-os.db')

    this.db = new Database(dbPath)
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('foreign_keys = ON')

    initializeSchema(this.db)
    seedDatabase(this.db)
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  private ensureDb(): Database.Database {
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    return this.db
  }

  getProjects(): Project[] {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as Project[]
  }

  getProject(id: number): Project | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined
  }

  createProject(data: CreateProject): Project {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO projects (name, description, status)
      VALUES (?, ?, ?)
    `)
    const result = stmt.run(data.name, data.description, data.status)
    return this.getProject(result.lastInsertRowid as number)!
  }

  updateProject(id: number, data: UpdateProject): Project | undefined {
    const db = this.ensureDb()
    const updates: string[] = []
    const values: unknown[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }
    if (data.status !== undefined) {
      updates.push('status = ?')
      values.push(data.status)
    }

    if (updates.length === 0) {
      return this.getProject(id)
    }

    updates.push("updated_at = datetime('now')")
    values.push(id)

    const stmt = db.prepare(`
      UPDATE projects
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)
    return this.getProject(id)
  }

  deleteProject(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id)
    return result.changes > 0
  }

  getTasks(projectId?: number): Task[] {
    const db = this.ensureDb()
    if (projectId !== undefined) {
      return db.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC').all(projectId) as Task[]
    }
    return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all() as Task[]
  }

  getTask(id: number): Task | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined
  }

  createTask(data: CreateTask): Task {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO tasks (project_id, title, description, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      data.project_id,
      data.title,
      data.description,
      data.status,
      data.priority,
      data.due_date
    )
    return this.getTask(result.lastInsertRowid as number)!
  }

  updateTask(id: number, data: UpdateTask): Task | undefined {
    const db = this.ensureDb()
    const updates: string[] = []
    const values: unknown[] = []

    if (data.project_id !== undefined) {
      updates.push('project_id = ?')
      values.push(data.project_id)
    }
    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }
    if (data.status !== undefined) {
      updates.push('status = ?')
      values.push(data.status)
    }
    if (data.priority !== undefined) {
      updates.push('priority = ?')
      values.push(data.priority)
    }
    if (data.due_date !== undefined) {
      updates.push('due_date = ?')
      values.push(data.due_date)
    }

    if (updates.length === 0) {
      return this.getTask(id)
    }

    updates.push("updated_at = datetime('now')")
    values.push(id)

    const stmt = db.prepare(`
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)
    return this.getTask(id)
  }

  deleteTask(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
    return result.changes > 0
  }

  getPages(parentId?: number | null): Page[] {
    const db = this.ensureDb()
    if (parentId === undefined) {
      return db.prepare('SELECT * FROM pages ORDER BY created_at DESC').all() as Page[]
    }
    if (parentId === null) {
      return db.prepare('SELECT * FROM pages WHERE parent_id IS NULL ORDER BY created_at DESC').all() as Page[]
    }
    return db.prepare('SELECT * FROM pages WHERE parent_id = ? ORDER BY created_at DESC').all(parentId) as Page[]
  }

  getPage(id: number): Page | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM pages WHERE id = ?').get(id) as Page | undefined
  }

  createPage(data: CreatePage): Page {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO pages (title, content, parent_id)
      VALUES (?, ?, ?)
    `)
    const result = stmt.run(data.title, data.content, data.parent_id)
    return this.getPage(result.lastInsertRowid as number)!
  }

  updatePage(id: number, data: UpdatePage): Page | undefined {
    const db = this.ensureDb()
    const updates: string[] = []
    const values: unknown[] = []

    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.content !== undefined) {
      updates.push('content = ?')
      values.push(data.content)
    }
    if (data.parent_id !== undefined) {
      updates.push('parent_id = ?')
      values.push(data.parent_id)
    }

    if (updates.length === 0) {
      return this.getPage(id)
    }

    updates.push("updated_at = datetime('now')")
    values.push(id)

    const stmt = db.prepare(`
      UPDATE pages
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)
    return this.getPage(id)
  }

  deletePage(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM pages WHERE id = ?').run(id)
    return result.changes > 0
  }

  getCreators(): Creator[] {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM creators ORDER BY name').all() as Creator[]
  }

  getCreator(id: number): Creator | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM creators WHERE id = ?').get(id) as Creator | undefined
  }

  createCreator(data: CreateCreator): Creator {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO creators (name, email, role, avatar_url)
      VALUES (?, ?, ?, ?)
    `)
    const result = stmt.run(data.name, data.email, data.role, data.avatar_url)
    return this.getCreator(result.lastInsertRowid as number)!
  }

  updateCreator(id: number, data: UpdateCreator): Creator | undefined {
    const db = this.ensureDb()
    const updates: string[] = []
    const values: unknown[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.email !== undefined) {
      updates.push('email = ?')
      values.push(data.email)
    }
    if (data.role !== undefined) {
      updates.push('role = ?')
      values.push(data.role)
    }
    if (data.avatar_url !== undefined) {
      updates.push('avatar_url = ?')
      values.push(data.avatar_url)
    }

    if (updates.length === 0) {
      return this.getCreator(id)
    }

    updates.push("updated_at = datetime('now')")
    values.push(id)

    const stmt = db.prepare(`
      UPDATE creators
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)
    return this.getCreator(id)
  }

  deleteCreator(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM creators WHERE id = ?').run(id)
    return result.changes > 0
  }

  getMeetingNotes(projectId?: number): MeetingNote[] {
    const db = this.ensureDb()
    if (projectId !== undefined) {
      return db.prepare('SELECT * FROM meeting_notes WHERE project_id = ? ORDER BY meeting_date DESC').all(projectId) as MeetingNote[]
    }
    return db.prepare('SELECT * FROM meeting_notes ORDER BY meeting_date DESC').all() as MeetingNote[]
  }

  getMeetingNote(id: number): MeetingNote | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM meeting_notes WHERE id = ?').get(id) as MeetingNote | undefined
  }

  createMeetingNote(data: CreateMeetingNote): MeetingNote {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO meeting_notes (title, content, meeting_date, attendees, project_id)
      VALUES (?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      data.title,
      data.content,
      data.meeting_date,
      data.attendees,
      data.project_id
    )
    return this.getMeetingNote(result.lastInsertRowid as number)!
  }

  updateMeetingNote(id: number, data: UpdateMeetingNote): MeetingNote | undefined {
    const db = this.ensureDb()
    const updates: string[] = []
    const values: unknown[] = []

    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.content !== undefined) {
      updates.push('content = ?')
      values.push(data.content)
    }
    if (data.meeting_date !== undefined) {
      updates.push('meeting_date = ?')
      values.push(data.meeting_date)
    }
    if (data.attendees !== undefined) {
      updates.push('attendees = ?')
      values.push(data.attendees)
    }
    if (data.project_id !== undefined) {
      updates.push('project_id = ?')
      values.push(data.project_id)
    }

    if (updates.length === 0) {
      return this.getMeetingNote(id)
    }

    updates.push("updated_at = datetime('now')")
    values.push(id)

    const stmt = db.prepare(`
      UPDATE meeting_notes
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)
    return this.getMeetingNote(id)
  }

  deleteMeetingNote(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM meeting_notes WHERE id = ?').run(id)
    return result.changes > 0
  }

  getReports(projectId?: number): Report[] {
    const db = this.ensureDb()
    if (projectId !== undefined) {
      return db.prepare('SELECT * FROM reports WHERE project_id = ? ORDER BY created_at DESC').all(projectId) as Report[]
    }
    return db.prepare('SELECT * FROM reports ORDER BY created_at DESC').all() as Report[]
  }

  getReport(id: number): Report | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as Report | undefined
  }

  createReport(data: CreateReport): Report {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO reports (title, content, report_type, project_id, created_by)
      VALUES (?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      data.title,
      data.content,
      data.report_type,
      data.project_id,
      data.created_by
    )
    return this.getReport(result.lastInsertRowid as number)!
  }

  updateReport(id: number, data: UpdateReport): Report | undefined {
    const db = this.ensureDb()
    const updates: string[] = []
    const values: unknown[] = []

    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.content !== undefined) {
      updates.push('content = ?')
      values.push(data.content)
    }
    if (data.report_type !== undefined) {
      updates.push('report_type = ?')
      values.push(data.report_type)
    }
    if (data.project_id !== undefined) {
      updates.push('project_id = ?')
      values.push(data.project_id)
    }
    if (data.created_by !== undefined) {
      updates.push('created_by = ?')
      values.push(data.created_by)
    }

    if (updates.length === 0) {
      return this.getReport(id)
    }

    updates.push("updated_at = datetime('now')")
    values.push(id)

    const stmt = db.prepare(`
      UPDATE reports
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)
    return this.getReport(id)
  }

  deleteReport(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM reports WHERE id = ?').run(id)
    return result.changes > 0
  }

  getLabels(): Label[] {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM labels ORDER BY name').all() as Label[]
  }

  getLabel(id: number): Label | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM labels WHERE id = ?').get(id) as Label | undefined
  }

  createLabel(data: CreateLabel): Label {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO labels (name, color)
      VALUES (?, ?)
    `)
    const result = stmt.run(data.name, data.color)
    return this.getLabel(result.lastInsertRowid as number)!
  }

  deleteLabel(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM labels WHERE id = ?').run(id)
    return result.changes > 0
  }

  getTaskLabels(taskId: number): Label[] {
    const db = this.ensureDb()
    return db.prepare(`
      SELECT l.* FROM labels l
      INNER JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.task_id = ?
      ORDER BY l.name
    `).all(taskId) as Label[]
  }

  addTaskLabel(taskId: number, labelId: number): boolean {
    const db = this.ensureDb()
    try {
      const stmt = db.prepare('INSERT INTO task_labels (task_id, label_id) VALUES (?, ?)')
      stmt.run(taskId, labelId)
      return true
    } catch (error) {
      return false
    }
  }

  removeTaskLabel(taskId: number, labelId: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM task_labels WHERE task_id = ? AND label_id = ?').run(taskId, labelId)
    return result.changes > 0
  }

  getProjectMembers(projectId: number): Array<Creator & { role: string; joined_at: string }> {
    const db = this.ensureDb()
    return db.prepare(`
      SELECT c.*, pm.role as member_role, pm.joined_at
      FROM creators c
      INNER JOIN project_members pm ON c.id = pm.creator_id
      WHERE pm.project_id = ?
      ORDER BY c.name
    `).all(projectId) as Array<Creator & { role: string; joined_at: string }>
  }

  addProjectMember(projectId: number, creatorId: number, role: string = 'member'): boolean {
    const db = this.ensureDb()
    try {
      const stmt = db.prepare('INSERT INTO project_members (project_id, creator_id, role) VALUES (?, ?, ?)')
      stmt.run(projectId, creatorId, role)
      return true
    } catch (error) {
      return false
    }
  }

  removeProjectMember(projectId: number, creatorId: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM project_members WHERE project_id = ? AND creator_id = ?').run(projectId, creatorId)
    return result.changes > 0
  }

  updateProjectMemberRole(projectId: number, creatorId: number, role: string): boolean {
    const db = this.ensureDb()
    const result = db.prepare('UPDATE project_members SET role = ? WHERE project_id = ? AND creator_id = ?').run(role, projectId, creatorId)
    return result.changes > 0
  }

  getCreatorNotes(creatorId: number): CreatorNote[] {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM creator_notes WHERE creator_id = ? ORDER BY created_at DESC').all(creatorId) as CreatorNote[]
  }

  getCreatorNote(id: number): CreatorNote | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM creator_notes WHERE id = ?').get(id) as CreatorNote | undefined
  }

  createCreatorNote(data: CreateCreatorNote): CreatorNote {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO creator_notes (creator_id, title, content)
      VALUES (?, ?, ?)
    `)
    const result = stmt.run(data.creator_id, data.title, data.content)
    return this.getCreatorNote(result.lastInsertRowid as number)!
  }

  updateCreatorNote(id: number, data: UpdateCreatorNote): CreatorNote | undefined {
    const db = this.ensureDb()
    const updates: string[] = []
    const values: unknown[] = []

    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.content !== undefined) {
      updates.push('content = ?')
      values.push(data.content)
    }

    if (updates.length === 0) {
      return this.getCreatorNote(id)
    }

    updates.push("updated_at = datetime('now')")
    values.push(id)

    const stmt = db.prepare(`
      UPDATE creator_notes
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)
    return this.getCreatorNote(id)
  }

  deleteCreatorNote(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM creator_notes WHERE id = ?').run(id)
    return result.changes > 0
  }

  getPerformanceReports(creatorId: number): PerformanceReport[] {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM performance_reports WHERE creator_id = ? ORDER BY uploaded_at DESC').all(creatorId) as PerformanceReport[]
  }

  getPerformanceReport(id: number): PerformanceReport | undefined {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM performance_reports WHERE id = ?').get(id) as PerformanceReport | undefined
  }

  createPerformanceReport(data: CreatePerformanceReport): PerformanceReport {
    const db = this.ensureDb()
    const stmt = db.prepare(`
      INSERT INTO performance_reports (creator_id, title, description, file_name, file_path, file_size, file_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      data.creator_id,
      data.title,
      data.description,
      data.file_name,
      data.file_path,
      data.file_size,
      data.file_type
    )
    return this.getPerformanceReport(result.lastInsertRowid as number)!
  }

  updatePerformanceReport(id: number, data: UpdatePerformanceReport): PerformanceReport | undefined {
    const db = this.ensureDb()
    const updates: string[] = []
    const values: unknown[] = []

    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }

    if (updates.length === 0) {
      return this.getPerformanceReport(id)
    }

    values.push(id)

    const stmt = db.prepare(`
      UPDATE performance_reports
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)
    return this.getPerformanceReport(id)
  }

  deletePerformanceReport(id: number): boolean {
    const db = this.ensureDb()
    const result = db.prepare('DELETE FROM performance_reports WHERE id = ?').run(id)
    return result.changes > 0
  }

  getTasksByAssignee(creatorId: number): Task[] {
    const db = this.ensureDb()
    return db.prepare('SELECT * FROM tasks WHERE assignee_id = ? ORDER BY created_at DESC').all(creatorId) as Task[]
  }
}

export const databaseService = new DatabaseService()
