import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getAllEvents, getEventStatus } from "@/services/eventService";
import { getDonationStats } from "@/services/donationService";

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      label: "Total Program",
      value: "0",
      description: "Kegiatan pemberdayaan yang telah kami selenggarakan.",
    },
    {
      label: "Program Aktif",
      value: "0",
      description:
        "Program yang sedang berjalan untuk memberdayakan komunitas.",
    },
    {
      label: "Total Anggaran",
      value: "Rp 0",
      description: "Dana yang dialokasikan untuk pengembangan komunitas.",
    },
  ]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);

    try {
      const [eventsResult, donationStatsResult] = await Promise.all([
        getAllEvents(),
        getDonationStats(),
      ]);

      let totalPrograms = 0;
      let activePrograms = 0;
      let totalBudget = 0;

      // Count total programs (events)
      if (eventsResult.success) {
        totalPrograms = eventsResult.data.length;

        // Count active programs (upcoming or ongoing)
        activePrograms = eventsResult.data.filter((event) => {
          const status = getEventStatus(event.date);
          return status === "upcoming" || status === "ongoing";
        }).length;
      }

      // Calculate total budget from donations
      if (donationStatsResult.success && donationStatsResult.data) {
        donationStatsResult.data.forEach((stat) => {
          totalBudget += stat.totalAmount || 0;
        });
      }

      // Format budget display
      const formatBudget = (amount) => {
        if (amount >= 1_000_000_000) {
          return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
        } else if (amount >= 1_000_000) {
          return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
        } else if (amount > 0) {
          return `Rp ${(amount / 1_000).toFixed(0)}K`;
        }
        return "Rp 0";
      };

      setStats([
        {
          label: "Total Program",
          value: totalPrograms.toString(),
          description: "Kegiatan pemberdayaan yang telah kami selenggarakan.",
        },
        {
          label: "Program Aktif",
          value: activePrograms.toString(),
          description:
            "Program yang sedang berjalan untuk memberdayakan komunitas.",
        },
        {
          label: "Total Anggaran",
          value: formatBudget(totalBudget),
          description: "Dana yang dialokasikan untuk pengembangan komunitas.",
        },
      ]);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }

    setLoading(false);
  };

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
            Setiap angka mencerminkan perjalanan individu yang kami rangkul,
            bimbing, dan lengkapi untuk mencapai potensi terbaik mereka.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-border/40 bg-background/95 text-foreground"
            >
              <CardHeader>
                {loading ? (
                  <Skeleton className="h-10 w-24 bg-muted" />
                ) : (
                  <CardTitle className="font-serif text-3xl font-semibold text-foreground">
                    {stat.value}
                  </CardTitle>
                )}
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
