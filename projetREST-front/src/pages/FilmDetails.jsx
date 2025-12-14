import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFilmDetails } from '../api/api'

export default function FilmDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [film, setFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchFilmDetails() {
      try {
        setLoading(true)
        const data = await getFilmDetails(id)
        setFilm(data)
        setError(null)
      } catch (err) {
        setError('Erreur lors du chargement des détails du film')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchFilmDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Chargement...</div>
      </div>
    )
  }

  if (error || !film) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.error}>{error || 'Film introuvable'}</div>
          <button style={styles.backButton} onClick={() => navigate('/films')}>
            Retour aux films
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <button style={styles.backButton} onClick={() => navigate('/films')}>
          ← Retour aux films
        </button>
        <div style={styles.heroContent}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🎬</span>
          </div>
          <h1 style={styles.title}>{film.titre}</h1>
        </div>
      </div>

      <div style={styles.details}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Informations</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <strong>Durée:</strong> {film.duree} minutes
            </div>
            <div style={styles.infoItem}>
              <strong>Langue:</strong> {film.langue}
            </div>
            <div style={styles.infoItem}>
              <strong>Réalisateur:</strong> {film.realisateur}
            </div>
            {film.ageMin && (
              <div style={styles.infoItem}>
                <strong>Âge minimum:</strong> {film.ageMin} ans
              </div>
            )}
            {film.sousTitre && (
              <div style={styles.infoItem}>
                <strong>Sous-titres:</strong> {film.sousTitre ? 'Oui' : 'Non'}
              </div>
            )}
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Programmations</h2>
          {film.programmations && film.programmations.length > 0 ? (
            <div style={styles.programmationsList}>
              {film.programmations.map(prog => (
                <div key={prog.id} style={styles.programmationCard}>
                  <div style={styles.cinemaInfo}>
                    <h3 style={styles.cinemaName}>{prog.cinemaNom}</h3>
                    <p style={styles.cinemaAddress}>
                      {prog.cinemaAdresse}, {prog.cinemaVille}
                    </p>
                  </div>
                  <div style={styles.dates}>
                    <p>
                      <strong>Du:</strong> {new Date(prog.dateDeb).toLocaleDateString('fr-FR')}
                    </p>
                    <p>
                      <strong>Au:</strong> {new Date(prog.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div style={styles.creneauxSection}>
                    <strong>Créneaux:</strong>
                    <div style={styles.creneauxList}>
                      {prog.creneaux.map((creneau, idx) => (
                        <span key={idx} style={styles.creneauBadge}>
                          {getJourLabel(creneau.jour)} {creneau.heureDebut.slice(0, 5)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noProgrammation}>
              Aucune programmation disponible pour ce film.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function getJourLabel(jour) {
  const jours = {
    LUN: 'Lundi',
    MAR: 'Mardi',
    MER: 'Mercredi',
    JEU: 'Jeudi',
    VEN: 'Vendredi',
    SAM: 'Samedi',
    DIM: 'Dimanche',
  }
  return jours[jour] || jour
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
    animation: 'float 3s ease-in-out infinite',
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
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  errorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center',
  },
  error: {
    fontSize: '1.2rem',
    color: '#ff4444',
    fontWeight: '600',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 1,
    position: 'relative',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#667eea',
    fontWeight: '700',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  infoItem: {
    padding: '0.5rem 0',
    fontSize: '1rem',
    color: '#1a1a1a',
  },
  programmationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  programmationCard: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.2)',
  },
  cinemaInfo: {
    marginBottom: '1rem',
  },
  cinemaName: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#667eea',
    fontWeight: '600',
  },
  cinemaAddress: {
    color: '#666',
    margin: 0,
  },
  dates: {
    marginBottom: '1rem',
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    color: '#1a1a1a',
  },
  creneauxSection: {
    marginTop: '1rem',
    color: '#1a1a1a',
  },
  creneauxList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  creneauBadge: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  noProgrammation: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
    fontSize: '1.1rem',
  },
}


