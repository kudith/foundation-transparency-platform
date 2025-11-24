import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import PropTypes from "prop-types";
import { useAuthStore } from "../../../store/useAuthStore";
import { cn } from "../../../lib/utils";
import { navigationItems } from "./navigationConfig";

const Sidebar = ({ className }) => {
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform shadow-xl",
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/" className="flex items-center">
            <h2 className="font-serif font-bold text-lg text-foreground">
              Veritas Admin
            </h2>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    title={item.description}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-border px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
