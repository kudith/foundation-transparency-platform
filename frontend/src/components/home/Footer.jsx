import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">
              Veritas Pelita Nusantara
            </h3>
            <p className="font-serif text-gray-400 text-sm leading-relaxed">
              Portal transparansi dan akuntabilitas untuk dampak sosial yang
              terukur dan berkelanjutan.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 font-serif text-sm">
              <li>
                <Link
                  to="/program"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Program
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 font-serif text-sm text-gray-400">
              <li>Jakarta, Indonesia</li>
              <li>info@veritaspelita.org</li>
              <li>+62 21 1234 5678</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="font-serif text-sm text-gray-400">
            © 2025 Yayasan Veritas Pelita Nusantara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
