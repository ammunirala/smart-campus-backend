package com.smartcampus.service;

import com.smartcampus.entity.Attendance;
import com.smartcampus.entity.Course;
import com.smartcampus.entity.Student;
import com.smartcampus.entity.Teacher;
import com.smartcampus.exception.ForbiddenException;
import com.smartcampus.repository.AttendanceRepository;
import com.smartcampus.repository.CourseRepository;
import com.smartcampus.repository.StudentRepository;
import com.smartcampus.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            TeacherRepository teacherRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
    }

    public Attendance markAttendance(
            Long studentId,
            Long courseId,
            LocalDate date,
            boolean present) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Attendance attendance = attendanceRepository
                .findByStudentIdAndCourseIdAndDate(
                        studentId,
                        courseId,
                        date
                )
                .orElse(new Attendance());

        attendance.setStudent(student);
        attendance.setCourse(course);
        attendance.setDate(date);
        attendance.setPresent(present);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getStudentAttendance(Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found");
        }

        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getMyAttendance(String email) {

        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Student profile not found"));

        return attendanceRepository.findByStudentId(student.getId());
    }

    public double getAttendancePercentage(
            Long studentId,
            Long courseId) {

        List<Attendance> records =
                attendanceRepository.findByStudentIdAndCourseId(
                        studentId,
                        courseId
                );

        if (records.isEmpty()) {
            return 0.0;
        }

        long present = records.stream()
                .filter(Attendance::isPresent)
                .count();

        return (present * 100.0) / records.size();
    }

    public Attendance markAttendanceByTeacher(
            String email,
            Long studentId,
            Long courseId,
            LocalDate date,
            boolean present) {

        Teacher teacher = teacherRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Teacher profile not found"));

        boolean assigned = teacher.getCourses()
                .stream()
                .anyMatch(course ->
                        course.getId().equals(courseId));

        if (!assigned) {
            throw new ForbiddenException(
                    "Teacher is not assigned to this course"
            );
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        boolean enrolled = student.getCourses()
                .stream()
                .anyMatch(course ->
                        course.getId().equals(courseId));

        if (!enrolled) {
            throw new RuntimeException(
                    "Student is not enrolled in this course"
            );
        }

        return markAttendance(
                studentId,
                courseId,
                date,
                present
        );
    }
}