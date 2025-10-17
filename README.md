# Nexus OS

A modern Electron + React application shell with modular architecture and dark theme.

## Features

- **Electron** - Cross-platform desktop application
- **React 18** - Modern UI framework with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Dark Theme** - Professional dark mode interface
- **Modular Architecture** - Organized folder structure

## Project Structure

```
nexus-os/
├── src/
│   ├── main/          # Electron main process
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
│       └── types.ts
├── assets/            # Application assets
├── public/            # Public static files
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

## Modules

The application includes navigation stubs for the following modules:

- **Dashboard** - System overview and quick access
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
- System-level operations

### Preload Script

The preload script (`src/preload/preload.ts`) uses `contextBridge` to safely expose APIs to the renderer process.

### Renderer Process

The React application runs in the renderer process with:
- Component-based architecture
- React Router for navigation
- CSS modules for styling
- TypeScript for type safety

## Security

- Context isolation enabled
- Node integration disabled
- Sandbox mode enabled
- Controlled API exposure via contextBridge

## License

MIT
