import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProgramStore } from "../store/useProgramStore";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProgram, loading, error, fetchProgramById } =
    useProgramStore();

  useEffect(() => {
    fetchProgramById(id);
  }, [id, fetchProgramById]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-32 mt-16">
          <p className="font-serif text-gray-600">Memuat detail program...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !selectedProgram) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center py-32 mt-16">
          <p className="font-serif text-red-600 mb-6">
            {error || "Program tidak ditemukan"}
          </p>
          <button
            onClick={() => navigate("/program")}
            className="font-serif text-sm text-gray-900 border-b border-gray-900 hover:text-gray-600 hover:border-gray-600"
          >
            ← Kembali ke Program
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <section className="bg-gray-50 py-6 mt-16 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center gap-2 font-serif text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">
              Beranda
            </Link>
            <span>→</span>
            <Link to="/program" className="hover:text-gray-900">
              Program
            </Link>
            <span>→</span>
            <span className="text-gray-900">{selectedProgram.title}</span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-serif text-sm text-gray-500 uppercase tracking-wide">
              {selectedProgram.category}
            </span>
            <span
              className={`font-serif text-xs px-3 py-1 border ${
                selectedProgram.status === "Aktif"
                  ? "border-gray-900 text-gray-900"
                  : "border-gray-400 text-gray-600"
              }`}
            >
              {selectedProgram.status}
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {selectedProgram.title}
          </h1>

          <p className="font-serif text-xl text-gray-600 leading-relaxed max-w-4xl">
            {selectedProgram.description}
          </p>
        </div>
      </section>

      {/* Key Information */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">
            Informasi Program
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-serif text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Anggaran & Manfaat
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-serif text-sm text-gray-500 mb-1">
                    Total Anggaran
                  </p>
                  <p className="font-serif text-2xl font-bold text-gray-900">
                    {selectedProgram.budget}
                  </p>
                </div>
                <div>
                  <p className="font-serif text-sm text-gray-500 mb-1">
                    Penerima Manfaat
                  </p>
                  <p className="font-serif text-2xl font-bold text-gray-900">
                    {selectedProgram.beneficiaries}
                  </p>
                </div>
                <div>
                  <p className="font-serif text-sm text-gray-500 mb-1">
                    Sumber Pendanaan
                  </p>
                  <p className="font-serif text-lg text-gray-900">
                    {selectedProgram.fundingSource}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-serif text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Waktu & Lokasi
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-serif text-sm text-gray-500 mb-1">
                    Tanggal Mulai
                  </p>
                  <p className="font-serif text-lg text-gray-900">
                    {new Date(selectedProgram.startDate).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-serif text-sm text-gray-500 mb-1">
                    Tanggal Selesai
                  </p>
                  <p className="font-serif text-lg text-gray-900">
                    {new Date(selectedProgram.endDate).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-serif text-sm text-gray-500 mb-1">
                    Lokasi
                  </p>
                  <p className="font-serif text-lg text-gray-900">
                    {selectedProgram.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">
            Pencapaian Program
          </h2>
          <div className="bg-gray-50 border border-gray-200 p-8">
            <ul className="space-y-4">
              {selectedProgram.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="font-serif text-gray-900 mr-3">✓</span>
                  <span className="font-serif text-gray-700 leading-relaxed">
                    {achievement}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <Link
            to="/program"
            className="inline-block font-serif text-sm text-gray-900 border-b border-gray-900 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            ← Kembali ke Semua Program
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProgramDetail;
