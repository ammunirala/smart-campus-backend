package com.smartcampus.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('TEACHER')")
    public String teacherDashboard() {
        return "TEACHER DASHBOARD ACCESS ✅";
    }
}
