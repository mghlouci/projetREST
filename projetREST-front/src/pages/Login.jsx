import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/api'

export default function Login({ onAuthChange }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')

  async function handleSubmit(e) {
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Retour
        </button>
        <h1 style={styles.title}>Connexion</h1>
      </div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Mot de passe"
          type="password"
          value={mdp}
          onChange={e => setMdp(e.target.value)}
        />
        <button style={styles.submitButton} type="submit">
          Se connecter
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '500px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    backgroundColor: '#1a1a1a',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.6em 1.2em',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '0.6em 1.2em',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    backgroundColor: '#646cff',
    color: 'white',
    fontWeight: '600',
  },
}
