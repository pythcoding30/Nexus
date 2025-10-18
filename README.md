# Knowledge Base Application

A desktop application for managing hierarchical knowledge base pages with rich text editing capabilities.

## Features

- **Hierarchical Page Structure**: Organize pages in predefined sections with unlimited sub-pages
- **Rich Text Editor**: TipTap-based editor with dark mode support
- **SQLite Persistence**: All data stored locally in SQLite database
- **Autosave**: Automatic saving with visual feedback
- **CRUD Operations**: Create, rename, reorder, and delete pages
- **Tree Navigation**: Collapsible tree view for easy navigation
- **Page Metadata**: Track creation/modification timestamps and author

## Technology Stack

- **Frontend**: React with TypeScript
- **Editor**: TipTap (ProseMirror-based)
- **Desktop Framework**: Electron
- **Database**: SQLite (better-sqlite3)
- **Build Tools**: Webpack, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Build and run in development mode:

```bash
npm run build
npm start
```

For development with hot reload (requires running in separate terminals):

```bash
# Terminal 1: Build main process
npm run dev:main

# Terminal 2: Build renderer process
npm run dev:renderer

# Terminal 3: Start Electron
npm start
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── main/                 # Electron main process
│   ├── main.ts          # Main entry point
│   ├── database.ts      # SQLite database management
│   ├── ipc-handlers.ts  # IPC communication handlers
│   └── preload.ts       # Preload script for context bridge
├── renderer/            # React application
│   ├── components/      # React components
│   │   ├── KnowledgeBase.tsx    # Main application component
│   │   ├── NavigationTree.tsx   # Tree navigation panel
│   │   ├── RichTextEditor.tsx   # TipTap editor wrapper
│   │   ├── PageMetadata.tsx     # Metadata display
│   │   └── Modal.tsx            # Reusable modal dialog
│   ├── App.tsx          # Root React component
│   ├── index.tsx        # React entry point
│   ├── index.html       # HTML template
│   └── styles.css       # Global styles
└── shared/              # Shared types and utilities
    └── types.ts         # TypeScript type definitions
```

## Database Schema

### Sections Table
- `id`: Unique identifier for predefined sections
- `title`: Section display name
- `order`: Display order

### Pages Table
- `id`: Unique identifier
- `title`: Page title
- `content`: Rich text content (HTML)
- `parent_id`: Parent page/section ID (nullable)
- `order`: Display order within parent
- `created_at`: Creation timestamp
- `updated_at`: Last modification timestamp
- `author`: Page author (placeholder)

## Default Sections

The application comes with four predefined top-level sections:
1. Getting Started
2. Documentation
3. Guides
4. References

## IPC API

The application exposes the following IPC methods:

- `kb:getSections()`: Get all sections
- `kb:getAllPages()`: Get all pages
- `kb:getPage(id)`: Get a specific page
- `kb:getChildPages(parentId)`: Get child pages
- `kb:createPage(params)`: Create a new page
- `kb:updatePage(params)`: Update a page
- `kb:deletePage(id)`: Delete a page
- `kb:reorderPage(params)`: Reorder/move a page

## Development

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## License

MIT
