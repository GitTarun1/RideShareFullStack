package com.projects.RideShare.controller;

import com.projects.RideShare.dto.GoogleLoginRequest;
import com.projects.RideShare.dto.RegisterRequest;
import com.projects.RideShare.entity.User;
import com.projects.RideShare.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.projects.RideShare.dto.LoginRequest;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;
import com.projects.RideShare.dto.UserProfileResponse;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@Valid @RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/google-login")
    public String googleLogin(@RequestBody GoogleLoginRequest request) {
        return userService.googleLoginOrRegister(request);
    }

    @GetMapping("/test")
    public String test() {
        return "JWT is working";
    }

    @GetMapping("/profile")
    public UserProfileResponse profile(Authentication authentication) {
        return userService.getProfile(authentication.getName());
    }
}