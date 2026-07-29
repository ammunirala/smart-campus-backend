package com.smartcampus.repository;

import com.smartcampus.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );

    Optional<Attendance> findByStudentIdAndCourseIdAndDate(
            Long studentId,
            Long courseId,
            LocalDate date
    );
}