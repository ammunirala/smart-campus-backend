import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "./Management.css";
import "./Teachers.css";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load teachers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return teachers;

    return teachers.filter(
      (teacher) =>
        teacher.name?.toLowerCase().includes(query) ||
        teacher.employeeId?.toLowerCase().includes(query) ||
        teacher.department?.toLowerCase().includes(query) ||
        teacher.user?.email?.toLowerCase().includes(query)
    );
  }, [teachers, search]);

  const departments = new Set(
    teachers.map((teacher) => teacher.department).filter(Boolean)
  ).size;

  const activeTeachers = teachers.filter(
    (teacher) => teacher.user?.enabled
  ).length;

  return (
    <div className="management-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">FACULTY MANAGEMENT</p>
          <h1>Teachers</h1>
          <p>
            Manage faculty members and their assigned courses.
          </p>
        </div>

        <button className="primary-button">
          + Add Teacher
        </button>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <span>Total Teachers</span>
          <strong>{loading ? "..." : teachers.length}</strong>
          <small>Registered faculty members</small>
        </div>

        <div className="overview-card">
          <span>Departments</span>
          <strong>{loading ? "..." : departments}</strong>
          <small>Academic departments</small>
        </div>

        <div className="overview-card">
          <span>Active Faculty</span>
          <strong>{loading ? "..." : activeTeachers}</strong>
          <small>Enabled teacher accounts</small>
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
            <h2>Faculty Directory</h2>
            <p>
              {filteredTeachers.length} teacher
              {filteredTeachers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="teacher-toolbar">
            <input
              className="search-input"
              type="text"
              placeholder="Search teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="secondary-button"
              onClick={loadTeachers}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading teachers...
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">TC</div>
            <h3>No teachers found</h3>
            <p>Change your search or add a teacher.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="management-table">
              <thead>
                <tr>
                  <th>TEACHER</th>
                  <th>EMPLOYEE ID</th>
                  <th>DEPARTMENT</th>
                  <th>COURSES</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      <div className="entity-cell">
                        <div className="teacher-avatar">
                          {teacher.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{teacher.name}</strong>
                          <span>
                            {teacher.user?.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="code-badge">
                        {teacher.employeeId}
                      </span>
                    </td>

                    <td>{teacher.department}</td>

                    <td>
                      <span className="teacher-course-count">
                        {teacher.courses?.length || 0}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          teacher.user?.enabled
                            ? "active-badge"
                            : "inactive-badge"
                        }
                      >
                        {teacher.user?.enabled
                          ? "Active"
                          : "Disabled"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="teacher-view-button"
                        onClick={() =>
                          setSelectedTeacher(teacher)
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

      {selectedTeacher && (
        <div
          className="modal-overlay"
          onMouseDown={() => setSelectedTeacher(null)}
        >
          <div
            className="modal-card teacher-details-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="teacher-modal-eyebrow">
                  FACULTY PROFILE
                </p>
                <h2>{selectedTeacher.name}</h2>
                <p>{selectedTeacher.employeeId}</p>
              </div>

              <button
                className="close-button"
                onClick={() => setSelectedTeacher(null)}
              >
                ×
              </button>
            </div>

            <div className="teacher-profile-header">
              <div className="teacher-profile-avatar">
                {selectedTeacher.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h3>{selectedTeacher.name}</h3>
                <p>{selectedTeacher.user?.email}</p>

                <span
                  className={
                    selectedTeacher.user?.enabled
                      ? "active-badge"
                      : "inactive-badge"
                  }
                >
                  {selectedTeacher.user?.enabled
                    ? "Active Faculty"
                    : "Disabled Account"}
                </span>
              </div>
            </div>

            <div className="teacher-info-grid">
              <div>
                <span>Employee ID</span>
                <strong>
                  {selectedTeacher.employeeId}
                </strong>
              </div>

              <div>
                <span>Assigned Courses</span>
                <strong>
                  {selectedTeacher.courses?.length || 0}
                </strong>
              </div>

              <div className="teacher-full-info">
                <span>Department</span>
                <strong>
                  {selectedTeacher.department}
                </strong>
              </div>
            </div>

            <div className="teacher-courses-section">
              <div className="teacher-courses-heading">
                <div>
                  <h3>Assigned Courses</h3>
                  <p>
                    Courses currently assigned to this faculty member
                  </p>
                </div>

                <span>
                  {selectedTeacher.courses?.length || 0}
                </span>
              </div>

              {selectedTeacher.courses?.length > 0 ? (
                <div className="teacher-course-list">
                  {selectedTeacher.courses.map((course) => (
                    <div
                      className="teacher-course-card"
                      key={course.id}
                    >
                      <div className="teacher-course-icon">
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
                <div className="teacher-no-courses">
                  No courses assigned
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;