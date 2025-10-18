import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { databaseService } from './database/database-service'
import { registerDatabaseHandlers } from './database/ipc-handlers'

let mainWindow: BrowserWindow | null = null

const isDev = !app.isPackaged

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    show: false,
    autoHideMenuBar: true
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function registerFileHandlers() {
  ipcMain.handle('file:selectFile', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No file selected' }
    }

    return { success: true, data: result.filePaths[0] }
  })

  ipcMain.handle('file:saveUpload', async (_event, sourcePath: string, fileName: string) => {
    try {
      const userDataPath = app.getPath('userData')
      const uploadsDir = path.join(userDataPath, 'uploads', 'performance-reports')
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      const timestamp = Date.now()
      const ext = path.extname(fileName)
      const baseName = path.basename(fileName, ext)
      const uniqueFileName = `${baseName}_${timestamp}${ext}`
      const destPath = path.join(uploadsDir, uniqueFileName)

      fs.copyFileSync(sourcePath, destPath)

      const stats = fs.statSync(destPath)
      
      return {
        success: true,
        data: {
          file_name: fileName,
          file_path: destPath,
          file_size: stats.size,
          file_type: ext.substring(1)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save file'
      }
    }
  })

  ipcMain.handle('file:openExternal', async (_event, filePath: string) => {
    try {
      const { shell } = require('electron')
      await shell.openPath(filePath)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to open file'
      }
    }
  })

  ipcMain.handle('file:deleteUpload', async (_event, filePath: string) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file'
      }
    }
  })
}

app.whenReady().then(() => {
  databaseService.initialize()
  registerDatabaseHandlers()
  registerFileHandlers()
  
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  databaseService.close()
})
