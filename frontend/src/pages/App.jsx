import { Routes, Route } from "react-router-dom";
import { useAuthInit } from "../hooks/useAuthInit";
import Home from "./Home";
import Programs from "./Programs";
import ProgramDetail from "./ProgramDetail";
import NotFound from "./NotFound";
import Forbidden from "./Forbidden";
import Unauthorized from "./Unauthorized";
import ServerError from "./ServerError";
import ServiceUnavailable from "./ServiceUnavailable";
import AdminLogin from "./admin/Login";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import "../styles/App.css";

function App() {
  // Initialize auth state dari localStorage
  useAuthInit();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/program" element={<Programs />} />
      <Route path="/program/:id" element={<ProgramDetail />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes - Uncomment saat sudah ada Dashboard */}
      {/* <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      /> */}

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
