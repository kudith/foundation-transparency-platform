import { Home, Calendar, Users, DollarSign, FileText, BarChart3, UserCircle, ShieldCheck } from "lucide-react";

/**
 * Navigation configuration - mudah untuk menambah menu baru
 * 
 * Cara menambah menu baru:
 * 1. Tambahkan object baru di array ini dengan properties:
 *    - title: Nama menu yang akan muncul di sidebar dan breadcrumb
 *    - href: URL path (harus diawali dengan /admin/)
 *    - icon: Import icon dari lucide-react
 *    - description: Tooltip description (optional)
 *    - roles: Array of roles that can see this menu (optional, default: all roles)
 * 
 * 2. Import icon yang dibutuhkan dari lucide-react di bagian atas
 * 
 * 3. Tambahkan route di AdminLayout.jsx:
 *    <Route path="/nama-path" element={<ComponentPage />} />
 * 
 * Breadcrumb akan otomatis ter-generate berdasarkan config ini!
 */
export const navigationItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: Home,
    description: "Dashboard utama"
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
    description: "Kelola acara dan kegiatan"
  },
  {
    title: "Attendance",
    href: "/admin/attendance",
    icon: Users,
    description: "Kelola kehadiran"
  },
  {
    title: "Donations",
    href: "/admin/donations",
    icon: DollarSign,
    description: "Kelola donasi"
  },
  {
    title: "Expenses",
    href: "/admin/expenses",
    icon: FileText,
    description: "Kelola pengeluaran"
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
    description: "Laporan dan analitik"
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UserCircle,
    description: "Kelola users dan anggota"
  },
  {
    title: "Admin",
    href: "/admin/admins",
    icon: ShieldCheck,
    description: "Kelola akun admin",
    roles: ["super_admin"] // Only super_admin can see this menu
  },
];




