import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllEvents } from "@/services/eventService";
import { getAllUsers } from "@/services/userService";
import { getAllReports } from "@/services/reportService";

const TransparencyReport = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([
    {
      label: "Komunitas Aktif",
      value: "0",
      description: "CORDIS LINGUA dan NOSTRACODE yang memberdayakan individu.",
    },
    {
      label: "Total Program",
      value: "0",
      description: "Kegiatan pemberdayaan yang telah kami selenggarakan.",
    },
    {
      label: "Total Peserta",
      value: "0",
      description: "Individu yang telah bergabung dan berkembang bersama kami.",
    },
    {
      label: "Laporan Publik",
      value: "0",
      description: "Laporan keuangan dan dampak program terbuka untuk publik.",
    },
  ]);

  useEffect(() => {
    fetchTransparencyData();
  }, []);

  const fetchTransparencyData = async () => {
    setLoading(true);

    try {
      const [eventsResult, usersResult, reportsResult] = await Promise.all([
        getAllEvents(),
        getAllUsers(),
        getAllReports(),
      ]);

      let communities = 0;
      let totalEvents = 0;
      let totalUsers = 0;
      let totalReports = 0;

      // Count unique communities from events
      if (eventsResult.success && eventsResult.data.length > 0) {
        const uniqueCommunities = new Set(
          eventsResult.data
            .map((e) => e.community || e.communityName)
            .filter(Boolean)
        );
        communities = uniqueCommunities.size;
        totalEvents = eventsResult.data.length;
      }

      // Count total users/participants
      if (usersResult.success) {
        totalUsers = usersResult.data.length;
      }

      // Count completed public reports
      if (reportsResult.success && reportsResult.data) {
        const completedReports = reportsResult.data.filter(
          (report) => report.status === "completed" && report.fileURL
        );
        totalReports = completedReports.length;
      }

      setMetrics([
        {
          label: "Komunitas Aktif",
          value: communities.toString(),
          description:
            communities > 0
              ? "Komunitas yang aktif memberdayakan individu."
              : "CORDIS LINGUA dan NOSTRACODE yang memberdayakan individu.",
        },
        {
          label: "Total Program",
          value: totalEvents.toString(),
          description: "Kegiatan pemberdayaan yang telah kami selenggarakan.",
        },
        {
          label: "Total Peserta",
          value: totalUsers.toLocaleString("id-ID"),
          description:
            "Individu yang telah bergabung dan berkembang bersama kami.",
        },
        {
          label: "Laporan Publik",
          value: totalReports.toString(),
          description:
            "Laporan keuangan dan dampak program terbuka untuk publik.",
        },
      ]);
    } catch (error) {
      console.error("Error fetching transparency data:", error);
    }

    setLoading(false);
  };

  return (
    <section className="bg-muted/20 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr] lg:px-6">
        <div className="space-y-6">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-primary/80">
            Transparansi & Akuntabilitas
          </p>
          <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Komitmen Kami Terhadap Keterbukaan
          </h2>
          <p className="font-serif text-base leading-relaxed text-muted-foreground">
            SITRA-V (Sistem Informasi Transparansi Veritas) adalah platform
            digital yang menunjukkan komitmen kami terhadap{" "}
            <span className="font-semibold text-foreground">transparansi</span>{" "}
            dan{" "}
            <span className="font-semibold text-foreground">akuntabilitas</span>{" "}
            penuh. Semua informasi program, keuangan, dan kegiatan yayasan
            tersedia secara terbuka untuk membangun kepercayaan publik.
          </p>
          <Button variant="outline" asChild className="font-serif text-sm">
            <Link to="/laporan">Lihat Laporan & Legalitas</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <Card
              key={metric.label}
              className="border-border/70 bg-background/95"
            >
              <CardHeader className="space-y-2">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <CardTitle className="font-serif text-2xl text-foreground">
                    {metric.value}
                  </CardTitle>
                )}
                <CardDescription className="font-serif text-sm uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransparencyReport;
