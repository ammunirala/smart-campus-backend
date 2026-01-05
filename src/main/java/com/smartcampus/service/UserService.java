package com.smartcampus.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartcampus.entity.Role;
import com.smartcampus.entity.User;
import com.smartcampus.exception.UserNotFoundException;
import com.smartcampus.repository.RoleRepository;
import com.smartcampus.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepo,
            RoleRepository roleRepo,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(String email, String password, String roleName) {

        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEnabled(true);

        return userRepo.save(user);
    }

    public User updateStatus(Long userId, boolean enabled) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setEnabled(enabled);
        return userRepo.save(user);
    }

    // (Admin use – future)
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @PostConstruct
    public void printAdminHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("ADMIN HASH = " + encoder.encode("admin123"));
    }

    
}
