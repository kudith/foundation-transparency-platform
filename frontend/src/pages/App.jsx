import { Routes, Route } from "react-router-dom";
import { useAuthInit } from "../hooks/useAuthInit";
import Home from "./Home";
import About from "./About";
import Programs from "./Programs";
import ProgramDetail from "./ProgramDetail";
import Contact from "./Contact";
import PublicReports from "./PublicReports";
import NotFound from "./NotFound";
import Forbidden from "./Forbidden";
import Unauthorized from "./Unauthorized";
import ServerError from "./ServerError";
import ServiceUnavailable from "./ServiceUnavailable";
import AdminLogin from "./admin/Login";
import AdminLayout from "../components/admin/layout/AdminLayout";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import "../styles/App.css";

function App() {
  // Initialize auth state dari localStorage
  useAuthInit();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tentang" element={<About />} />
      <Route path="/program" element={<Programs />} />
      <Route path="/program/:id" element={<ProgramDetail />} />
      <Route path="/kontak" element={<Contact />} />
      <Route path="/laporan" element={<PublicReports />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* Error Pages */}
      <Route path="/401" element={<Unauthorized />} />
      <Route path="/403" element={<Forbidden />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="/503" element={<ServiceUnavailable />} />

      {/* 404 - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
