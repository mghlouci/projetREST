import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFilms, createFilm, getSession } from '../api/api'

export default function Films() {
  const navigate = useNavigate()
  const [ville, setVille] = useState('')
  const [films, setFilms] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isProprioFilm, setIsProprioFilm] = useState(false)
  
  // Formulaire de création de film
  const [formData, setFormData] = useState({
    titre: '',
    duree: '',
    langue: '',
    realisateur: '',
    ageMin: '',
    sousTitre: false,
  })

  useEffect(() => {
    const session = getSession()
    setIsProprioFilm(session.role === 'proprio_film')
    // Charger tous les films au démarrage
    getFilms({}).then(setFilms).catch(console.error)
  }, [])

  async function search() {
    const res = await getFilms({ ville: ville.trim() || undefined })
    setFilms(res)
  }

  async function handleCreateFilm(e) {
    e.preventDefault()
    try {
      const session = getSession()
      if (!session.userId) {
        alert('Vous devez être connecté pour créer un film')
        return
      }

      const filmData = {
        titre: formData.titre,
        duree: Number(formData.duree),
        langue: formData.langue,
        realisateur: formData.realisateur,
        ageMin: formData.ageMin ? Number(formData.ageMin) : undefined,
        sousTitre: formData.sousTitre,
      }

      await createFilm(session.userId, filmData)
      alert('Film créé avec succès!')
      setShowForm(false)
      setFormData({
        titre: '',
        duree: '',
        langue: '',
        realisateur: '',
        ageMin: '',
        sousTitre: false,
      })
      // Rafraîchir la liste des films avec les mêmes critères de recherche
      const res = await getFilms({ ville: ville.trim() || undefined })
      setFilms(res)
    } catch (error) {
      alert('Erreur lors de la création du film: ' + error.message)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Retour
        </button>
        <div style={styles.heroContent}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🎞️</span>
          </div>
          <h1 style={styles.title}>Films</h1>
          <p style={styles.subtitle}>
            Découvrez notre catalogue de films
          </p>
        </div>
        {isProprioFilm && (
          <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : '+ Ajouter un film'}
          </button>
        )}
      </div>

      {isProprioFilm && showForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>✨ Créer un nouveau film</h2>
          <form style={styles.form} onSubmit={handleCreateFilm}>
            <div style={styles.formRow}>
              <label style={styles.label}>
                Titre *
                <input
                  style={styles.input}
                  type="text"
                  value={formData.titre}
                  onChange={e => setFormData({ ...formData, titre: e.target.value })}
                  required
                />
              </label>
            </div>

            <div style={styles.formRow}>
              <label style={styles.label}>
                Durée (minutes) *
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  value={formData.duree}
                  onChange={e => setFormData({ ...formData, duree: e.target.value })}
                  required
                />
              </label>
            </div>

            <div style={styles.formRow}>
              <label style={styles.label}>
                Langue *
                <input
                  style={styles.input}
                  type="text"
                  value={formData.langue}
                  onChange={e => setFormData({ ...formData, langue: e.target.value })}
                  required
                />
              </label>
            </div>

            <div style={styles.formRow}>
              <label style={styles.label}>
                Réalisateur *
                <input
                  style={styles.input}
                  type="text"
                  value={formData.realisateur}
                  onChange={e => setFormData({ ...formData, realisateur: e.target.value })}
                  required
                />
              </label>
            </div>

            <div style={styles.formRow}>
              <label style={styles.label}>
                Âge minimum
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  value={formData.ageMin}
                  onChange={e => setFormData({ ...formData, ageMin: e.target.value })}
                />
              </label>
            </div>

            <div style={styles.formRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.sousTitre}
                  onChange={e => setFormData({ ...formData, sousTitre: e.target.checked })}
                />
                Sous-titres disponibles
              </label>
            </div>

            <button style={styles.submitButton} type="submit">
              Créer le film
            </button>
          </form>
        </div>
      )}

      <div style={styles.searchSection}>
        <div style={styles.searchCard}>
          <h2 style={styles.searchTitle}>🔍 Rechercher par ville</h2>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder="Entrez une ville..."
              value={ville}
              onChange={e => setVille(e.target.value)}
            />
            <button style={styles.searchButton} onClick={search}>
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div style={styles.filmsGrid}>
        {films.map(f => (
          <div
            key={f.id}
            className="film-item-clickable"
            style={styles.filmCard}
            onClick={() => navigate(`/films/${f.id}`)}
          >
            <div style={styles.filmIcon}>🎬</div>
            <h3 style={styles.filmTitle}>{f.titre}</h3>
            <p style={styles.filmDuration}>{f.duree} minutes</p>
            <div style={styles.filmArrow}>→</div>
          </div>
        ))}
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
  addButton: {
    marginTop: '1.5rem',
    padding: '0.8em 1.8em',
    fontSize: '1em',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '20px',
    marginBottom: '2rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    maxWidth: '800px',
    margin: '0 auto 2rem auto',
  },
  formTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#667eea',
    fontWeight: '700',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  input: {
    padding: '0.8em 1.2em',
    fontSize: '1em',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    flex: 1,
    transition: 'all 0.3s ease',
  },
  submitButton: {
    padding: '0.8em 1.8em',
    fontSize: '1em',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#667eea',
    color: 'white',
    fontWeight: '600',
    marginTop: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  searchSection: {
    marginBottom: '2rem',
    maxWidth: '800px',
    margin: '0 auto 2rem auto',
  },
  searchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },
  searchTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#667eea',
    fontWeight: '700',
  },
  searchBox: {
    display: 'flex',
    gap: '1rem',
  },
  searchButton: {
    padding: '0.8em 1.8em',
    fontSize: '1em',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#667eea',
    color: 'white',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  filmsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  filmCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem',
    borderRadius: '20px',
    cursor: 'pointer',
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
  filmIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  filmTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    margin: '0',
    color: '#1a1a1a',
  },
  filmDuration: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0',
  },
  filmArrow: {
    fontSize: '1.5rem',
    color: '#667eea',
    fontWeight: 'bold',
    marginTop: '0.5rem',
    transition: 'transform 0.3s ease',
  },
}
