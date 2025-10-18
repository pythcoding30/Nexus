import '../styles/pages.css'

function Settings() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="page-description">Application configuration</p>
      </header>
      <div className="page-content">
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label>Theme</label>
            <p className="setting-value">Dark (default)</p>
          </div>
        </div>
        <div className="settings-section">
          <h2>About</h2>
          <div className="setting-item">
            <label>Version</label>
            <p className="setting-value">1.0.0</p>
          </div>
          <div className="setting-item">
            <label>Electron</label>
            <p className="setting-value">{window.electronAPI?.versions.electron() || 'N/A'}</p>
          </div>
          <div className="setting-item">
            <label>Chrome</label>
            <p className="setting-value">{window.electronAPI?.versions.chrome() || 'N/A'}</p>
          </div>
          <div className="setting-item">
            <label>Node</label>
            <p className="setting-value">{window.electronAPI?.versions.node() || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
