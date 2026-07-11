package com.projects.RideShare.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.projects.RideShare.dto.GoogleLoginRequest;
import com.projects.RideShare.dto.RegisterRequest;
import com.projects.RideShare.entity.Role;
import com.projects.RideShare.entity.User;
import com.projects.RideShare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.projects.RideShare.dto.LoginRequest;
import java.util.Collections;
import java.util.Optional;
import com.projects.RideShare.security.JwtService;
import com.projects.RideShare.dto.UserProfileResponse;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${google.client.id:}")
    private String googleClientId;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User registerUser(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(Role.valueOf(request.getRole()));


        return userRepository.save(user);
    }

    public String login(LoginRequest request) {

        Optional<User> optionalUser =
                userRepository.findByEmail(request.getEmail());

        if(optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if(passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return jwtService.generateToken(user.getEmail());
        }

        throw new RuntimeException("Invalid Password");
    }

    public String googleLoginOrRegister(GoogleLoginRequest request) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new RuntimeException("Google Client ID is not configured on the server.");
        }

        try {
            // Build the Google token verifier
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // Verify the token
            GoogleIdToken idToken = verifier.verify(request.getIdToken());

            if (idToken == null) {
                throw new RuntimeException("Invalid Google ID Token. Verification failed.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // Find existing user or auto-register as passenger
            Optional<User> existingUser = userRepository.findByEmail(email);

            User user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
            } else {
                // First-time Google login: auto-register as USER (Passenger)
                user = new User();
                user.setEmail(email);
                user.setFullName(name != null ? name : email.split("@")[0]);
                user.setPassword(passwordEncoder.encode(
                        java.util.UUID.randomUUID().toString()
                )); // Random password; Google users won't use password login
                user.setRole(Role.USER);
                userRepository.save(user);
            }

            return jwtService.generateToken(user.getEmail());

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    public UserProfileResponse getProfile(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}