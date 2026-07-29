package com.smartcampus.repository;

import com.smartcampus.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    boolean existsByEmployeeId(String employeeId);

    Optional<Teacher> findByUserEmail(String email);
}