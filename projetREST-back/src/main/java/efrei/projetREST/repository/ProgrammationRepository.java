package efrei.projetREST.repository;

import efrei.projetREST.entities.Film;
import efrei.projetREST.entities.Programmation;
import org.springframework.data.jpa.repository.EntityGraph;
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
    where (:ville is null or :ville = '' or lower(p.cinema.ville) = lower(:ville))
      and (:query is null or :query = '' or lower(p.film.titre) like lower(concat('%', :query, '%')))
""")
    List<Film> findFilmsByVilleAndTitreLike(@Param("ville") String ville, @Param("query") String query);


    List<Programmation> findByFilm_Id(Long filmId);

    List<Programmation> findByCinema_Id(Long cinemaId);


}
