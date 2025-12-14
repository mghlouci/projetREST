package efrei.projetREST.repository;

import efrei.projetREST.entities.Film;
import efrei.projetREST.entities.Programmation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgrammationRepository extends JpaRepository<Programmation,Long> {

    @Query("""
    select distinct p.film
    from Programmation p
    where lower(p.cinema.ville) = lower(:ville)
    """)
    List<Film> findFilmsByVille(@Param("ville") String ville);


    List<Programmation> findByFilm_Id(Long filmId);

}
