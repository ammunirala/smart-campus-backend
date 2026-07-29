package com.smartcampus.controller;

import com.smartcampus.entity.Teacher;
import com.smartcampus.service.TeacherService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Teacher createTeacher(@RequestBody Teacher teacher) {
        return teacherService.createTeacher(teacher);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TEACHER')")
    public Teacher getMyProfile(Authentication authentication) {
        return teacherService.getTeacherByEmail(authentication.getName());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public Teacher getTeacher(@PathVariable Long id) {
        return teacherService.getTeacherById(id);
    }

    @PostMapping("/{teacherId}/courses/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Teacher assignCourse(
            @PathVariable Long teacherId,
            @PathVariable Long courseId) {

        return teacherService.assignCourse(teacherId, courseId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return "Teacher deleted successfully";
    }
}