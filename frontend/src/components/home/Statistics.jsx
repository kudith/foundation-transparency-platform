import { useEffect } from "react";
import { useProgramStore } from "../../store/useProgramStore";

const Statistics = () => {
  const { statistics, fetchStatistics } = useProgramStore();

  useEffect(() => {
    if (!statistics) {
      fetchStatistics();
    }
  }, [statistics, fetchStatistics]);

  if (!statistics) return null;

  const stats = [
    {
      label: "Total Program",
      value: statistics.totalPrograms,
    },
    {
      label: "Program Aktif",
      value: statistics.activePrograms,
    },
    {
      label: "Total Anggaran",
      value: `Rp ${(statistics.totalBudget / 1000000000).toFixed(1)}M`,
    },
    {
      label: "Penerima Manfaat",
      value: statistics.totalBeneficiaries.toLocaleString(),
    },
  ];

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-serif text-4xl font-bold mb-2">{stat.value}</p>
              <p className="font-serif text-gray-400 text-sm uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
