package com.smartcampus.service;

import com.smartcampus.entity.Course;
import com.smartcampus.entity.Teacher;
import com.smartcampus.repository.CourseRepository;
import com.smartcampus.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;

    public TeacherService(
            TeacherRepository teacherRepository,
            CourseRepository courseRepository) {

        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
    }

    public Teacher createTeacher(Teacher teacher) {

        if (teacherRepository.existsByEmployeeId(teacher.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists");
        }

        return teacherRepository.save(teacher);
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }

    public Teacher assignCourse(Long teacherId, Long courseId) {

        Teacher teacher = getTeacherById(teacherId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        teacher.getCourses().add(course);

        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {

        if (!teacherRepository.existsById(id)) {
            throw new RuntimeException("Teacher not found");
        }

        teacherRepository.deleteById(id);
    }

    public Teacher getTeacherByEmail(String email) {
        return teacherRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
    }
}