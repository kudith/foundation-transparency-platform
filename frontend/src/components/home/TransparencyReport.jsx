import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const metrics = [
  {
    label: "Komunitas Aktif",
    value: "2",
    description: "CORDIS LINGUA dan NOSTRACODE yang memberdayakan individu.",
  },
  {
    label: "Legalitas",
    value: "Resmi",
    description: "Disahkan oleh Kemenkumham dan terverifikasi internasional.",
  },
  {
    label: "Transparansi",
    value: "100%",
    description: "Laporan keuangan dan dampak program terbuka untuk publik.",
  },
  {
    label: "Fokus",
    value: "Pendidikan",
    description: "Bahasa Inggris dan teknologi untuk masa depan yang lebih cerah.",
  },
];

const TransparencyReport = () => {
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
            Sebagai yayasan yang menjunjung tinggi nilai <span className="font-semibold text-foreground">Veritas</span> (kebenaran), 
            kami berkomitmen untuk transparansi penuh dalam setiap aspek operasional. Dari legalitas hingga 
            pelaporan program, semua informasi tersedia untuk publik.
          </p>
          <Button variant="outline" asChild className="font-serif text-sm">
            <Link to="/laporan">Lihat Laporan & Legalitas</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border-border/70 bg-background/95">
              <CardHeader className="space-y-2">
                <CardTitle className="font-serif text-2xl text-foreground">
                  {metric.value}
                </CardTitle>
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

