import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";

import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="courses" element={<Courses />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>

        <Route
          path="/teacher"
          element={<h1>Teacher Dashboard</h1>}
        />

        <Route
          path="/student"
          element={<h1>Student Dashboard</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;