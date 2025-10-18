import Database from 'better-sqlite3'

export function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'archived', 'completed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done', 'cancelled')),
      priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
      due_date TEXT,
      assignee_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assignee_id) REFERENCES creators(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      parent_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS creators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT,
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meeting_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      meeting_date TEXT NOT NULL,
      attendees TEXT,
      project_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      report_type TEXT NOT NULL,
      project_id INTEGER,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES creators(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS creator_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      creator_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS performance_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      creator_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS labels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS task_labels (
      task_id INTEGER NOT NULL,
      label_id INTEGER NOT NULL,
      PRIMARY KEY (task_id, label_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_members (
      project_id INTEGER NOT NULL,
      creator_id INTEGER NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (project_id, creator_id),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
    CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
    CREATE INDEX IF NOT EXISTS idx_meeting_notes_project_id ON meeting_notes(project_id);
    CREATE INDEX IF NOT EXISTS idx_meeting_notes_date ON meeting_notes(meeting_date);
    CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
    CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
    CREATE INDEX IF NOT EXISTS idx_creator_notes_creator_id ON creator_notes(creator_id);
    CREATE INDEX IF NOT EXISTS idx_performance_reports_creator_id ON performance_reports(creator_id);
  `)
}

export function seedDatabase(db: Database.Database): void {
  const checkData = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }
  
  if (checkData.count > 0) {
    return
  }

  const insertProject = db.prepare(`
    INSERT INTO projects (name, description, status)
    VALUES (?, ?, ?)
  `)

  const insertCreator = db.prepare(`
    INSERT INTO creators (name, email, role, avatar_url)
    VALUES (?, ?, ?, ?)
  `)

  const insertTask = db.prepare(`
    INSERT INTO tasks (project_id, title, description, status, priority, due_date, assignee_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const insertPage = db.prepare(`
    INSERT INTO pages (title, content, parent_id)
    VALUES (?, ?, ?)
  `)

  const insertMeetingNote = db.prepare(`
    INSERT INTO meeting_notes (title, content, meeting_date, attendees, project_id)
    VALUES (?, ?, ?, ?, ?)
  `)

  const insertReport = db.prepare(`
    INSERT INTO reports (title, content, report_type, project_id, created_by)
    VALUES (?, ?, ?, ?, ?)
  `)

  const insertLabel = db.prepare(`
    INSERT INTO labels (name, color)
    VALUES (?, ?)
  `)

  const insertTaskLabel = db.prepare(`
    INSERT INTO task_labels (task_id, label_id)
    VALUES (?, ?)
  `)

  const insertProjectMember = db.prepare(`
    INSERT INTO project_members (project_id, creator_id, role)
    VALUES (?, ?, ?)
  `)

  const insertCreatorNote = db.prepare(`
    INSERT INTO creator_notes (creator_id, title, content)
    VALUES (?, ?, ?)
  `)

  const insertPerformanceReport = db.prepare(`
    INSERT INTO performance_reports (creator_id, title, description, file_name, file_path, file_size, file_type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const transaction = db.transaction(() => {
    const project1 = insertProject.run('Nexus OS Development', 'Building a modern desktop OS interface', 'active')
    const project2 = insertProject.run('Documentation', 'User and developer documentation', 'active')
    insertProject.run('Marketing Campaign', 'Q4 2024 marketing initiative', 'archived')

    const creator1 = insertCreator.run('Alice Johnson', 'alice@example.com', 'Developer', null)
    const creator2 = insertCreator.run('Bob Smith', 'bob@example.com', 'Designer', null)
    const creator3 = insertCreator.run('Charlie Davis', 'charlie@example.com', 'Project Manager', null)

    insertTask.run(project1.lastInsertRowid, 'Implement database layer', 'Add SQLite with IPC handlers', 'in_progress', 'high', '2024-10-30', creator1.lastInsertRowid)
    insertTask.run(project1.lastInsertRowid, 'Create UI components', 'Build reusable React components', 'todo', 'medium', '2024-11-15', creator2.lastInsertRowid)
    insertTask.run(project1.lastInsertRowid, 'Add authentication', 'Implement user authentication system', 'todo', 'high', '2024-11-10', creator1.lastInsertRowid)
    insertTask.run(project2.lastInsertRowid, 'Write API documentation', 'Document all API endpoints', 'done', 'medium', null, creator3.lastInsertRowid)
    insertTask.run(project2.lastInsertRowid, 'Create user guide', 'Write comprehensive user guide', 'in_progress', 'low', '2024-11-05', creator2.lastInsertRowid)
    insertTask.run(null, 'Review security practices', 'Audit codebase for security issues', 'todo', 'urgent', '2024-10-25', creator1.lastInsertRowid)

    const page1 = insertPage.run('Getting Started', '# Getting Started\n\nWelcome to Nexus OS...', null)
    insertPage.run('Installation', '# Installation\n\nFollow these steps...', page1.lastInsertRowid)
    insertPage.run('Configuration', '# Configuration\n\nConfigure your environment...', page1.lastInsertRowid)
    insertPage.run('API Reference', '# API Reference\n\nComplete API documentation...', null)

    insertMeetingNote.run(
      'Sprint Planning Q4',
      'Discussed priorities for Q4. Focus on database layer and UI components.',
      '2024-10-15',
      'Alice Johnson, Bob Smith, Charlie Davis',
      project1.lastInsertRowid
    )
    insertMeetingNote.run(
      'Design Review',
      'Reviewed new UI mockups. Approved with minor changes.',
      '2024-10-18',
      'Bob Smith, Alice Johnson',
      project1.lastInsertRowid
    )

    insertReport.run(
      'Q3 Progress Report',
      'Completed 85% of planned features. On track for Q4 release.',
      'quarterly',
      project1.lastInsertRowid,
      creator3.lastInsertRowid
    )
    insertReport.run(
      'Security Audit',
      'Identified 3 medium-priority security issues. All resolved.',
      'security',
      project1.lastInsertRowid,
      creator1.lastInsertRowid
    )

    insertLabel.run('bug', '#ef4444')
    const label2 = insertLabel.run('feature', '#3b82f6')
    const label3 = insertLabel.run('documentation', '#10b981')
    const label4 = insertLabel.run('urgent', '#f59e0b')

    insertTaskLabel.run(6, label4.lastInsertRowid)
    insertTaskLabel.run(1, label2.lastInsertRowid)
    insertTaskLabel.run(3, label2.lastInsertRowid)
    insertTaskLabel.run(4, label3.lastInsertRowid)

    insertProjectMember.run(project1.lastInsertRowid, creator1.lastInsertRowid, 'lead')
    insertProjectMember.run(project1.lastInsertRowid, creator2.lastInsertRowid, 'member')
    insertProjectMember.run(project1.lastInsertRowid, creator3.lastInsertRowid, 'manager')
    insertProjectMember.run(project2.lastInsertRowid, creator1.lastInsertRowid, 'member')
    insertProjectMember.run(project2.lastInsertRowid, creator3.lastInsertRowid, 'lead')

    insertCreatorNote.run(
      creator1.lastInsertRowid,
      '1:1 Meeting - October 10',
      '<h2>Discussion Points</h2><ul><li>Current progress on database implementation</li><li>Challenges with SQLite integration</li><li>Timeline for authentication feature</li></ul><h2>Action Items</h2><ul><li>Complete IPC handlers by Friday</li><li>Review security best practices</li></ul>'
    )
    insertCreatorNote.run(
      creator1.lastInsertRowid,
      'Performance Review Notes',
      '<p>Alice has shown exceptional technical skills and leadership. Her work on the database layer has been exemplary.</p><p><strong>Strengths:</strong></p><ul><li>Deep technical knowledge</li><li>Strong problem-solving skills</li><li>Excellent mentorship to junior developers</li></ul>'
    )
    insertCreatorNote.run(
      creator2.lastInsertRowid,
      'Design System Discussion',
      '<p>Discussed the new design system with Bob. He presented mockups for the component library.</p><p>Key decisions:</p><ul><li>Use Tailwind CSS for styling</li><li>Implement dark theme by default</li><li>Create reusable component patterns</li></ul>'
    )
    insertCreatorNote.run(
      creator3.lastInsertRowid,
      'Sprint Planning Notes',
      '<h3>Q4 Priorities</h3><p>Charlie outlined the key objectives for Q4:</p><ol><li>Complete core features</li><li>Improve testing coverage</li><li>Prepare for beta release</li></ol>'
    )

    insertPerformanceReport.run(
      creator1.lastInsertRowid,
      'Q3 2024 Performance Review',
      'Comprehensive performance review for Q3 including metrics, achievements, and areas for improvement.',
      'alice_q3_2024_review.pdf',
      '/uploads/performance-reports/alice_q3_2024_review.pdf',
      245680,
      'application/pdf'
    )
    insertPerformanceReport.run(
      creator2.lastInsertRowid,
      'Design Portfolio Q3',
      'Collection of design work completed in Q3 2024',
      'bob_design_portfolio_q3.pdf',
      '/uploads/performance-reports/bob_design_portfolio_q3.pdf',
      1842500,
      'application/pdf'
    )
    insertPerformanceReport.run(
      creator3.lastInsertRowid,
      'Project Management Report',
      'Summary of project deliverables and team performance',
      'charlie_pm_report_q3.pdf',
      '/uploads/performance-reports/charlie_pm_report_q3.pdf',
      512000,
      'application/pdf'
    )
  })

  transaction()
}
