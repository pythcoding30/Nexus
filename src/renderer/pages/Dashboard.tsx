import '../styles/pages.css'

function Dashboard() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="page-description">System overview and quick access</p>
      </header>
      <div className="page-content">
        <div className="card-grid">
          <div className="card">
            <h3>System Status</h3>
            <p className="card-value">Operational</p>
          </div>
          <div className="card">
            <h3>CPU Usage</h3>
            <p className="card-value">--</p>
          </div>
          <div className="card">
            <h3>Memory</h3>
            <p className="card-value">--</p>
          </div>
          <div className="card">
            <h3>Disk Space</h3>
            <p className="card-value">--</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
