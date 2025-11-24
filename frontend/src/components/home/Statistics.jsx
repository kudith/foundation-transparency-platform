import { useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useProgramStore } from "@/store/useProgramStore";

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
      description: "Inisiatif transparansi yang dijalankan sepanjang tahun ini.",
    },
    {
      label: "Program Aktif",
      value: statistics.activePrograms,
      description: "Program yang sedang berjalan dan menerima monitoring rutin.",
    },
    {
      label: "Total Anggaran",
      value: `Rp ${(statistics.totalBudget / 1_000_000_000).toFixed(1)}M`,
      description: "Nilai akumulasi dana yang telah dialokasikan untuk program.",
    },
    {
      label: "Penerima Manfaat",
      value: statistics.totalBeneficiaries.toLocaleString("id-ID"),
      description: "Individu dan komunitas yang merasakan dampak nyata.",
    },
  ];

  return (
    <section className="bg-foreground/95 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-12 max-w-3xl text-center md:mx-auto">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-primary/80">
            Dampak Kami
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-background md:text-4xl">
            Data yang Menjaga Kepercayaan Publik
          </h2>
          <p className="mt-4 font-serif text-base text-background/70">
            Setiap angka adalah representasi dari komitmen kami menjaga akuntabilitas dan transparansi kepada para pemangku kepentingan.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-border/40 bg-background/95 text-foreground"
            >
              <CardHeader>
                <CardTitle className="font-serif text-3xl font-semibold text-foreground">
                  {stat.value}
                </CardTitle>
                <CardDescription className="font-serif text-sm uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-serif text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
