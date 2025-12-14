package efrei.projetREST.repository;

import efrei.projetREST.entities.CreneauHebdo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreneauHebdoRepository extends JpaRepository<CreneauHebdo,Long> {

    List<CreneauHebdo> findByProgrammation_Id(Long programmationId);
}
