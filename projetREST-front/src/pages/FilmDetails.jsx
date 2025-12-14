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
        <div style={styles.error}>
          {error || 'Film introuvable'}
          <button style={styles.backButton} onClick={() => navigate('/films')}>
            Retour aux films
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/films')}>
          ← Retour aux films
        </button>
        <h1 style={styles.title}>{film.titre}</h1>
      </div>

      <div style={styles.details}>
        <div style={styles.infoSection}>
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
                <strong>Sous-titres:</strong> {film.sousTitre}
              </div>
            )}
          </div>
        </div>

        <div style={styles.programmationsSection}>
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
    padding: '2rem',
    maxWidth: '1200px',
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
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#ff4444',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#646cff',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  infoItem: {
    padding: '0.5rem 0',
    fontSize: '1rem',
  },
  programmationsSection: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  programmationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  programmationCard: {
    backgroundColor: '#242424',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  cinemaInfo: {
    marginBottom: '1rem',
  },
  cinemaName: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#646cff',
  },
  cinemaAddress: {
    color: '#aaa',
    margin: 0,
  },
  dates: {
    marginBottom: '1rem',
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  creneauxSection: {
    marginTop: '1rem',
  },
  creneauxList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  creneauBadge: {
    backgroundColor: '#646cff',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
  noProgrammation: {
    textAlign: 'center',
    padding: '2rem',
    color: '#aaa',
    fontSize: '1.1rem',
  },
}


