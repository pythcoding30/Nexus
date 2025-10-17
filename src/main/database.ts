import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { Page, Section, CreatePageParams, UpdatePageParams, ReorderPageParams } from '../shared/types';

export class KnowledgeBaseDB {
  private db: Database.Database;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'knowledge-base.db');
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sections (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        "order" INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        parent_id TEXT,
        "order" INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        author TEXT NOT NULL DEFAULT 'User',
        FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
      CREATE INDEX IF NOT EXISTS idx_pages_order ON pages("order");
    `);

    const sectionsCount = this.db.prepare('SELECT COUNT(*) as count FROM sections').get() as { count: number };
    if (sectionsCount.count === 0) {
      this.initializeDefaultSections();
    }
  }

  private initializeDefaultSections(): void {
    const defaultSections: Section[] = [
      { id: 'getting-started', title: 'Getting Started', order: 0 },
      { id: 'documentation', title: 'Documentation', order: 1 },
      { id: 'guides', title: 'Guides', order: 2 },
      { id: 'references', title: 'References', order: 3 },
    ];

    const insert = this.db.prepare('INSERT INTO sections (id, title, "order") VALUES (?, ?, ?)');
    for (const section of defaultSections) {
      insert.run(section.id, section.title, section.order);
    }
  }

  getSections(): Section[] {
    return this.db.prepare('SELECT id, title, "order" FROM sections ORDER BY "order"').all() as Section[];
  }

  getAllPages(): Page[] {
    const rows = this.db.prepare(`
      SELECT id, title, content, parent_id as parentId, "order", 
             created_at as createdAt, updated_at as updatedAt, author
      FROM pages
      ORDER BY "order"
    `).all() as Page[];
    return rows;
  }

  getPage(id: string): Page | null {
    const row = this.db.prepare(`
      SELECT id, title, content, parent_id as parentId, "order",
             created_at as createdAt, updated_at as updatedAt, author
      FROM pages
      WHERE id = ?
    `).get(id) as Page | undefined;
    return row || null;
  }

  getChildPages(parentId: string | null): Page[] {
    const rows = this.db.prepare(`
      SELECT id, title, content, parent_id as parentId, "order",
             created_at as createdAt, updated_at as updatedAt, author
      FROM pages
      WHERE parent_id ${parentId === null ? 'IS NULL' : '= ?'}
      ORDER BY "order"
    `).all(parentId === null ? [] : [parentId]) as Page[];
    return rows;
  }

  createPage(params: CreatePageParams): Page {
    const id = this.generateId();
    const now = new Date().toISOString();
    const content = params.content || '';
    
    const maxOrder = this.db.prepare(`
      SELECT MAX("order") as maxOrder 
      FROM pages 
      WHERE parent_id ${params.parentId === null ? 'IS NULL' : '= ?'}
    `).get(params.parentId === null ? [] : [params.parentId]) as { maxOrder: number | null };
    
    const order = (maxOrder.maxOrder || -1) + 1;

    this.db.prepare(`
      INSERT INTO pages (id, title, content, parent_id, "order", created_at, updated_at, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, params.title, content, params.parentId, order, now, now, 'User');

    return this.getPage(id)!;
  }

  updatePage(params: UpdatePageParams): Page | null {
    const page = this.getPage(params.id);
    if (!page) return null;

    const updates: string[] = [];
    const values: unknown[] = [];

    if (params.title !== undefined) {
      updates.push('title = ?');
      values.push(params.title);
    }

    if (params.content !== undefined) {
      updates.push('content = ?');
      values.push(params.content);
    }

    if (updates.length === 0) return page;

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(params.id);

    this.db.prepare(`
      UPDATE pages
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values);

    return this.getPage(params.id);
  }

  deletePage(id: string): boolean {
    const result = this.db.prepare('DELETE FROM pages WHERE id = ?').run(id);
    return result.changes > 0;
  }

  reorderPage(params: ReorderPageParams): Page | null {
    const page = this.getPage(params.id);
    if (!page) return null;

    const siblings = this.getChildPages(params.newParentId);
    
    const updateOrder = this.db.prepare('UPDATE pages SET "order" = ? WHERE id = ?');
    siblings.forEach((sibling, index) => {
      if (sibling.id === params.id) return;
      const newOrder = index >= params.newOrder ? index + 1 : index;
      updateOrder.run(newOrder, sibling.id);
    });

    this.db.prepare(`
      UPDATE pages 
      SET "order" = ?, parent_id = ?, updated_at = ?
      WHERE id = ?
    `).run(params.newOrder, params.newParentId, new Date().toISOString(), params.id);

    return this.getPage(params.id);
  }

  private generateId(): string {
    return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  close(): void {
    this.db.close();
  }
}
