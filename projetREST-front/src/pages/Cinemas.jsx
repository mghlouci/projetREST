import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCinemas, getSession } from '../api/api'

export default function Cinemas() {
  const navigate = useNavigate()
  const [cinemas, setCinemas] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    async function fetchCinemas() {
      try {
        setLoading(true)
        const session = getSession()
        setUserId(session.userId)
        const data = await getCinemas()
        setCinemas(data || [])
      } catch (error) {
        console.error('Erreur lors du chargement des cinémas:', error)
        setCinemas([])
      } finally {
        setLoading(false)
      }
    }

    fetchCinemas()
  }, [])

  // Filtrer les cinémas appartenant à l'utilisateur
  const myCinemas = userId
    ? cinemas.filter(cinema => cinema.idProprietaire === userId)
    : []

  // Tous les autres cinémas (ou tous si pas connecté)
  const allCinemas = userId
    ? cinemas.filter(cinema => cinema.idProprietaire !== userId)
    : cinemas

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.hero}>
          <button style={styles.backButton} onClick={() => navigate('/')}>
            ← Retour
          </button>
          <div style={styles.heroContent}>
            <div style={styles.logoContainer}>
              <span style={styles.logo}>🏛️</span>
            </div>
            <h1 style={styles.title}>Cinémas</h1>
          </div>
        </div>
        <div style={styles.loading}>Chargement...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Retour
        </button>
        <div style={styles.heroContent}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🏛️</span>
          </div>
          <h1 style={styles.title}>Cinémas</h1>
          <p style={styles.subtitle}>
            Trouvez les cinémas près de chez vous
          </p>
        </div>
      </div>

      <div style={styles.content}>
        {userId && myCinemas.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>⭐ Mes cinémas</h2>
            <div style={styles.cinemasGrid}>
              {myCinemas.map(cinema => (
                <div
                  key={cinema.id}
                  className="cinema-card-clickable"
                  style={styles.cinemaCard}
                  onClick={() => navigate(`/cinemas/${cinema.id}`)}
                >
                  <div style={styles.cinemaIcon}>🏛️</div>
                  <h3 style={styles.cinemaName}>{cinema.nom}</h3>
                  <p style={styles.cinemaAddress}>{cinema.adresse}</p>
                  <p style={styles.cinemaCity}>{cinema.ville}</p>
                  <div style={styles.cinemaArrow}>→</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {userId && myCinemas.length > 0 ? '🎬 Tous les cinémas' : '🎬 Cinémas'}
          </h2>
          {allCinemas.length > 0 ? (
            <div style={styles.cinemasGrid}>
              {allCinemas.map(cinema => (
                <div key={cinema.id} style={styles.cinemaCard}>
                  <div style={styles.cinemaIcon}>🏛️</div>
                  <h3 style={styles.cinemaName}>{cinema.nom}</h3>
                  <p style={styles.cinemaAddress}>{cinema.adresse}</p>
                  <p style={styles.cinemaCity}>{cinema.ville}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noCinemasCard}>
              <p style={styles.noCinemas}>Aucun cinéma disponible.</p>
            </div>
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
    position: 'relative',
    overflow: 'hidden',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '3rem',
    zIndex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: '0',
    left: '0',
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    fontWeight: '600',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  logoContainer: {
    marginBottom: '1rem',
    display: 'inline-block',
  },
  logo: {
    fontSize: '4rem',
    display: 'block',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0',
    fontWeight: '300',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 1,
    position: 'relative',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '700',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  cinemasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  cinemaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem',
    borderRadius: '20px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.5rem',
  },
  cinemaIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  cinemaName: {
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
    color: '#1a1a1a',
    fontWeight: '700',
  },
  cinemaAddress: {
    color: '#666',
    margin: '0.25rem 0',
    fontSize: '0.95rem',
  },
  cinemaCity: {
    color: '#667eea',
    margin: '0.25rem 0',
    fontSize: '1rem',
    fontWeight: '600',
  },
  cinemaArrow: {
    fontSize: '1.5rem',
    color: '#667eea',
    fontWeight: 'bold',
    marginTop: '0.5rem',
    transition: 'transform 0.3s ease',
  },
  noCinemasCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '3rem',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },
  noCinemas: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem',
    margin: '0',
  },
}

