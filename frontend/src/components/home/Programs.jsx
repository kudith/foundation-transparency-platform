import { useEffect } from "react";
import { useProgramStore } from "../../store/useProgramStore";
import ProgramCard from "./ProgramCard";

const Programs = () => {
  const { programs, loading, error, fetchPrograms } = useProgramStore();

  // Fetch programs on mount
  useEffect(() => {
    if (programs.length === 0) {
      fetchPrograms();
    }
  }, [fetchPrograms, programs.length]);

  // Show only first 3 programs on homepage
  const featuredPrograms = programs.slice(0, 3);

  if (loading) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center">
            <p className="font-serif text-gray-600">Memuat program...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center">
            <p className="font-serif text-red-600">
              Gagal memuat program. Silakan coba lagi.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Program Kami
          </h2>
          <p className="font-serif text-gray-600 max-w-2xl mx-auto">
            Setiap program kami dirancang dengan transparansi penuh, dari
            perencanaan hingga pelaporan dampak.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredPrograms.map((program) => (
            <ProgramCard key={program.id} {...program} />
          ))}
        </div>

        {programs.length > 3 && (
          <div className="text-center mt-12">
            <a
              href="/program"
              className="inline-block font-serif font-semibold px-8 py-3 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-100 transition-colors"
            >
              Lihat Semua Program
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;
