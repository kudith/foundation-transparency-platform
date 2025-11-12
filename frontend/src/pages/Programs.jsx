import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProgramStore } from "../store/useProgramStore";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

const Programs = () => {
  const { programs, loading, error, fetchPrograms, setFilters, clearFilters } =
    useProgramStore();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const categories = [
    "Pendidikan",
    "Kesehatan",
    "Ekonomi",
    "Lingkungan",
    "Infrastruktur",
    "Teknologi",
  ];
  const statuses = ["Aktif", "Dalam Perencanaan"];

  const handleCategoryFilter = (category) => {
    const newCategory = activeCategory === category ? null : category;
    setActiveCategory(newCategory);
    setFilters({ category: newCategory });
  };

  const handleStatusFilter = (status) => {
    const newStatus = activeStatus === status ? null : status;
    setActiveStatus(newStatus);
    setFilters({ status: newStatus });
  };

  const handleClearFilters = () => {
    setActiveCategory(null);
    setActiveStatus(null);
    clearFilters();
  };

  const getFilteredPrograms = () => {
    let filtered = [...programs];

    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (activeStatus) {
      filtered = filtered.filter((p) => p.status === activeStatus);
    }

    return filtered;
  };

  const filteredPrograms = getFilteredPrograms();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-24 md:py-32 mt-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Program Kami
          </h1>
          <p className="font-serif text-lg text-gray-600 max-w-3xl">
            Jelajahi berbagai program sosial kami yang dirancang untuk
            memberikan dampak nyata kepada masyarakat. Setiap program
            dilaksanakan dengan transparansi penuh.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-6">
            <h3 className="font-serif text-sm font-semibold text-gray-900 mb-3">
              Filter Kategori
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`font-serif text-sm px-4 py-2 border transition-colors ${
                    activeCategory === category
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-serif text-sm font-semibold text-gray-900 mb-3">
              Filter Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`font-serif text-sm px-4 py-2 border transition-colors ${
                    activeStatus === status
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {(activeCategory || activeStatus) && (
            <button
              onClick={handleClearFilters}
              className="font-serif text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Hapus semua filter
            </button>
          )}
        </div>
      </section>

      {/* Programs Grid */}
      <section className="bg-white py-16 flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-serif text-gray-600">Memuat program...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-serif text-red-600">{error}</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-gray-600">
                Tidak ada program yang sesuai dengan filter.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="font-serif text-gray-600">
                  Menampilkan {filteredPrograms.length} program
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-serif text-xs text-gray-500 uppercase tracking-wide">
                        {program.category}
                      </span>
                      <span
                        className={`font-serif text-xs px-2 py-1 border ${
                          program.status === "Aktif"
                            ? "border-gray-900 text-gray-900"
                            : "border-gray-400 text-gray-600"
                        }`}
                      >
                        {program.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                      {program.title}
                    </h3>

                    <p className="font-serif text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {program.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between font-serif text-sm">
                        <span className="text-gray-500">Anggaran:</span>
                        <span className="text-gray-900 font-semibold">
                          {program.budget}
                        </span>
                      </div>
                      <div className="flex justify-between font-serif text-sm">
                        <span className="text-gray-500">Penerima Manfaat:</span>
                        <span className="text-gray-900 font-semibold">
                          {program.beneficiaries}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/programs/${program.id}`}
                      className="inline-block font-serif text-sm text-gray-900 border-b border-gray-900 hover:text-gray-600 hover:border-gray-600 transition-colors"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;
