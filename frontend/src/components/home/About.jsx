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
  "Kebenaran dan integritas dalam setiap tindakan",
  "Transparansi dan akuntabilitas penuh",
  "Pemberdayaan melalui pendidikan berkualitas",
  "Membangun komunitas yang inklusif dan berkelanjutan",
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
            Pelita yang Menerangi Perjalanan Pembelajaran Nusantara
          </h2>
          <p className="font-serif text-base leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">"Veritas"</span> berasal dari Bahasa Latin yang berarti kebenaran, 
            mencerminkan komitmen kami terhadap integritas dan transparansi. Sementara{" "}
            <span className="font-semibold text-foreground">"Pelita Nusantara"</span> melambangkan cahaya 
            yang menerangi seluruh nusantara, menandakan dedikasi kami untuk membawa pencerahan dan kemajuan 
            kepada masyarakat Indonesia.
          </p>
          <p className="font-serif text-base leading-relaxed text-muted-foreground">
            Kami memberdayakan komunitas melalui pembelajaran bahasa Inggris di{" "}
            <span className="font-semibold text-foreground">CORDIS LINGUA</span> dan pengembangan 
            keterampilan coding di <span className="font-semibold text-foreground">NOSTRACODE</span>. 
            Bersama, kami membangun fondasi yang kuat untuk masa depan yang lebih cerah.
          </p>

          <Button variant="outline" asChild className="font-serif text-sm">
            <Link to="/tentang">Pelajari Visi & Misi Lengkap</Link>
          </Button>
        </div>

        <Card className="border-border/70 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-foreground">
              Nilai-Nilai Kami
            </CardTitle>
            <CardDescription className="font-serif text-sm text-muted-foreground">
              Prinsip fundamental yang menjadi landasan setiap program dan inisiatif kami.
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
