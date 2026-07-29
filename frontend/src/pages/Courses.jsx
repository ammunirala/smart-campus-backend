import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Management.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    department: "",
    semester: "",
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createCourse = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await api.post("/courses", {
        ...form,
        semester: Number(form.semester),
      });

      setSuccess("Course created successfully");

      setForm({
        name: "",
        code: "",
        department: "",
        semester: "",
      });

      setShowForm(false);
      loadCourses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create course"
      );
    }
  };

  const filteredCourses = courses.filter((course) => {
    const value = search.toLowerCase();

    return (
      course.name?.toLowerCase().includes(value) ||
      course.code?.toLowerCase().includes(value) ||
      course.department?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="management-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">ACADEMIC MANAGEMENT</p>
          <h1>Courses</h1>
          <p>
            Create and manage courses available across the campus.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          + Add Course
        </button>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <span>Total Courses</span>
          <strong>{courses.length}</strong>
          <small>Available courses</small>
        </div>

        <div className="overview-card">
          <span>Departments</span>
          <strong>
            {
              new Set(
                courses
                  .map((course) => course.department)
                  .filter(Boolean)
              ).size
            }
          </strong>
          <small>Academic departments</small>
        </div>

        <div className="overview-card">
          <span>Current Status</span>
          <strong className="status-text">Active</strong>
          <small>Course management online</small>
        </div>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      {success && (
        <div className="alert success-alert">{success}</div>
      )}

      <div className="management-card">
        <div className="table-toolbar">
          <div>
            <h2>Course Directory</h2>
            <p>All registered courses in the system</p>
          </div>

          <div className="toolbar-actions">
            <input
              className="search-input"
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="secondary-button"
              onClick={loadCourses}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">C</div>
            <h3>No courses found</h3>
            <p>
              Create a new course or change your search.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="management-table">
              <thead>
                <tr>
                  <th>COURSE</th>
                  <th>CODE</th>
                  <th>DEPARTMENT</th>
                  <th>SEMESTER</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="entity-cell">
                        <div className="entity-avatar">
                          {course.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <strong>{course.name}</strong>
                          <span>Course #{course.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="code-badge">
                        {course.code}
                      </span>
                    </td>

                    <td>{course.department}</td>

                    <td>
                      Semester {course.semester}
                    </td>

                    <td>
                      <span className="active-badge">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={() => setShowForm(false)}
        >
          <div
            className="modal-card"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Add New Course</h2>
                <p>Create a new academic course.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={createCourse}>
              <div className="form-group">
                <label>Course Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Bachelor of Technology - CSE"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Course Code</label>

                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="BTECH-CSE"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Semester</label>

                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select
                    </option>

                    {[1, 2, 3, 4, 5, 6, 7, 8].map(
                      (semester) => (
                        <option
                          key={semester}
                          value={semester}
                        >
                          Semester {semester}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Department</label>

                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Computer Science and Engineering"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;