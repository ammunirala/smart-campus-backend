package com.smartcampus.controller;

import com.smartcampus.entity.Student;
import com.smartcampus.service.StudentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Student createStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public Student getStudent(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public Student getMyProfile(Authentication authentication) {
        return studentService.getMyProfile(authentication.getName());
    }

    @PostMapping("/{studentId}/courses/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Student enrollCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        return studentService.enrollCourse(studentId, courseId);
    }

    @DeleteMapping("/{studentId}/courses/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Student removeCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        return studentService.removeCourse(studentId, courseId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteStudent(@PathVariable Long id) {

        studentService.deleteStudent(id);

        return "Student deleted successfully";
    }
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public List<Student> getStudentsByCourse(
            @PathVariable Long courseId) {

        return studentService.getStudentsByCourse(courseId);
    }
}