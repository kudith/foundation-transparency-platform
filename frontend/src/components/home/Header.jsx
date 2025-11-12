import { Link } from "react-router-dom";

const navLinks = [
  { to: "/tentang", label: "Tentang Kami" },
  { to: "/program", label: "Program" },
  { to: "/kontak", label: "Kontak" },
];

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="font-serif font-bold text-xl text-gray-900">
            Veritas Pelita Nusantara
          </Link>

          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                {" "}
                <Link
                  to={link.to}
                  className="font-serif text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
