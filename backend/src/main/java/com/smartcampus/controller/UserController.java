package com.smartcampus.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.entity.User;
import com.smartcampus.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public User createUser(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role
    ) {
        return userService.createUser(email, password, role);
    }

    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public User updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled
    ) {
        return userService.updateStatus(id, enabled);
    }
}
