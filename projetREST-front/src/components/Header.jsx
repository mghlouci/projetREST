import { useNavigate } from 'react-router-dom'

export default function Header({ isConnected, onAuthChange }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    if (onAuthChange) {
      onAuthChange()
    }
    navigate('/')
  }

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>
          🎬 Ciné ELMI
        </h1>
        <div style={styles.nav}>
          {isConnected ? (
            <button style={styles.button} onClick={handleLogout}>
              Déconnexion
            </button>
          ) : (
            <button style={styles.button} onClick={() => navigate('/connexion')}>
              Connexion
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    backgroundColor: '#1a1a1a',
    padding: '1rem 2rem',
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    margin: 0,
    cursor: 'pointer',
    color: '#646cff',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '0.6em 1.2em',
    fontSize: '1em',
    fontWeight: '500',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    backgroundColor: '#646cff',
    color: 'white',
    transition: 'all 0.3s ease',
  },
}


