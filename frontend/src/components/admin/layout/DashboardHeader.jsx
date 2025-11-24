import { Menu, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthStore } from "../../../store/useAuthStore";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { navigationItems } from "./navigationConfig";

const DashboardHeader = ({ onMenuToggle }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  // Generate breadcrumb otomatis berdasarkan route
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [];

    // Jika di root admin, redirect ke dashboard
    if (pathnames.length === 1 && pathnames[0] === "admin") {
      return [
        {
          label: "Dashboard",
          href: "/admin/dashboard",
          isLast: true,
        },
      ];
    }

    // Generate breadcrumbs berdasarkan path
    pathnames.forEach((segment, index) => {
      const href = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLast = index === pathnames.length - 1;

      // Skip "admin" segment di breadcrumb
      if (segment === "admin") {
        return;
      }

      // Cari di navigationItems untuk mendapatkan label yang tepat
      const navItem = navigationItems.find((item) => item.href === href);

      if (navItem) {
        breadcrumbs.push({
          label: navItem.title,
          href: navItem.href,
          isLast,
        });
      } else {
        // Handle dynamic routes (dengan ID)
        // Skip segment yang terlihat seperti MongoDB ID
        const isMongoId = /^[a-f\d]{24}$/i.test(segment);

        if (isMongoId) {
          // Skip MongoDB IDs in breadcrumb
          return;
        }

        // Handle special segments
        if (segment === "new") {
          breadcrumbs.push({
            label: "Tambah Baru",
            href,
            isLast,
          });
        } else if (segment === "edit") {
          breadcrumbs.push({
            label: "Edit",
            href,
            isLast,
          });
        } else {
          // Fallback: capitalize segment
          const label = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          breadcrumbs.push({
            label,
            href,
            isLast,
          });
        }
      }
    });

    // Handle detail view - jika ada ID yang di-skip, tambahkan "Detail"
    const hasId = pathnames.some((segment) => /^[a-f\d]{24}$/i.test(segment));
    const lastSegment = pathnames[pathnames.length - 1];
    const isEditOrNew = lastSegment === "edit" || lastSegment === "new";

    if (hasId && !isEditOrNew && breadcrumbs.length > 0) {
      // Add "Detail" for detail views
      breadcrumbs.push({
        label: "Detail",
        href: location.pathname,
        isLast: true,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Breadcrumb - Dinamis otomatis */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="font-semibold text-foreground">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          to={crumb.href}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!crumb.isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground">
                {user?.email || ""}
              </p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

DashboardHeader.propTypes = {
  onMenuToggle: PropTypes.func.isRequired,
};

export default DashboardHeader;
