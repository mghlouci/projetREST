package efrei.projetREST.controller;

import efrei.projetREST.entities.Programmation;
import efrei.projetREST.service.PublicationService;
import efrei.projetREST.service.PublicationService.CreneauInput;
import efrei.projetREST.service.PublicationService.FilmCreateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/publication")
public class PublicationController {

    private final PublicationService publicationService;

    public PublicationController(PublicationService publicationService) {
        this.publicationService = publicationService;
    }

    //Publier un film
    @PostMapping("/films")
    public ResponseEntity<Long> publierFilm(
            @RequestBody FilmCreateRequest request,
            @RequestParam Long proprietaireId
    ) {
        var film = publicationService.publierFilm(request, proprietaireId);
        return ResponseEntity.ok(film.getId());
    }

    //Publier une programmation
    @PostMapping("/programmations")
    public ResponseEntity<Long> publierProgrammation(
            @RequestBody ProgrammationCreateRequest request
    ) {
        Programmation prog = publicationService.publierProgrammation(
                request.filmId(),
                request.cinemaId(),
                request.dateDeb(),
                request.dateFin(),
                request.creneaux()
        );

        return ResponseEntity.ok(prog.getId());
    }


    @PostMapping("/cinemas")
    public ResponseEntity<Long> creerCinema(
            @RequestBody PublicationService.CinemaCreateRequest request,
            @RequestParam Long proprietaireId
    ) {
        var cinema = publicationService.creerCinema(request, proprietaireId);
        return ResponseEntity.ok(cinema.getId());
    }


    public record ProgrammationCreateRequest(
            Long filmId,
            Long cinemaId,
            LocalDate dateDeb,
            LocalDate dateFin,
            List<CreneauInput> creneaux
    ) {}
}
