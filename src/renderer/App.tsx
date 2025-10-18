import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Creators from './pages/Creators'
import CreatorDetail from './pages/CreatorDetail'
import FileManager from './pages/FileManager'
import Settings from './pages/Settings'
import Terminal from './pages/Terminal'
import ProcessMonitor from './pages/ProcessMonitor'
import NetworkTools from './pages/NetworkTools'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/creators/:id" element={<CreatorDetail />} />
          <Route path="/files" element={<FileManager />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/processes" element={<ProcessMonitor />} />
          <Route path="/network" element={<NetworkTools />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
