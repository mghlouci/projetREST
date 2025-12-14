import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🎬</span>
          </div>
          <h1 style={styles.title}>Cinéma</h1>
          <p style={styles.subtitle}>
            Découvrez les derniers films et trouvez votre cinéma
          </p>
        </div>
      </div>

      <div style={styles.cardsContainer}>
        <div
          style={styles.card}
          className="home-card"
          onClick={() => navigate('/films')}
        >
          <div style={styles.cardIcon}>🎞️</div>
          <h2 style={styles.cardTitle}>Films</h2>
          <p style={styles.cardDescription}>
            Explorez notre catalogue de films et découvrez les dernières sorties
          </p>
          <div style={styles.cardArrow}>→</div>
        </div>

        <div
          style={styles.card}
          className="home-card"
          onClick={() => navigate('/cinemas')}
        >
          <div style={styles.cardIcon}>🏛️</div>
          <h2 style={styles.cardTitle}>Cinémas</h2>
          <p style={styles.cardDescription}>
            Trouvez les cinémas près de chez vous et consultez leurs programmations
          </p>
          <div style={styles.cardArrow}>→</div>
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
    maxWidth: '900px',
    zIndex: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2.5rem',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cardIcon: {
    fontSize: '3.5rem',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0',
    color: '#1a1a1a',
    letterSpacing: '-0.01em',
  },
  cardDescription: {
    fontSize: '1rem',
    color: '#666',
    margin: '0',
    lineHeight: '1.6',
    flex: 1,
  },
  cardArrow: {
    fontSize: '1.5rem',
    color: '#667eea',
    fontWeight: 'bold',
    marginTop: 'auto',
    transition: 'transform 0.3s ease',
  },
}

