import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
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
