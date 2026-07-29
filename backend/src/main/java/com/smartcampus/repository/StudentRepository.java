package com.smartcampus.repository;

import com.smartcampus.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByRollNumber(String rollNumber);

    Optional<Student> findByUserEmail(String email);

    List<Student> findByCoursesId(Long courseId);
}