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
      description: "Kegiatan pemberdayaan yang telah kami selenggarakan.",
    },
    {
      label: "Program Aktif",
      value: statistics.activePrograms,
      description: "Program yang sedang berjalan untuk memberdayakan komunitas.",
    },
    {
      label: "Total Anggaran",
      value: `Rp ${(statistics.totalBudget / 1_000_000_000).toFixed(1)}M`,
      description: "Dana yang dialokasikan untuk pengembangan komunitas.",
    },
    {
      label: "Penerima Manfaat",
      value: statistics.totalBeneficiaries.toLocaleString("id-ID"),
      description: "Individu yang telah bergabung dan berkembang bersama kami.",
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
            Pertumbuhan Melalui Pemberdayaan Berkelanjutan
          </h2>
          <p className="mt-4 font-serif text-base text-background/70">
            Setiap angka mencerminkan perjalanan individu yang kami rangkul, bimbing, 
            dan lengkapi untuk mencapai potensi terbaik mereka.
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
