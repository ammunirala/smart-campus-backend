import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import AdminLayout from "./components/AdminLayout";
import PortalLayout from "./components/PortalLayout";
import { TeacherDashboard, TeacherStudents, TeacherAttendance, TeacherProfile, StudentDashboard, StudentAttendance, StudentProfile } from "./pages/RolePortal";

function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Login />} />
    <Route path="/admin" element={<AdminLayout />}><Route index element={<AdminDashboard />} /><Route path="students" element={<Students />} /><Route path="teachers" element={<Teachers />} /><Route path="courses" element={<Courses />} /><Route path="attendance" element={<Attendance />} /></Route>
    <Route path="/teacher" element={<PortalLayout role="teacher" />}><Route index element={<TeacherDashboard />} /><Route path="students" element={<TeacherStudents />} /><Route path="attendance" element={<TeacherAttendance />} /><Route path="profile" element={<TeacherProfile />} /></Route>
    <Route path="/student" element={<PortalLayout role="student" />}><Route index element={<StudentDashboard />} /><Route path="attendance" element={<StudentAttendance />} /><Route path="profile" element={<StudentProfile />} /></Route>
  </Routes></BrowserRouter>;
}
export default App;