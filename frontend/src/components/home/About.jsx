import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const values = [
  "Transparansi dalam setiap keputusan",
  "Akuntabilitas kepada donatur dan publik",
  "Integritas dalam pengelolaan dana",
  "Dampak sosial yang terukur",
];

const About = () => {
  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-[1.1fr_0.9fr] lg:px-6">
        <div className="space-y-6">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-primary/80">
            Tentang Kami
          </p>
          <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Membangun Kepercayaan Lewat Akuntabilitas yang Konsisten
          </h2>
          <p className="font-serif text-base leading-relaxed text-muted-foreground">
            Yayasan Veritas Pelita Nusantara adalah organisasi nirlaba yang berfokus pada pemberdayaan masyarakat melalui pendidikan,
            kesehatan, dan pembangunan berkelanjutan. Kami memastikan setiap program memiliki data pendukung,
            laporan berkala, serta dokumentasi dampak yang dapat diakses publik.
          </p>
          <p className="font-serif text-base leading-relaxed text-muted-foreground">
            Dengan prinsip transparansi penuh, kami menyiapkan pelaporan terstandarisasi agar donatur dan publik dapat menilai kontribusi mereka secara real-time,
            serta memantau keberlanjutan dari setiap inisiatif.
          </p>

          <Button variant="outline" asChild className="font-serif text-sm">
            <Link to="/tentang">Pelajari Profil Yayasan</Link>
          </Button>
        </div>

        <Card className="border-border/70 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-foreground">
              Nilai Kami
            </CardTitle>
            <CardDescription className="font-serif text-sm text-muted-foreground">
              Prinsip yang menuntun kami dalam merancang, menjalankan, dan mengevaluasi seluruh program.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 font-serif text-sm text-foreground">
              {values.map((value) => (
                <li
                  key={value}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1 h-2 w-2 bg-primary" />
                  <span className="leading-relaxed text-muted-foreground">
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default About;
