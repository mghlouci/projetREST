import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/api'

export default function Login({ onAuthChange }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerMdp, setRegisterMdp] = useState('')
  const [registerRole, setRegisterRole] = useState('proprio_film')

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await login(email, mdp)
      localStorage.setItem('userId', res.userId)
      localStorage.setItem('role', res.role)
      if (onAuthChange) {
        onAuthChange()
      }
      alert('Connecté')
      navigate('/')
    } catch (error) {
      alert('Erreur de connexion')
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    try {
      const res = await register(registerEmail, registerMdp, registerRole)
      localStorage.setItem('userId', res.userId)
      localStorage.setItem('role', res.role)
      if (onAuthChange) {
        onAuthChange()
      }
      alert('Compte créé avec succès')
      navigate('/')
    } catch (error) {
      alert('Erreur lors de la création du compte')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🎬</span>
          </div>
          <h1 style={styles.title}>{isRegistering ? 'Créer un compte' : 'Connexion'}</h1>
          <p style={styles.subtitle}>
            {isRegistering
              ? 'Rejoignez-nous et gérez vos films ou cinémas'
              : 'Connectez-vous pour accéder à votre compte'}
          </p>
        </div>
      </div>

      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          {!isRegistering ? (
            <form style={styles.form} onSubmit={handleLogin}>
              <h2 style={styles.cardTitle}>Se connecter</h2>
              <input
                style={styles.input}
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                style={styles.input}
                placeholder="Mot de passe"
                type="password"
                value={mdp}
                onChange={e => setMdp(e.target.value)}
                required
              />
              <button style={styles.submitButton} type="submit">
                Se connecter
              </button>
              <button
                type="button"
                style={styles.switchButton}
                onClick={() => setIsRegistering(true)}
              >
                Créer un compte
              </button>
            </form>
          ) : (
            <form style={styles.form} onSubmit={handleRegister}>
              <h2 style={styles.cardTitle}>Créer un compte</h2>
              <input
                style={styles.input}
                placeholder="Email"
                type="email"
                value={registerEmail}
                onChange={e => setRegisterEmail(e.target.value)}
                required
              />
              <input
                style={styles.input}
                placeholder="Mot de passe"
                type="password"
                value={registerMdp}
                onChange={e => setRegisterMdp(e.target.value)}
                required
              />
              <div style={styles.roleContainer}>
                <label style={styles.roleLabel}>Rôle :</label>
                <select
                  style={styles.select}
                  value={registerRole}
                  onChange={e => setRegisterRole(e.target.value)}
                  required
                >
                  <option value="proprio_film">Propriétaire de films</option>
                  <option value="proprio_cinema">Propriétaire de cinéma</option>
                </select>
              </div>
              <button style={styles.submitButton} type="submit">
                Créer le compte
              </button>
              <button
                type="button"
                style={styles.switchButton}
                onClick={() => setIsRegistering(false)}
              >
                Déjà un compte ? Se connecter
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '4rem',
    zIndex: 1,
  },
  heroContent: {
    maxWidth: '800px',
  },
  logoContainer: {
    marginBottom: '1.5rem',
    display: 'inline-block',
    animation: 'float 3s ease-in-out infinite',
  },
  logo: {
    fontSize: '5rem',
    display: 'block',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '800',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.3rem',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0',
    fontWeight: '300',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '500px',
    zIndex: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 1.5rem 0',
    color: '#1a1a1a',
    letterSpacing: '-0.01em',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8em 1.2em',
    fontSize: '1em',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    backgroundColor: 'white',
    color: '#1a1a1a',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  select: {
    padding: '0.8em 1.2em',
    fontSize: '1em',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    backgroundColor: 'white',
    color: '#1a1a1a',
    transition: 'all 0.3s ease',
    outline: 'none',
    cursor: 'pointer',
  },
  roleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  roleLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    padding: '0.8em 1.2em',
    fontSize: '1.1em',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#667eea',
    color: 'white',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },
  switchButton: {
    padding: '0.6em 1.2em',
    fontSize: '0.9em',
    borderRadius: '12px',
    border: '2px solid #667eea',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#667eea',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },
}
