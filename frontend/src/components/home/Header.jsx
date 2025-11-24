import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/tentang", label: "Tentang Kami" },
  { to: "/program", label: "Program" },
  { to: "/kontak", label: "Kontak" },
];

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleNavigate = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="font-serif text-lg font-semibold text-foreground transition-colors hover:text-foreground/80"
        >
          Veritas Pelita Nusantara
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.to}
              variant="ghost"
              asChild
              className={cn(
                "border-b border-transparent px-3 py-2 font-serif text-sm font-medium text-muted-foreground hover:border-foreground/40 hover:bg-transparent hover:text-foreground",
                isActive(link.to) && "border-foreground/70 text-foreground"
              )}
            >
              <Link to={link.to}>{link.label}</Link>
            </Button>
          ))}

          <Button
            variant="outline"
            asChild
            className="ml-4 font-serif text-sm"
          >
            <Link to="/kontak">Hubungi Kami</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="absolute inset-x-4 top-[calc(100%+0.75rem)] border border-border bg-background/95 p-2 shadow-lg md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  variant="ghost"
                  asChild
                  className={cn(
                    "justify-start font-serif text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isActive(link.to) && "text-foreground"
                  )}
                  onClick={handleNavigate}
                >
                  <Link to={link.to}>{link.label}</Link>
                </Button>
              ))}

              <Button
                variant="outline"
                asChild
                className="justify-start font-serif text-sm"
                onClick={handleNavigate}
              >
                <Link to="/kontak">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
