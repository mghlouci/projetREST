package efrei.projetREST.service;

import efrei.projetREST.entities.Utilisateur;
import efrei.projetREST.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;

    public AuthService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest req) {
        Utilisateur u = utilisateurRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe invalide"));

        if (!u.getMdp().equals(req.mdp())) {
            throw new RuntimeException("Email ou mot de passe invalide");
        }

        return new LoginResponse(u.getId(), u.getRole(), u.getEmail());
    }


    public RegisterResponse register(RegisterRequest req) {

        if (req.email() == null || req.email().isBlank()
                || req.mdp() == null || req.mdp().isBlank()
                || req.role() == null || req.role().isBlank()) {
            throw new RuntimeException("Champs manquants");
        }

        if (utilisateurRepository.existsByEmail(req.email())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Utilisateur u = new Utilisateur(req.email(), req.mdp(), req.role());
        u = utilisateurRepository.save(u);

        return new RegisterResponse(u.getId(), u.getEmail(), u.getRole());
    }

    public record LoginRequest(String email, String mdp) {}
    public record LoginResponse(Long userId, String role, String email) {}

    public record RegisterRequest(String email, String mdp, String role) {}
    public record RegisterResponse(Long userId, String email, String role) {}
}
