package efrei.projetREST.entities;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="film")
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private Integer duree;

    @Column(nullable = false)
    private String langue;

    @Column(nullable = false)
    private String realisateur;

    @Column(nullable = false)
    private Integer age_min;

    @Column(nullable = false)
    private String sous_titre;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur proprietaire;


    @ManyToMany
    @JoinTable(
            name = "joue",
            joinColumns = @JoinColumn(name = "id_film"),
            inverseJoinColumns = @JoinColumn(name = "id_acteur")
    )
    private Set<Acteur> acteurs = new HashSet<>();


    public Film() {
    }

    public Film(String titre, Integer duree, String langue, String realisateur, Integer age_min, String sous_titre, Utilisateur proprietaire) {
        this.titre = titre;
        this.duree = duree;
        this.langue = langue;
        this.realisateur = realisateur;
        this.age_min = age_min;
        this.sous_titre = sous_titre;
        this.proprietaire = proprietaire;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public Integer getDuree() {
        return duree;
    }

    public void setDuree(Integer duree) {
        this.duree = duree;
    }

    public String getLangue() {
        return langue;
    }

    public void setLangue(String langue) {
        this.langue = langue;
    }

    public String getRealisateur() {
        return realisateur;
    }

    public void setRealisateur(String realisateur) {
        this.realisateur = realisateur;
    }

    public Integer getAge_min() {
        return age_min;
    }

    public void setAge_min(Integer age_min) {
        this.age_min = age_min;
    }

    public String getSous_titre() {
        return sous_titre;
    }

    public void setSous_titre(String sous_titre) {
        this.sous_titre = sous_titre;
    }

    public Utilisateur getProprietaire() {
        return proprietaire;
    }

    public void setProprietaire(Utilisateur proprietaire) {
        this.proprietaire = proprietaire;
    }

    public Set<Acteur> getActeurs() { return acteurs; }

    public void setActeurs(Set<Acteur> acteurs) { this.acteurs = acteurs; }
}
