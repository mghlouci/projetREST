package efrei.projetREST.repository;

import efrei.projetREST.entities.Acteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActeurRepository extends JpaRepository<Acteur,Long> {

}
