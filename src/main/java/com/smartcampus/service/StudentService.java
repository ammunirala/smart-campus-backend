package com.smartcampus.service;

import com.smartcampus.entity.Course;
import com.smartcampus.entity.Student;
import com.smartcampus.repository.CourseRepository;
import com.smartcampus.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public StudentService(
            StudentRepository studentRepository,
            CourseRepository courseRepository) {

        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public Student createStudent(Student student) {

        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            throw new RuntimeException("Roll number already exists");
        }

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student enrollCourse(Long studentId, Long courseId) {

        Student student = getStudentById(studentId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        student.getCourses().add(course);

        return studentRepository.save(student);
    }

    public Student removeCourse(Long studentId, Long courseId) {

        Student student = getStudentById(studentId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        student.getCourses().remove(course);

        return studentRepository.save(student);
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
    }

    public Student getMyProfile(String email) {
        return getStudentByEmail(email);
    }

    public void deleteStudent(Long id) {

        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found");
        }

        studentRepository.deleteById(id);
    }
}