package efrei.projetREST.controller;

import efrei.projetREST.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthService.LoginResponse> login(@RequestBody AuthService.LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthService.RegisterResponse> register(@RequestBody AuthService.RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

}
