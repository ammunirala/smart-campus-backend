import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "./Management.css";
import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students");
      setStudents(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        student.name?.toLowerCase().includes(query) ||
        student.rollNumber?.toLowerCase().includes(query) ||
        student.department?.toLowerCase().includes(query) ||
        student.user?.email?.toLowerCase().includes(query);

      const matchesSemester =
        semester === "all" ||
        String(student.semester) === semester;

      return matchesSearch && matchesSemester;
    });
  }, [students, search, semester]);

  const departments = new Set(
    students.map((student) => student.department).filter(Boolean)
  ).size;

  return (
    <div className="management-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">STUDENT MANAGEMENT</p>
          <h1>Students</h1>
          <p>
            View and manage registered students across the campus.
          </p>
        </div>

        <button className="primary-button">
          + Add Student
        </button>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <span>Total Students</span>
          <strong>{loading ? "..." : students.length}</strong>
          <small>Registered students</small>
        </div>

        <div className="overview-card">
          <span>Departments</span>
          <strong>{loading ? "..." : departments}</strong>
          <small>Academic departments</small>
        </div>

        <div className="overview-card">
          <span>Active Accounts</span>
          <strong>
            {loading
              ? "..."
              : students.filter(
                  (student) => student.user?.enabled
                ).length}
          </strong>
          <small>Enabled student accounts</small>
        </div>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <div className="management-card">
        <div className="table-toolbar">
          <div>
            <h2>Student Directory</h2>
            <p>
              {filteredStudents.length} student
              {filteredStudents.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="student-toolbar">
            <input
              className="search-input"
              type="text"
              placeholder="Search name, roll no, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="student-filter"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>

            <button
              className="secondary-button"
              onClick={loadStudents}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">ST</div>
            <h3>No students found</h3>
            <p>
              Change your filters or add a new student.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="management-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>ROLL NUMBER</th>
                  <th>DEPARTMENT</th>
                  <th>SEMESTER</th>
                  <th>COURSES</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="entity-cell">
                        <div className="student-avatar">
                          {student.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{student.name}</strong>
                          <span>
                            {student.user?.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="code-badge">
                        {student.rollNumber}
                      </span>
                    </td>

                    <td>{student.department}</td>

                    <td>
                      Semester {student.semester}
                    </td>

                    <td>
                      <span className="course-count">
                        {student.courses?.length || 0}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          student.user?.enabled
                            ? "active-badge"
                            : "inactive-badge"
                        }
                      >
                        {student.user?.enabled
                          ? "Active"
                          : "Disabled"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-button"
                        onClick={() =>
                          setSelectedStudent(student)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedStudent && (
        <div
          className="modal-overlay"
          onMouseDown={() => setSelectedStudent(null)}
        >
          <div
            className="modal-card student-details-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="student-modal-eyebrow">
                  STUDENT PROFILE
                </p>
                <h2>{selectedStudent.name}</h2>
                <p>{selectedStudent.rollNumber}</p>
              </div>

              <button
                className="close-button"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </button>
            </div>

            <div className="profile-header">
              <div className="profile-avatar">
                {selectedStudent.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h3>{selectedStudent.name}</h3>
                <p>{selectedStudent.user?.email}</p>

                <span
                  className={
                    selectedStudent.user?.enabled
                      ? "active-badge"
                      : "inactive-badge"
                  }
                >
                  {selectedStudent.user?.enabled
                    ? "Active Account"
                    : "Disabled Account"}
                </span>
              </div>
            </div>

            <div className="student-info-grid">
              <div>
                <span>Roll Number</span>
                <strong>
                  {selectedStudent.rollNumber}
                </strong>
              </div>

              <div>
                <span>Semester</span>
                <strong>
                  Semester {selectedStudent.semester}
                </strong>
              </div>

              <div className="full-info">
                <span>Department</span>
                <strong>
                  {selectedStudent.department}
                </strong>
              </div>
            </div>

            <div className="enrolled-section">
              <div className="enrolled-heading">
                <div>
                  <h3>Enrolled Courses</h3>
                  <p>
                    Courses currently assigned to this student
                  </p>
                </div>

                <span>
                  {selectedStudent.courses?.length || 0}
                </span>
              </div>

              {selectedStudent.courses?.length > 0 ? (
                <div className="student-course-list">
                  {selectedStudent.courses.map((course) => (
                    <div
                      className="student-course-card"
                      key={course.id}
                    >
                      <div className="student-course-icon">
                        CR
                      </div>

                      <div>
                        <strong>{course.name}</strong>
                        <p>{course.code}</p>
                        <small>
                          {course.department} · Semester{" "}
                          {course.semester}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-courses">
                  No courses enrolled
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;