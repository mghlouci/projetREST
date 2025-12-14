import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCinemaDetails, getFilms, createProgrammation, getSession } from '../api/api'

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
        setIsOwner(session.userId && cinemaData.idProprietaire === session.userId)
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
        <div style={styles.error}>
          {error || 'Cinéma introuvable'}
          <button style={styles.backButton} onClick={() => navigate('/cinemas')}>
            Retour aux cinémas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/cinemas')}>
          ← Retour aux cinémas
        </button>
        <h1 style={styles.title}>{cinema.nom}</h1>
      </div>

      <div style={styles.details}>
        <div style={styles.infoSection}>
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

        {isOwner && (
          <div style={styles.actionsSection}>
            <button style={styles.publishButton} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Annuler' : '+ Publier une programmation'}
            </button>
          </div>
        )}

        {showForm && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Nouvelle programmation</h2>
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

              <div style={styles.creneauxSection}>
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
      </div>
    </div>
  )
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
  actionsSection: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  publishButton: {
    padding: '0.8em 1.5em',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  formContainer: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  formTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#646cff',
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
  },
  input: {
    padding: '0.6em 1.2em',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  select: {
    padding: '0.6em 1.2em',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: '#213547',
  },
  creneauxSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  creneauxHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: '500',
  },
  addCreneauButton: {
    padding: '0.4em 0.8em',
    fontSize: '0.9em',
    borderRadius: '6px',
    border: '1px solid #646cff',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#646cff',
  },
  creneauRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  creneauLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    minWidth: '80px',
  },
  creneauSelect: {
    padding: '0.5em 1em',
    fontSize: '1em',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: '#213547',
    flex: 1,
  },
  creneauTime: {
    padding: '0.5em 1em',
    fontSize: '1em',
    borderRadius: '6px',
    border: '1px solid #ccc',
    flex: 1,
  },
  removeButton: {
    padding: '0.4em 0.8em',
    fontSize: '1.2em',
    borderRadius: '6px',
    border: '1px solid #ff4444',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#ff4444',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    padding: '0.8em 1.5em',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    backgroundColor: '#646cff',
    color: 'white',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
}

