import { Link, useNavigate } from "react-router-dom";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

const ErrorPage = ({ code = "404", title, message, showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-32 mt-16">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <div className="bg-white border border-gray-200 shadow-sm p-12">
            <h1 className="font-serif text-8xl md:text-9xl font-bold text-gray-900 mb-6">
              {code}
            </h1>

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>

            <p className="font-serif text-gray-600 leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="font-serif text-sm px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  ← Kembali
                </button>
              )}

              <Link
                to="/"
                className="font-serif text-sm px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorPage;
