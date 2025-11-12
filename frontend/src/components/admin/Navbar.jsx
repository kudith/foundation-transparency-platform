import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/admin/login");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            className="font-serif font-bold text-xl text-gray-900"
          >
            Veritas Admin
          </Link>

          <div className="flex items-center gap-4">
            <span className="font-serif text-sm text-gray-600">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="font-serif text-sm px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
