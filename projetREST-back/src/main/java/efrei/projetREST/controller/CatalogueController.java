package efrei.projetREST.controller;

import efrei.projetREST.entities.Film;
import efrei.projetREST.service.CatalogueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/Catalogue")
public class CatalogueController {

    private final CatalogueService catalogueService;

    public CatalogueController(CatalogueService catalogueService) {
        this.catalogueService = catalogueService;
    }


    @GetMapping("/films")
    public ResponseEntity<List<CatalogueService.FilmLightResponse>> films(
            @RequestParam(required = false) String ville
    ) {
        return ResponseEntity.ok(catalogueService.getFilms(ville));
    }



    @GetMapping("/films/{id}")
    public ResponseEntity<CatalogueService.FilmDetailsResponse> detailsFilm(@PathVariable Long id) {
        return ResponseEntity.ok(catalogueService.getFilmDetails(id));
    }

    @GetMapping("/cinemas")
    public ResponseEntity<List<CatalogueService.CinemaLightResponse>> tousLesCinemas() {
        return ResponseEntity.ok(catalogueService.getAllCinemas());
    }

    @GetMapping("/cinemas/{id}")
    public ResponseEntity<CatalogueService.CinemaLightResponse> detailsCinema(@PathVariable Long id) {
        return ResponseEntity.ok(catalogueService.getCinemaDetails(id));
    }

}
