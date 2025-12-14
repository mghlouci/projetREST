import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Films from './pages/Films'
import FilmDetails from './pages/FilmDetails'
import Cinemas from './pages/Cinemas'
import CinemaDetails from './pages/CinemaDetails'

export default function App() {
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('userId'))

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(!!localStorage.getItem('userId'))
    }

    // Écouter les changements de localStorage
    window.addEventListener('storage', checkConnection)
    
    // Vérifier périodiquement (pour les changements dans le même onglet)
    const interval = setInterval(checkConnection, 100)

    return () => {
      window.removeEventListener('storage', checkConnection)
      clearInterval(interval)
    }
  }, [])

  const handleAuthChange = () => {
    setIsConnected(!!localStorage.getItem('userId'))
  }

  return (
    <BrowserRouter>
      <div>
        <Header isConnected={isConnected} onAuthChange={handleAuthChange} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login onAuthChange={handleAuthChange} />} />
          <Route path="/films" element={<Films />} />
          <Route path="/films/:id" element={<FilmDetails />} />
          <Route path="/cinemas" element={<Cinemas />} />
          <Route path="/cinemas/:id" element={<CinemaDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
