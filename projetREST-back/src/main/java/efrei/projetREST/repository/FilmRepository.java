package efrei.projetREST.repository;


import efrei.projetREST.entities.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends JpaRepository<Film,Long> {



    List<Film> findByTitreContainingIgnoreCase(String titre);
}
