package com.smartcampus.controller;

import com.smartcampus.entity.Attendance;
import com.smartcampus.service.AttendanceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public Attendance markAttendance(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            @RequestParam LocalDate date,
            @RequestParam boolean present,
            Authentication authentication) {

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN"));

        if (isAdmin) {
            return attendanceService.markAttendance(
                    studentId,
                    courseId,
                    date,
                    present
            );
        }

        return attendanceService.markAttendanceByTeacher(
                authentication.getName(),
                studentId,
                courseId,
                date,
                present
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public List<Attendance> getStudentAttendance(
            @PathVariable Long studentId) {

        return attendanceService.getStudentAttendance(studentId);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Attendance> getMyAttendance(
            Authentication authentication) {

        return attendanceService.getMyAttendance(
                authentication.getName()
        );
    }

    @GetMapping("/student/{studentId}/course/{courseId}/percentage")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public Map<String, Double> getPercentage(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        double percentage =
                attendanceService.getAttendancePercentage(
                        studentId,
                        courseId
                );

        return Map.of(
                "attendancePercentage",
                percentage
        );
    }
}