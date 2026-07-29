import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "./Management.css";
import "./Attendance.css";

function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [course, setCourse] = useState("all");

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attendance");
      setRecords(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const totalRecords = records.length;

  const presentRecords = records.filter(
    (record) => record.present
  ).length;

  const absentRecords = records.filter(
    (record) => !record.present
  ).length;

  const attendancePercentage =
    totalRecords === 0
      ? 0
      : Math.round((presentRecords / totalRecords) * 100);

  const courses = useMemo(() => {
    const uniqueCourses = new Map();

    records.forEach((record) => {
      if (record.course) {
        uniqueCourses.set(record.course.id, record.course);
      }
    });

    return Array.from(uniqueCourses.values());
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.student?.name?.toLowerCase().includes(query) ||
        record.student?.rollNumber?.toLowerCase().includes(query) ||
        record.student?.user?.email?.toLowerCase().includes(query) ||
        record.course?.name?.toLowerCase().includes(query) ||
        record.course?.code?.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" ||
        (status === "present" && record.present) ||
        (status === "absent" && !record.present);

      const matchesCourse =
        course === "all" ||
        String(record.course?.id) === course;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [records, search, status, course]);

  return (
    <div className="management-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">ATTENDANCE MANAGEMENT</p>
          <h1>Attendance</h1>
          <p>
            Monitor student attendance and academic participation.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadAttendance}
        >
          Refresh Data
        </button>
      </div>

      <div className="attendance-overview-grid">
        <div className="attendance-stat-card">
          <div className="attendance-stat-top">
            <span>Total Records</span>
            <div className="attendance-stat-icon">AT</div>
          </div>

          <strong>{loading ? "..." : totalRecords}</strong>
          <small>Attendance entries recorded</small>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-top">
            <span>Present</span>
            <div className="attendance-stat-icon present-icon">P</div>
          </div>

          <strong>{loading ? "..." : presentRecords}</strong>
          <small>Present attendance records</small>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-top">
            <span>Absent</span>
            <div className="attendance-stat-icon absent-icon">A</div>
          </div>

          <strong>{loading ? "..." : absentRecords}</strong>
          <small>Absent attendance records</small>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-top">
            <span>Attendance Rate</span>
            <div className="attendance-stat-icon percentage-icon">
              %
            </div>
          </div>

          <strong>
            {loading ? "..." : `${attendancePercentage}%`}
          </strong>
          <small>Overall attendance percentage</small>
        </div>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <div className="attendance-progress-card">
        <div className="attendance-progress-heading">
          <div>
            <h2>Overall Attendance</h2>
            <p>
              Campus-wide attendance based on recorded entries
            </p>
          </div>

          <strong>{attendancePercentage}%</strong>
        </div>

        <div className="attendance-progress-track">
          <div
            className="attendance-progress-value"
            style={{
              width: `${attendancePercentage}%`,
            }}
          />
        </div>

        <div className="attendance-progress-footer">
          <span>{presentRecords} Present</span>
          <span>{absentRecords} Absent</span>
        </div>
      </div>

      <div className="management-card">
        <div className="table-toolbar">
          <div>
            <h2>Attendance Records</h2>
            <p>
              {filteredRecords.length} record
              {filteredRecords.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="attendance-toolbar">
            <input
              className="search-input"
              type="text"
              placeholder="Search student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="attendance-filter"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="all">All Courses</option>

              {courses.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.code}
                </option>
              ))}
            </select>

            <select
              className="attendance-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading attendance...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">AT</div>
            <h3>No attendance records found</h3>
            <p>
              No records match the selected filters.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="management-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>ROLL NUMBER</th>
                  <th>COURSE</th>
                  <th>SEMESTER</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="entity-cell">
                        <div className="attendance-avatar">
                          {record.student?.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {record.student?.name}
                          </strong>

                          <span>
                            {record.student?.user?.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="code-badge">
                        {record.student?.rollNumber}
                      </span>
                    </td>

                    <td>
                      <div className="attendance-course">
                        <strong>
                          {record.course?.name}
                        </strong>
                        <span>
                          {record.course?.code}
                        </span>
                      </div>
                    </td>

                    <td>
                      Semester {record.course?.semester}
                    </td>

                    <td>
                      {record.date}
                    </td>

                    <td>
                      <span
                        className={
                          record.present
                            ? "attendance-present-badge"
                            : "attendance-absent-badge"
                        }
                      >
                        {record.present
                          ? "Present"
                          : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;