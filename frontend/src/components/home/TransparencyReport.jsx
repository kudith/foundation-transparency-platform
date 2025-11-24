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
    label: "Anggaran Terealisasi",
    value: "92%",
    description: "Persentase belanja dari total komitmen keuangan tahun berjalan.",
  },
  {
    label: "Program Aktif",
    value: "38",
    description: "Inisiatif yang saat ini berjalan dan menerima evaluasi berkala.",
  },
  {
    label: "Penerima Manfaat",
    value: "58.200+",
    description: "Individu dan komunitas yang telah menerima dampak secara langsung.",
  },
  {
    label: "Rasio Operasional",
    value: "14%",
    description: "Porsi biaya operasional terhadap total anggaran transparansi.",
  },
];

const TransparencyReport = () => {
  return (
    <section className="bg-muted/20 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr] lg:px-6">
        <div className="space-y-6">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-primary/80">
            Laporan Transparansi
          </p>
          <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Ringkasan Kinerja dan Akuntabilitas 2025
          </h2>
          <p className="font-serif text-base leading-relaxed text-muted-foreground">
            Kami menyajikan laporan terperinci mengenai alokasi anggaran, capaian program,
            dan hasil audit independen. Setiap data dapat diunduh dan diverifikasi secara terbuka
            untuk memastikan kepercayaan publik terhadap yayasan.
          </p>
          <Button variant="outline" asChild className="font-serif text-sm">
            <Link to="/laporan">Unduh Laporan Lengkap</Link>
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

