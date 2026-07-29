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

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [assigning, setAssigning] = useState(false);
  const [removingCourseId, setRemovingCourseId] = useState(null);

  const [assignMessage, setAssignMessage] = useState("");
  const [assignError, setAssignError] = useState("");

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load teachers"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setAssignError("Failed to load available courses");
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const updateTeacherLocally = (updatedTeacher) => {
    setSelectedTeacher(updatedTeacher);

    setTeachers((currentTeachers) =>
      currentTeachers.map((teacher) =>
        teacher.id === updatedTeacher.id
          ? updatedTeacher
          : teacher
      )
    );
  };

  const openTeacher = async (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedCourseId("");
    setAssignMessage("");
    setAssignError("");

    await loadCourses();
  };

  const closeTeacher = () => {
    setSelectedTeacher(null);
    setSelectedCourseId("");
    setAssignMessage("");
    setAssignError("");
    setRemovingCourseId(null);
  };

  const assignCourse = async () => {
    if (!selectedTeacher || !selectedCourseId) {
      return;
    }

    try {
      setAssigning(true);
      setAssignMessage("");
      setAssignError("");

      const response = await api.post(
        `/teachers/${selectedTeacher.id}/courses/${selectedCourseId}`
      );

      updateTeacherLocally(response.data);

      setSelectedCourseId("");
      setAssignMessage("Course assigned successfully.");
    } catch (err) {
      setAssignError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to assign course"
      );
    } finally {
      setAssigning(false);
    }
  };

  const removeCourse = async (courseId) => {
    if (!selectedTeacher) {
      return;
    }

    const confirmed = window.confirm(
      "Remove this course from the teacher?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingCourseId(courseId);
      setAssignMessage("");
      setAssignError("");

      const response = await api.delete(
        `/teachers/${selectedTeacher.id}/courses/${courseId}`
      );

      updateTeacherLocally(response.data);

      setAssignMessage("Course removed successfully.");
    } catch (err) {
      setAssignError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to remove course"
      );
    } finally {
      setRemovingCourseId(null);
    }
  };

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
    teachers
      .map((teacher) => teacher.department)
      .filter(Boolean)
  ).size;

  const activeTeachers = teachers.filter(
    (teacher) => teacher.user?.enabled
  ).length;

  const availableCourses = useMemo(() => {
    if (!selectedTeacher) return [];

    const assignedCourseIds = new Set(
      selectedTeacher.courses?.map(
        (course) => course.id
      ) || []
    );

    return courses.filter(
      (course) => !assignedCourseIds.has(course.id)
    );
  }, [courses, selectedTeacher]);

  return (
    <div className="management-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">
            FACULTY MANAGEMENT
          </p>

          <h1>Teachers</h1>

          <p>
            Manage faculty members and their assigned
            courses.
          </p>
        </div>

        <button className="primary-button">
          + Add Teacher
        </button>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <span>Total Teachers</span>

          <strong>
            {loading ? "..." : teachers.length}
          </strong>

          <small>
            Registered faculty members
          </small>
        </div>

        <div className="overview-card">
          <span>Departments</span>

          <strong>
            {loading ? "..." : departments}
          </strong>

          <small>
            Academic departments
          </small>
        </div>

        <div className="overview-card">
          <span>Active Faculty</span>

          <strong>
            {loading ? "..." : activeTeachers}
          </strong>

          <small>
            Enabled teacher accounts
          </small>
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
              {filteredTeachers.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="teacher-toolbar">
            <input
              className="search-input"
              type="text"
              placeholder="Search teacher..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
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
            <div className="empty-icon">
              TC
            </div>

            <h3>No teachers found</h3>

            <p>
              Change your search or add a teacher.
            </p>
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
                {filteredTeachers.map(
                  (teacher) => (
                    <tr key={teacher.id}>
                      <td>
                        <div className="entity-cell">
                          <div className="teacher-avatar">
                            {teacher.name
                              ?.split(" ")
                              .map(
                                (word) =>
                                  word[0]
                              )
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {teacher.name}
                            </strong>

                            <span>
                              {teacher.user
                                ?.email ||
                                "No email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="code-badge">
                          {teacher.employeeId}
                        </span>
                      </td>

                      <td>
                        {teacher.department}
                      </td>

                      <td>
                        <span className="teacher-course-count">
                          {teacher.courses
                            ?.length || 0}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            teacher.user
                              ?.enabled
                              ? "active-badge"
                              : "inactive-badge"
                          }
                        >
                          {teacher.user
                            ?.enabled
                            ? "Active"
                            : "Disabled"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="teacher-view-button"
                          onClick={() =>
                            openTeacher(
                              teacher
                            )
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTeacher && (
        <div
          className="modal-overlay"
          onMouseDown={closeTeacher}
        >
          <div
            className="modal-card teacher-details-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <p className="teacher-modal-eyebrow">
                  FACULTY PROFILE
                </p>

                <h2>
                  {selectedTeacher.name}
                </h2>

                <p>
                  {selectedTeacher.employeeId}
                </p>
              </div>

              <button
                className="close-button"
                onClick={closeTeacher}
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
                <h3>
                  {selectedTeacher.name}
                </h3>

                <p>
                  {selectedTeacher.user
                    ?.email || "No email"}
                </p>

                <span
                  className={
                    selectedTeacher.user
                      ?.enabled
                      ? "active-badge"
                      : "inactive-badge"
                  }
                >
                  {selectedTeacher.user
                    ?.enabled
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
                <span>
                  Assigned Courses
                </span>

                <strong>
                  {selectedTeacher.courses
                    ?.length || 0}
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
                  <h3>
                    Assigned Courses
                  </h3>

                  <p>
                    Courses currently assigned
                    to this faculty member
                  </p>
                </div>

                <span>
                  {selectedTeacher.courses
                    ?.length || 0}
                </span>
              </div>

              <div className="teacher-assign-course">
                <select
                  value={selectedCourseId}
                  onChange={(e) =>
                    setSelectedCourseId(
                      e.target.value
                    )
                  }
                  disabled={
                    assigning ||
                    availableCourses.length ===
                      0
                  }
                >
                  <option value="">
                    {availableCourses.length ===
                    0
                      ? "No courses available"
                      : "Select course to assign"}
                  </option>

                  {availableCourses.map(
                    (course) => (
                      <option
                        key={course.id}
                        value={course.id}
                      >
                        {course.code} -{" "}
                        {course.name}
                      </option>
                    )
                  )}
                </select>

                <button
                  className="primary-button"
                  onClick={assignCourse}
                  disabled={
                    !selectedCourseId ||
                    assigning ||
                    availableCourses.length ===
                      0
                  }
                >
                  {assigning
                    ? "Assigning..."
                    : "Assign Course"}
                </button>
              </div>

              {assignMessage && (
                <div className="teacher-assign-success">
                  {assignMessage}
                </div>
              )}

              {assignError && (
                <div className="alert error-alert">
                  {assignError}
                </div>
              )}

              {selectedTeacher.courses
                ?.length > 0 ? (
                <div className="teacher-course-list">
                  {selectedTeacher.courses.map(
                    (course) => (
                      <div
                        className="teacher-course-card"
                        key={course.id}
                      >
                        <div className="teacher-course-icon">
                          CR
                        </div>

                        <div className="teacher-course-details">
                          <strong>
                            {course.name}
                          </strong>

                          <p>
                            {course.code}
                          </p>

                          <small>
                            {course.department} ·
                            Semester{" "}
                            {course.semester}
                          </small>
                        </div>

                        <button
                          className="teacher-remove-course"
                          onClick={() =>
                            removeCourse(
                              course.id
                            )
                          }
                          disabled={
                            removingCourseId ===
                            course.id
                          }
                        >
                          {removingCourseId ===
                          course.id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    )
                  )}
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