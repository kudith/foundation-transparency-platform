import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import Dashboard from "../../../pages/admin/Dashboard";
import Events from "../../../pages/admin/Events";
import EventDetail from "../../../pages/admin/EventDetail";
import EventForm from "../../../pages/admin/EventForm";
import Attendances from "../../../pages/admin/Attendances";
import AttendanceDetail from "../../../pages/admin/AttendanceDetail";
import AttendanceForm from "../../../pages/admin/AttendanceForm";
import Reports from "../../../pages/admin/Reports";
import ReportGenerator from "../../../pages/admin/ReportGenerator";
import { cn } from "../../../lib/utils";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-muted/30">
      {/* Sidebar */}
      <Sidebar
        className={cn(
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden cursor-default backdrop-blur-sm"
          onClick={toggleSidebar}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              toggleSidebar();
            }
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <DashboardHeader onMenuToggle={toggleSidebar} />

        <main className="p-6 min-h-[calc(100vh-4rem)]">
          <Routes>
            {/* Redirect /admin to /admin/dashboard */}
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            {/* Dashboard pages */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Events routes */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/new" element={<EventForm />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/edit" element={<EventForm />} />

            {/* Attendance routes */}
            <Route path="/attendance" element={<Attendances />} />
            <Route path="/attendance/new" element={<AttendanceForm />} />
            <Route path="/attendance/:id" element={<AttendanceDetail />} />
            <Route path="/attendance/:id/edit" element={<AttendanceForm />} />

            {/* Reports routes */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/generate" element={<ReportGenerator />} />

            {/* Tambahkan route baru di sini dengan mudah */}
            {/* <Route path="/donations" element={<Donations />} /> */}
            {/* <Route path="/expenses" element={<Expenses />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
