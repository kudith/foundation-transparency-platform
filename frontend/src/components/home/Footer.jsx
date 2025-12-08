import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Heart, Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-foreground text-background">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 lg:px-6">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-12 mb-12">
          {/* Brand Section - Larger */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-background mb-3">
                SITRA-V
              </h3>
              <p className="font-serif text-xs uppercase tracking-[0.3em] text-secondary/55 mb-4">
                Sistem Informasi Transparansi Veritas
              </p>
              <p className="font-serif text-sm leading-relaxed text-background/80 max-w-md">
                Platform transparansi digital Yayasan Veritas Pelita Nusantara 
                yang menyajikan informasi lengkap dan terbuka tentang program, 
                keuangan, serta kegiatan yayasan untuk membangun kepercayaan publik.
              </p>
            </div>

            {/* Communities Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/10 rounded-full border border-background/20">
                <Heart className="h-4 w-4 text-red-400" />
                <span className="font-serif text-xs text-background/90 font-semibold">
                  CORDIS LINGUA
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/10 rounded-full border border-background/20">
                <Code className="h-4 w-4 text-blue-400" />
                <span className="font-serif text-xs text-background/90 font-semibold">
                  NOSTRACODE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-base text-background mb-4">
              Navigasi
            </h4>
            <ul className="space-y-3 font-serif text-sm">
              <li>
                <Link
                  to="/"
                  className="text-background/70 hover:text-primary transition-colors duration-200 inline-block"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/tentang"
                  className="text-background/70 hover:text-primary transition-colors duration-200 inline-block"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/program"
                  className="text-background/70 hover:text-primary transition-colors duration-200 inline-block"
                >
                  Program
                </Link>
              </li>
              <li>
                <Link
                  to="/laporan"
                  className="text-background/70 hover:text-primary transition-colors duration-200 inline-block"
                >
                  Laporan
                </Link>
              </li>
              <li>
                <Link
                  to="/kontak"
                  className="text-background/70 hover:text-primary transition-colors duration-200 inline-block"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Communities Section */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-base text-background mb-4">
              Komunitas
            </h4>
            <ul className="space-y-3 font-serif text-sm">
              <li>
                <span className="text-background/70">CORDIS LINGUA</span>
                <p className="text-xs text-background/50 mt-1">
                  Belajar Bahasa Inggris
                </p>
              </li>
              <li>
                <span className="text-background/70">NOSTRACODE</span>
                <p className="text-xs text-background/50 mt-1">
                  Belajar Coding
                </p>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3">
            <h4 className="font-serif font-semibold text-base text-background mb-4">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 font-serif text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin className="h-4 w-4 text-secondary/55 mt-0.5 flex-shrink-0" />
                <span className="text-background/70 leading-relaxed">
                  Jalan Bebedahan II No.48
                  <br />
                  Tasikmalaya, Jawa Barat
                  <br />
                  Indonesia 46111
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="h-4 w-4 text-secondary/55 flex-shrink-0" />
                <a
                  href="mailto:info@veritas.or.id"
                  className="text-background/70 hover:text-primary transition-colors duration-200"
                >
                  info@veritas.or.id
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="h-4 w-4 text-secondary/55 flex-shrink-0" />
                <a
                  href="tel:+6285176987693"
                  className="text-background/70 hover:text-primary transition-colors duration-200"
                >
                  +62 851-7698-7693
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Instagram className="h-4 w-4 text-secondary/55 flex-shrink-0" />
                <a
                  href="https://instagram.com/veritas.pelita.nusantara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-primary transition-colors duration-200"
                >
                  @veritas.pelita.nusantara
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-serif text-sm text-background/60 text-center md:text-left">
              © 2025 Yayasan Veritas Pelita Nusantara. Hak Cipta Dilindungi.
            </p>
            <div className="flex gap-6 font-serif text-xs text-background/60">
              <Link
                to="/tentang"
                className="hover:text-secondary transition-colors duration-200"
              >
                Legalitas
              </Link>
              <Link
                to="/laporan"
                className="hover:text-secondary transition-colors duration-200"
              >
                Transparansi
              </Link>
              <span className="text-background/40">
                AHU-0002002.AH.01.04.Tahun 2025
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-6 text-center">
            <p className="font-serif text-xs italic text-background/50">
              "Transparansi untuk Kepercayaan, Akuntabilitas untuk Masa Depan"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
