package efrei.projetREST.service;

import efrei.projetREST.entities.Cinema;
import efrei.projetREST.entities.CreneauHebdo;
import efrei.projetREST.entities.Film;
import efrei.projetREST.entities.Programmation;
import efrei.projetREST.repository.CinemaRepository;
import efrei.projetREST.repository.CreneauHebdoRepository;
import efrei.projetREST.repository.FilmRepository;
import efrei.projetREST.repository.ProgrammationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CatalogueService {

    private final ProgrammationRepository programmationRepository;
    private final FilmRepository filmRepository;
    private final CreneauHebdoRepository creneauHebdoRepository;
    private final CinemaRepository cinemaRepository;

    public CatalogueService(ProgrammationRepository programmationRepository,
                            FilmRepository filmRepository,
                            CreneauHebdoRepository creneauHebdoRepository,CinemaRepository cinemaRepository ) {
        this.programmationRepository = programmationRepository;
        this.filmRepository = filmRepository;
        this.creneauHebdoRepository = creneauHebdoRepository;
        this.cinemaRepository = cinemaRepository;
    }

    public List<FilmLightResponse> getFilms(String ville, String query) {

        List<Film> films;

        boolean hasVille = ville != null && !ville.isBlank();
        boolean hasQuery = query != null && !query.isBlank();

        if (hasVille) {
            films = programmationRepository.findFilmsByVilleAndTitreLike(
                    ville.trim(),
                    hasQuery ? query.trim() : ""
            );
        } else if (hasQuery) {
            films = filmRepository.findByTitreContainingIgnoreCase(query.trim());
        } else {
            films = filmRepository.findAll();
        }

        return films.stream()
                .map(f -> new FilmLightResponse(
                        f.getId(),
                        f.getTitre(),
                        f.getDuree(),
                        f.getLangue(),
                        f.getRealisateur(),
                        f.getAge_min(),
                        f.getSous_titre()
                ))
                .toList();
    }



    public FilmDetailsResponse getFilmDetails(Long filmId) {
        Film film = filmRepository.findById(filmId)
                .orElseThrow(() -> new RuntimeException("Film introuvable"));

        List<Programmation> progs = programmationRepository.findByFilm_Id(filmId);

        List<ProgrammationDetails> progDtos = progs.stream().map(p -> {
            List<CreneauHebdo> creneaux = creneauHebdoRepository.findByProgrammation_Id(p.getId());

            List<CreneauDto> creneauDtos = creneaux.stream()
                    .map(ch -> new CreneauDto(ch.getJourSemaine(), ch.getHeureDebut()))
                    .toList();

            return new ProgrammationDetails(
                    p.getId(),
                    p.getCinema().getNom(),
                    p.getCinema().getAdresse(),
                    p.getCinema().getVille(),
                    p.getDate_deb(),
                    p.getDate_fin(),
                    creneauDtos
            );
        }).toList();

        return new FilmDetailsResponse(
                film.getId(),
                film.getTitre(),
                film.getDuree(),
                film.getLangue(),
                film.getRealisateur(),
                film.getAge_min(),
                film.getSous_titre(),
                progDtos
        );
    }

    public List<FilmLightResponse> getAllFilms() {
        return filmRepository.findAll().stream()
                .map(f -> new FilmLightResponse(
                        f.getId(),
                        f.getTitre(),
                        f.getDuree(),
                        f.getLangue(),
                        f.getRealisateur(),
                        f.getAge_min(),
                        f.getSous_titre()
                ))
                .toList();
    }

    public List<CinemaLightResponse> getAllCinemas() {
        return cinemaRepository.findAll().stream()
                .map(c -> new CinemaLightResponse(
                        c.getId(),
                        c.getNom(),
                        c.getAdresse(),
                        c.getVille(),
                        c.getProprietaire().getId()
                ))
                .toList();
    }

    public record FilmDetailsResponse(
            Long id,
            String titre,
            Integer duree,
            String langue,
            String realisateur,
            Integer ageMin,
            String sousTitre,
            List<ProgrammationDetails> programmations
    ) {}

    public CinemaDetailsResponse getCinemaDetails(Long cinemaId) {

        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Cinéma introuvable"));

        List<Programmation> progs = programmationRepository.findByCinema_Id(cinemaId);

        List<ProgrammationCinemaDetails> progDtos = progs.stream().map(p -> {

            List<CreneauHebdo> creneaux = creneauHebdoRepository.findByProgrammation_Id(p.getId());

            List<CreneauDto> creneauDtos = creneaux.stream()
                    .map(ch -> new CreneauDto(ch.getJourSemaine(), ch.getHeureDebut()))
                    .toList();

            Film film = p.getFilm();

            return new ProgrammationCinemaDetails(
                    p.getId(),
                    film.getId(),
                    film.getTitre(),
                    film.getDuree(),
                    film.getLangue(),
                    film.getRealisateur(),
                    film.getAge_min(),
                    film.getSous_titre(),
                    p.getDate_deb(),
                    p.getDate_fin(),
                    creneauDtos
            );
        }).toList();

        return new CinemaDetailsResponse(
                cinema.getId(),
                cinema.getNom(),
                cinema.getAdresse(),
                cinema.getVille(),
                cinema.getProprietaire().getId(),
                progDtos
        );
    }




    public record ProgrammationDetails(
            Long id,
            String cinemaNom,
            String cinemaAdresse,
            String cinemaVille,
            LocalDate dateDeb,
            LocalDate dateFin,
            List<CreneauDto> creneaux
    ) {}

    public record CreneauDto(
            efrei.projetREST.entities.JourSemaine jour,
            LocalTime heureDebut
    ) {}

    public record FilmLightResponse(
            Long id,
            String titre,
            Integer duree,
            String langue,
            String realisateur,
            Integer ageMin,
            String sousTitre
    ) {}

    public record CinemaLightResponse(
            Long id,
            String nom,
            String adresse,
            String ville,
            Long idProprietaire
    ) {}


    public record CinemaDetailsResponse(
            Long id,
            String nom,
            String adresse,
            String ville,
            Long idProprietaire,
            List<ProgrammationCinemaDetails> programmations
    ) {}

    public record ProgrammationCinemaDetails(
            Long id,
            Long filmId,
            String filmTitre,
            Integer filmDuree,
            String filmLangue,
            String filmRealisateur,
            Integer filmAgeMin,
            String filmSousTitre,
            java.time.LocalDate dateDeb,
            java.time.LocalDate dateFin,
            List<CreneauDto> creneaux
    ) {}

    public record ProgrammationResponse(
            Long id,
            String dateDeb,
            String dateFin,
            FilmLightResponse film,
            List<CreneauDto> creneaux
    ) {}
}
