package com.smartcampus.controller;

import com.smartcampus.repository.CourseRepository;
import com.smartcampus.repository.StudentRepository;
import com.smartcampus.repository.TeacherRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public DashboardController(
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {

        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getDashboard() {

        return Map.of(
                "totalStudents", studentRepository.count(),
                "totalTeachers", teacherRepository.count(),
                "totalCourses", courseRepository.count(),
                "totalUsers", userRepository.count()
        );
    }
}