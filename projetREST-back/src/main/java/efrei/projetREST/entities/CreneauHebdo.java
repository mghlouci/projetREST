package efrei.projetREST.entities;


import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "creneau_hebdo")
public class CreneauHebdo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "jour_semaine", nullable = false)
    private JourSemaine jourSemaine;


    @Column(name = "heure_debut", nullable = false)
    private LocalTime heureDebut;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_programmation", nullable = false)
    private Programmation programmation;

    public CreneauHebdo() {
    }

    public CreneauHebdo(JourSemaine jourSemaine, LocalTime heureDebut, Programmation programmation) {
        this.jourSemaine = jourSemaine;
        this.heureDebut = heureDebut;
        this.programmation = programmation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JourSemaine getJourSemaine() {
        return jourSemaine;
    }

    public void setJourSemaine(JourSemaine jourSemaine) {
        this.jourSemaine = jourSemaine;
    }

    public LocalTime getHeureDebut() {
        return heureDebut;
    }

    public void setHeureDebut(LocalTime heureDebut) {
        this.heureDebut = heureDebut;
    }

    public Programmation getProgrammation() {
        return programmation;
    }

    public void setProgrammation(Programmation programmation) {
        this.programmation = programmation;
    }
}
