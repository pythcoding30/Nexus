export interface ElectronAPI {
  versions: {
    node: () => string
    chrome: () => string
    electron: () => string
  }
  platform: () => string
  send: (channel: string, data: unknown) => void
  receive: (channel: string, func: (...args: unknown[]) => void) => void
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
