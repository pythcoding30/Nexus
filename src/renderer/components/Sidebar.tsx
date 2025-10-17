import { NavLink } from 'react-router-dom'
import { NavItem } from '@shared/types'
import '../styles/sidebar.css'

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
  { id: 'files', label: 'File Manager', icon: '📁', path: '/files' },
  { id: 'terminal', label: 'Terminal', icon: '💻', path: '/terminal' },
  { id: 'processes', label: 'Processes', icon: '⚙️', path: '/processes' },
  { id: 'network', label: 'Network', icon: '🌐', path: '/network' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">Nexus OS</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            end={item.path === '/'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="version-info">
          v1.0.0
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
