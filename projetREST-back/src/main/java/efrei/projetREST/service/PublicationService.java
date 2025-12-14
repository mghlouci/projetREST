package efrei.projetREST.service;

import efrei.projetREST.entities.*;
import efrei.projetREST.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class PublicationService {

    private final FilmRepository filmRepository;
    private final CinemaRepository cinemaRepository;
    private final ProgrammationRepository programmationRepository;
    private final CreneauHebdoRepository creneauHebdoRepository;
    private final UtilisateurRepository utilisateurRepository;

    public PublicationService(FilmRepository filmRepository,
                              CinemaRepository cinemaRepository,
                              ProgrammationRepository programmationRepository,
                              CreneauHebdoRepository creneauHebdoRepository,
                              UtilisateurRepository utilisateurRepository) {
        this.filmRepository = filmRepository;
        this.cinemaRepository = cinemaRepository;
        this.programmationRepository = programmationRepository;
        this.creneauHebdoRepository = creneauHebdoRepository;
        this.utilisateurRepository = utilisateurRepository;
    }


    public Film publierFilm(FilmCreateRequest req, Long proprietaireId) {
        Utilisateur proprietaire = utilisateurRepository.findById(proprietaireId)
                .orElseThrow(() -> new RuntimeException("Propriétaire introuvable"));

        Film film = new Film(
                req.titre(),
                req.duree(),
                req.langue(),
                req.realisateur(),
                req.ageMin(),
                req.sousTitre(),
                proprietaire
        );

        return filmRepository.save(film);
    }

    public Programmation publierProgrammation(Long filmId,
                                              Long cinemaId,
                                              LocalDate dateDeb,
                                              LocalDate dateFin,
                                              List<CreneauInput> creneaux) {

        if (dateFin.isBefore(dateDeb)) {
            throw new RuntimeException("date_fin doit être >= date_deb");
        }
        if (creneaux == null || creneaux.size() != 3) {
            throw new RuntimeException("Il faut exactement 3 créneaux (3 jours/semaine)");
        }

        Film film = filmRepository.findById(filmId)
                .orElseThrow(() -> new RuntimeException("Film introuvable"));
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Cinéma introuvable"));

        Programmation prog = new Programmation(dateDeb, dateFin, film, cinema);
        prog = programmationRepository.save(prog);

        long distinctDays = creneaux.stream().map(CreneauInput::jour).distinct().count();
        if (distinctDays != 3) {
            throw new RuntimeException("Les 3 créneaux doivent être sur 3 jours différents");
        }

        for (CreneauInput c : creneaux) {
            CreneauHebdo ch = new CreneauHebdo(c.jour(), c.heureDebut(), prog);
            creneauHebdoRepository.save(ch);
        }

        return prog;
    }

    public Cinema creerCinema(CinemaCreateRequest req, Long proprietaireId) {

        Utilisateur proprietaire = utilisateurRepository.findById(proprietaireId)
                .orElseThrow(() -> new RuntimeException("Propriétaire introuvable"));

        Cinema cinema = new Cinema(req.nom(), req.adresse(), req.ville(), proprietaire);

        return cinemaRepository.save(cinema);
    }


    // DTO pour créer un film
    public record FilmCreateRequest(
            String titre,
            Integer duree,
            String langue,
            String realisateur,
            Integer ageMin,
            String sousTitre
    ) {}

    public record CinemaCreateRequest(
            String nom,
            String adresse,
            String ville
    ) {}




    // DTO pour les créneaux
    public record CreneauInput(JourSemaine jour, LocalTime heureDebut) {}
}
