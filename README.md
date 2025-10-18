# Nexus OS

A modern Electron + React application shell with modular architecture and dark theme.

## Features

- **Electron** - Cross-platform desktop application
- **React 18** - Modern UI framework with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **SQLite Database** - Local data persistence with better-sqlite3
- **IPC Data Services** - Secure database access via IPC handlers
- **Dark Theme** - Professional dark mode interface
- **Modular Architecture** - Organized folder structure

## Project Structure

```
nexus-os/
├── src/
│   ├── main/          # Electron main process
│   │   ├── database/  # Database service and IPC handlers
│   │   │   ├── database-service.ts
│   │   │   ├── ipc-handlers.ts
│   │   │   └── schema.ts
│   │   └── main.ts
│   ├── preload/       # Preload scripts with contextBridge
│   │   └── preload.ts
│   ├── renderer/      # React application
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── shared/        # Shared types and utilities
│       ├── database-types.ts
│       └── types.ts
├── assets/            # Application assets
├── public/            # Public static files
├── DATABASE_API.md    # Database API documentation
└── dist/              # Production build output
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

### Building

Build for production:

```bash
# Build for current platform
npm run build

# Build for Windows
npm run build:win

# Build unpacked directory (for testing)
npm run build:dir
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run build:win` - Build Windows installer
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Database

The application includes a fully-featured SQLite database layer with IPC services:

### Data Models

- **Projects** - Project management with status tracking
- **Tasks** - Task tracking with priorities, statuses, and labels
- **Pages** - Hierarchical pages/documentation
- **Creators** - Team members/users
- **Meeting Notes** - Meeting records linked to projects
- **Reports** - Project reports and documents
- **Labels** - Tags for categorizing tasks

### Usage

All database operations are accessible through `window.electronAPI.database` in the renderer process. See [DATABASE_API.md](DATABASE_API.md) for complete documentation and examples.

### Database Location

The SQLite database is automatically created in the Electron userData directory:
- Windows: `%APPDATA%/nexus-os/nexus-os.db`
- macOS: `~/Library/Application Support/nexus-os/nexus-os.db`
- Linux: `~/.config/nexus-os/nexus-os.db`

### Seed Data

The database is automatically initialized with sample data including projects, tasks, team members, and more.

## Modules

The application includes navigation stubs for the following modules:

- **Dashboard** - System overview and quick access
- **Projects** - Project management with database integration
- **Tasks** - Task tracking with database integration
- **File Manager** - Browse and manage system files
- **Terminal** - Command-line interface
- **Process Monitor** - Monitor and manage system processes
- **Network Tools** - Network diagnostics and monitoring
- **Settings** - Application configuration

## Architecture

### Main Process

The Electron main process (`src/main/main.ts`) handles:
- Window creation and management
- Application lifecycle
- Database initialization and management
- IPC handlers for database operations
- System-level operations

### Database Layer

The database layer (`src/main/database/`) provides:
- SQLite database with better-sqlite3
- Schema definition and migrations
- CRUD operations for all data models
- Validation and error handling
- Seed data for development

### Preload Script

The preload script (`src/preload/preload.ts`) uses `contextBridge` to safely expose APIs to the renderer process:
- Version information
- Platform detection
- Database operations (all CRUD methods)

### Renderer Process

The React application runs in the renderer process with:
- Component-based architecture
- React Router for navigation
- Database API access via window.electronAPI
- CSS modules for styling
- TypeScript for type safety

## Security

- Context isolation enabled
- Node integration disabled
- Sandbox mode enabled
- Controlled API exposure via contextBridge

## License

MIT
