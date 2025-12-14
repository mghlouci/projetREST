import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCinemaDetails, getFilms, createProgrammation, getSession } from '../api/api'

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

export default function CinemaDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cinema, setCinema] = useState(null)
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  
  // Formulaire de programmation
  const [formData, setFormData] = useState({
    filmId: '',
    dateDeb: '',
    dateFin: '',
    creneaux: [
      { jour: 'LUN', heureDebut: '' },
      { jour: 'LUN', heureDebut: '' },
      { jour: 'LUN', heureDebut: '' },
    ],
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [cinemaData, filmsData] = await Promise.all([
          getCinemaDetails(id),
          getFilms({}),
        ])
        setCinema(cinemaData)
        setFilms(filmsData || [])
        const session = getSession()
        const userId = Number(session.userId)
        const idProprietaire = Number(cinemaData.idProprietaire)
        setIsOwner(userId && idProprietaire && userId === idProprietaire)
        setError(null)
      } catch (err) {
        setError('Erreur lors du chargement des données')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])


  const updateCreneau = (index, field, value) => {
    const newCreneaux = [...formData.creneaux]
    newCreneaux[index] = { ...newCreneaux[index], [field]: value }
    setFormData({ ...formData, creneaux: newCreneaux })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const programmationData = {
        filmId: Number(formData.filmId),
        cinemaId: Number(id),
        dateDeb: formData.dateDeb,
        dateFin: formData.dateFin,
        creneaux: formData.creneaux.filter(c => c.jour && c.heureDebut),
      }

      if (programmationData.creneaux.length !== 3) {
        alert('Veuillez remplir exactement 3 créneaux')
        return
      }

      await createProgrammation(programmationData)
      alert('Programmation créée avec succès!')
      setShowForm(false)
      setFormData({
        filmId: '',
        dateDeb: '',
        dateFin: '',
        creneaux: [
          { jour: 'LUN', heureDebut: '' },
          { jour: 'LUN', heureDebut: '' },
          { jour: 'LUN', heureDebut: '' },
        ],
      })
      // Recharger les détails du cinéma
      const cinemaData = await getCinemaDetails(id)
      setCinema(cinemaData)
    } catch (error) {
      alert('Erreur lors de la création de la programmation: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Chargement...</div>
      </div>
    )
  }

  if (error || !cinema) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.error}>{error || 'Cinéma introuvable'}</div>
          <button style={styles.backButton} onClick={() => navigate('/cinemas')}>
            Retour aux cinémas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <button style={styles.backButton} onClick={() => navigate('/cinemas')}>
          ← Retour aux cinémas
        </button>
        <div style={styles.heroContent}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🏛️</span>
          </div>
          <h1 style={styles.title}>{cinema.nom}</h1>
        </div>
        {isOwner && (
          <button style={styles.publishButton} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : '+ Publier une programmation'}
          </button>
        )}
      </div>

      <div style={styles.details}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Informations</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <strong>Adresse:</strong> {cinema.adresse}
            </div>
            <div style={styles.infoItem}>
              <strong>Ville:</strong> {cinema.ville}
            </div>
          </div>
        </div>

        {showForm && (
          <div style={styles.card}>
            <h2 style={styles.formTitle}>✨ Nouvelle programmation</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formRow}>
                <label style={styles.label}>
                  Film *
                  <select
                    style={styles.select}
                    value={formData.filmId}
                    onChange={e => setFormData({ ...formData, filmId: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner un film</option>
                    {films.map(film => (
                      <option key={film.id} value={film.id}>
                        {film.titre} ({film.duree} min)
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={styles.formRow}>
                <label style={styles.label}>
                  Date de début *
                  <input
                    style={styles.input}
                    type="date"
                    value={formData.dateDeb}
                    onChange={e => setFormData({ ...formData, dateDeb: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div style={styles.formRow}>
                <label style={styles.label}>
                  Date de fin *
                  <input
                    style={styles.input}
                    type="date"
                    value={formData.dateFin}
                    onChange={e => setFormData({ ...formData, dateFin: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div style={styles.creneauxSectionForm}>
                <div style={styles.creneauxHeader}>
                  <strong>Créneaux * (exactement 3 requis)</strong>
                </div>

                {formData.creneaux.map((creneau, index) => (
                  <div key={index} style={styles.creneauRow}>
                    <label style={styles.creneauLabel}>Créneau {index + 1}</label>
                    <select
                      style={styles.creneauSelect}
                      value={creneau.jour}
                      onChange={e => updateCreneau(index, 'jour', e.target.value)}
                      required
                    >
                      <option value="LUN">Lundi</option>
                      <option value="MAR">Mardi</option>
                      <option value="MER">Mercredi</option>
                      <option value="JEU">Jeudi</option>
                      <option value="VEN">Vendredi</option>
                      <option value="SAM">Samedi</option>
                      <option value="DIM">Dimanche</option>
                    </select>
                    <input
                      style={styles.creneauTime}
                      type="time"
                      value={creneau.heureDebut}
                      onChange={e => updateCreneau(index, 'heureDebut', e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>

              <button style={styles.submitButton} type="submit">
                Créer la programmation
              </button>
            </form>
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Programmations</h2>
          {cinema.programmations && cinema.programmations.length > 0 ? (
            <div style={styles.programmationsList}>
              {cinema.programmations.map(prog => (
                <div key={prog.id} style={styles.programmationCard}>
                  <div style={styles.filmInfo}>
                    <h3 style={styles.filmTitle}>{prog.filmTitre}</h3>
                    <div style={styles.filmDetails}>
                      <p><strong>Durée:</strong> {prog.filmDuree} minutes</p>
                      <p><strong>Langue:</strong> {prog.filmLangue}</p>
                      <p><strong>Réalisateur:</strong> {prog.filmRealisateur}</p>
                      {prog.filmAgeMin && (
                        <p><strong>Âge minimum:</strong> {prog.filmAgeMin} ans</p>
                      )}
                      {prog.filmSousTitre && (
                        <p><strong>Sous-titres:</strong> {prog.filmSousTitre}</p>
                      )}
                    </div>
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
                          {getJourLabel(creneau.jourSemaine || creneau.jour)} {creneau.heureDebut ? creneau.heureDebut.slice(0, 5) : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noProgrammation}>
              Aucune programmation disponible pour ce cinéma.
            </p>
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
  publishButton: {
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
  formTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#667eea',
    fontWeight: '700',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
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
    color: '#1a1a1a',
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
  filmInfo: {
    marginBottom: '1rem',
  },
  filmTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
    color: '#667eea',
    fontWeight: '700',
  },
  filmDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.5rem',
    color: '#1a1a1a',
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
  creneauxSectionForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  creneauxHeader: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1a1a1a',
  },
  creneauRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  creneauLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    minWidth: '100px',
    color: '#1a1a1a',
  },
  creneauSelect: {
    padding: '0.6em 1em',
    fontSize: '1em',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    backgroundColor: 'white',
    color: '#1a1a1a',
    flex: 1,
    cursor: 'pointer',
  },
  creneauTime: {
    padding: '0.6em 1em',
    fontSize: '1em',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    backgroundColor: 'white',
    color: '#1a1a1a',
    flex: 1,
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
}

