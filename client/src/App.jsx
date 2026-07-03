import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProfileSetup from './pages/ProfileSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ExploreSkills from './pages/ExploreSkills.jsx'
import Profile from './pages/Profile.jsx'
import MyRequests from './pages/MyRequests.jsx'
import NotFound from './pages/NotFound.jsx'

// Pages that use the dashboard Sidebar layout instead of the public Footer
const APP_SHELL_ROUTES = ['/dashboard', '/explore', '/requests', '/profile']

export default function App() {
  const location = useLocation()
  const isAppShell = APP_SHELL_ROUTES.some((p) => location.pathname.startsWith(p))

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<ExploreSkills />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAppShell && <Footer />}
    </div>
  )
}
