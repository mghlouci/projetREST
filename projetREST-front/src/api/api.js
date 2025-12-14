const API_BASE = 'http://localhost:8080/api';


async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const text = await res.text();
      if (text) msg = text;
    } catch (_) {}
    throw new Error(msg);
  }

  
  if (res.status === 204) return null;

 
  return res.json();
}

// --------- AUTH ---------

/**
 * POST /api/auth/login
 * body: { email, mdp }
 * returns: { userId, role, email }
 */
export function login(email, mdp) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, mdp },
  });
}

/**
 * POST /api/auth/register
 * body: { email, mdp, role }
 * returns: { userId, email, role }
 */
export function register(email, mdp, role) {
  return request('/auth/register', {
    method: 'POST',
    body: { email, mdp, role },
  });
}

// --------- Catalogue ---------

/**
 * GET /api/Catalogue/films
 * 
 * - sans param: tous les films 
 * - avec ?ville=Paris: films dans une ville 
 */
export function getFilms({ ville } = {}) {
  const q = ville && ville.trim() ? `?ville=${encodeURIComponent(ville.trim())}` : '';
  return request(`/Catalogue/films${q}`);
}

/**
 * GET /api/Catalogue/films/{id}
 * returns: FilmDetailsResponse (avec programmations + créneaux)
 */
export function getFilmDetails(filmId) {
  return request(`/Catalogue/films/${encodeURIComponent(filmId)}`);
}

/**
 * GET /api/Catalogue/cinemas
 * returns: liste de cinémas (DTO light)
 */
export function getCinemas() {
  return request('/Catalogue/cinemas');
}

/**
 * GET /api/Catalogue/cinemas/{id}
 * returns: CinemaDetailsResponse
 */
export function getCinemaDetails(cinemaId) {
  return request(`/Catalogue/cinemas/${encodeURIComponent(cinemaId)}`);
}

// --------- publication ---------

/**
 * POST /api/publication/cinemas?proprietaireId=1
 * body: { nom, adresse, ville }
 * returns: cinemaId (number)
 */
export function createCinema(proprietaireId, { nom, adresse, ville }) {
  const q = `?proprietaireId=${encodeURIComponent(proprietaireId)}`;
  return request(`/publication/cinemas${q}`, {
    method: 'POST',
    body: { nom, adresse, ville },
  });
}

/**
 * POST /api/publication/films?proprietaireId=1
 * body: { titre, duree, langue, realisateur, ageMin, sousTitre }
 * returns: filmId (number)
 */
export function createFilm(proprietaireId, { titre, duree, langue, realisateur, ageMin, sousTitre }) {
  const q = `?proprietaireId=${encodeURIComponent(proprietaireId)}`;
  return request(`/publication/films${q}`, {
    method: 'POST',
    body: { titre, duree, langue, realisateur, ageMin, sousTitre },
  });
}

/**
 * POST /api/publication/programmations
 * body:
 * {
 *   filmId,
 *   cinemaId,
 *   dateDeb: "YYYY-MM-DD",
 *   dateFin: "YYYY-MM-DD",
 *   creneaux: [
 *     { jour: "LUN", heureDebut: "20:00" },
 *     { jour: "MER", heureDebut: "20:00" },
 *     { jour: "VEN", heureDebut: "18:30" }
 *   ]
 * }
 * returns: programmationId (number)
 */
export function createProgrammation({ filmId, cinemaId, dateDeb, dateFin, creneaux }) {
  return request('/publication/programmations', {
    method: 'POST',
    body: { filmId, cinemaId, dateDeb, dateFin, creneaux },
  });
}

// --------- LocalStorage helpers (optionnel, pratique) ---------

export function saveSession({ userId, role, email }) {
  localStorage.setItem('userId', String(userId));
  localStorage.setItem('role', role || '');
  localStorage.setItem('email', email || '');
}

export function getSession() {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');
  return {
    userId: userId ? Number(userId) : null,
    role: role || null,
    email: email || null,
  };
}

export function clearSession() {
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
}