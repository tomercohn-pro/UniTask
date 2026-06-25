import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.jsx'

function ThemeSync() {
  useEffect(() => {
    const updateTheme = () => {
      const active = JSON.parse(localStorage.getItem('settings_darkMode') || 'false')
      document.documentElement.classList.toggle('dark', active)
      document.body.classList.toggle('dark', active)
    }

    updateTheme()
    window.addEventListener('storage', updateTheme)
    return () => window.removeEventListener('storage', updateTheme)
  }, [])

  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeSync />
    <App />
  </StrictMode>,
)
