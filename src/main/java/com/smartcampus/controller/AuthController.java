package com.smartcampus.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.entity.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
            BCryptPasswordEncoder encoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public String login(@RequestBody User request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().getName());
    }

}
