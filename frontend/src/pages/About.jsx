import { Link } from "react-router-dom";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Heart,
  Code,
  Mail,
  Phone,
  MapPin,
  Instagram,
  FileText,
  Shield,
  Award,
  Globe,
} from "lucide-react";

const missions = [
  {
    text: "Menjadi pelopor dalam mengidentifikasi dan membuka jalan bagi komunitas pemberdayaan inovatif yang berbasis pada kejujuran sebagai fondasi komunitasnya.",
  },
  {
    text: "Mencerahkan dan membimbing individu dan komunitas yang baru bergabung, dengan memberikan dukungan dan sumber daya yang diperlukan untuk pertumbuhan dan kemandirian mereka.",
  },
  {
    text: "Bersinergi untuk membangun fondasi komunitas yang kuat dan berkembang guna memperluas dampak positif di seluruh nusantara.",
  },
  {
    text: "Menjunjung tinggi nilai-nilai kebenaran, integritas, dan transparansi dalam setiap aspek operasional yayasan.",
  },
];

const legalities = [
  {
    icon: Shield,
    title: "Sertifikat dari Kementerian Hukum",
    description:
      "Disahkan melalui keputusan Menteri Hukum Republik Indonesia dengan nomor pengesahan AHU-0002002.AH.01.04.Tahun 2025.",
    date: "10 Februari 2025",
    number: "AHU-0003398.AH.01.12.Tahun 2025",
  },
  {
    icon: FileText,
    title: "Akta Notaris",
    description:
      "Dokumen resmi yang disusun oleh notaris yang berisi informasi rinci tentang Yayasan Veritas Pelita Nusantara, termasuk pedoman operasional yayasan.",
  },
  {
    icon: Award,
    title: "Nomor Pokok Wajib Pajak (NPWP)",
    description:
      "Nomor identifikasi yang diberikan oleh Direktorat Jenderal Pajak kepada Veritas Pelita Nusantara sebagai wajib pajak di Indonesia.",
  },
  {
    icon: Globe,
    title: "Goodstack dan TechSoup",
    description:
      "Veritas telah berhasil memperoleh verifikasi dari dua lembaga internasional terkemuka: Goodstack dan TechSoup sebagai lembaga nirlaba di Indonesia.",
  },
];

const communities = [
  {
    name: "CORDIS LINGUA",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    description:
      'Komunitas belajar bahasa Inggris yang diambil dari bahasa Latin, dimana "Cordis" berarti "Hati/Jiwa" dan "Lingua" berarti "Bahasa". Nama ini melambangkan pendekatan pembelajaran yang hangat dan komunikatif dalam mempelajari bahasa berbasis dari hati.',
    purpose:
      "Ruang bagi para pembelajar untuk meningkatkan kemampuan bahasa Inggris mereka secara alami dan percaya diri melalui praktik bersama dalam suasana yang mendukung.",
  },
  {
    name: "NOSTRACODE",
    icon: Code,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description:
      'Komunitas belajar coding yang namanya berasal dari bahasa Latin, dimana "Nostra" berarti "Milik Kami", dan "Code" mengacu pada kode pemrograman. Filosofinya menekankan bahwa setiap orang memiliki hak untuk memiliki dan memahami kode yang benar-benar milik mereka.',
    purpose:
      "Ruang untuk pengembangan diri di bidang teknologi, dengan dukungan komunitas yang saling menginspirasi.",
  },
];

const About = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center md:px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-primary/80">
              Tentang Kami
            </p>
            <h1 className="mt-6 font-serif text-4xl font-bold text-foreground md:text-5xl">
              YAYASAN VERITAS PELITA NUSANTARA
            </h1>
            <p className="mt-8 font-serif text-lg text-muted-foreground md:text-xl leading-relaxed">
              <span className="font-semibold text-foreground">"Veritas"</span>{" "}
              adalah kata yang berasal dari Bahasa Latin, mencerminkan komitmen
              yayasan terhadap prinsip-prinsip fundamental yang kuat. Sementara{" "}
              <span className="font-semibold text-foreground">
                "Pelita Nusantara"
              </span>{" "}
              berarti gambaran terang yang menerangi nusantara, menandakan
              dedikasi yayasan terhadap kemajuan dan pencerahan bangsa secara
              keseluruhan.
            </p>
            <p className="mt-6 font-serif text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Logo Veritas Pelita Nusantara memiliki elemen daun yang sebagian
              merangkul, sebagian menonjol, melambangkan peran pelopor yang
              membuka jalan dan menjadi sumber inspirasi bagi mereka yang baru
              memulai perjalanan mereka.
            </p>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="border-y border-border bg-muted/20 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Visi dan Misi
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Vision */}
              <Card className="border-border/70 bg-background/95">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    Visi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-serif text-base text-foreground leading-relaxed">
                    Merangkul, membimbing, dan melengkapi setiap individu dalam
                    masyarakat dan komunitas yang terlibat dalam membentuk
                    orang-orang dengan jiwa yang siap berjuang untuk hidup dan
                    impian mereka.
                  </p>
                </CardContent>
              </Card>

              {/* Mission */}
              <Card className="border-border/70 bg-background/95">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    Misi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {missions.map((mission, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 font-serif text-sm text-foreground leading-relaxed"
                      >
                        <span className="mt-0.5 text-primary shrink-0">▌</span>
                        <span>{mission.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Legality Section */}
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Legalitas
              </h2>
              <p className="mt-4 font-serif text-base text-muted-foreground">
                Pengakuan dan sertifikasi resmi
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {legalities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={index}
                    className="border-border/70 bg-background/95"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="font-serif text-lg text-foreground">
                            {item.title}
                          </CardTitle>
                          {item.date && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {item.date}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="font-serif text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </CardDescription>
                      {item.number && (
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground mb-1">
                            Nomor Registrasi:
                          </p>
                          <p className="font-mono text-xs text-foreground">
                            {item.number}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Inclusive Future Section */}
        <section className="border-y border-border bg-muted/20 py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 lg:px-6 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl mb-8">
              Menciptakan Masa Depan yang Inklusif
            </h2>
            <p className="font-serif text-lg text-muted-foreground leading-relaxed">
              Veritas Pelita Nusantara adalah yayasan yang berdedikasi untuk
              menciptakan masa depan yang inklusif melalui berbagai inisiatif
              sosial dan pemberdayaan komunitas. Dengan latar belakang yang kuat
              dalam pelayanan masyarakat dan visi yang jelas untuk kesetaraan
              sosial, kami berkomitmen untuk membangun jembatan antara kebutuhan
              dan sumber daya, memastikan setiap individu memiliki kesempatan
              untuk berkembang mencapai potensi tertinggi mereka sebagai
              manusia.
            </p>
            <p className="mt-6 font-serif text-lg text-foreground font-semibold">
              Misi kami adalah memberdayakan komunitas masa depan dan komunitas
              yang sedang berjalan seperti CORDIS LINGUA dan NOSTRACODE.
            </p>
          </div>
        </section>

        {/* Communities Section */}
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Komunitas Kami
              </h2>
              <p className="mt-4 font-serif text-base text-muted-foreground">
                Memberdayakan individu melalui pembelajaran dan pertumbuhan
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {communities.map((community, index) => {
                const Icon = community.icon;
                return (
                  <Card
                    key={index}
                    className="border-border/70 bg-background/95"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-16 w-16 rounded-lg ${community.bgColor} flex items-center justify-center`}
                        >
                          <Icon className={`h-8 w-8 ${community.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="font-serif text-2xl text-foreground">
                            {community.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="font-serif text-base text-foreground leading-relaxed">
                        {community.description}
                      </p>
                      <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                        <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                          {community.purpose}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="border-t border-border bg-muted/20 py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 lg:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Media & Lokasi
              </h2>
              <p className="mt-4 font-serif text-base text-muted-foreground">
                Hubungi kami
              </p>
            </div>

            <Card className="border-border/70 bg-background/95">
              <CardContent className="p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Contact Info */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Instagram className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Instagram
                        </p>
                        <a
                          href="https://instagram.com/veritas.pelita.nusantara"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-serif text-foreground hover:text-primary transition-colors"
                        >
                          @veritas.pelita.nusantara
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Telepon
                        </p>
                        <a
                          href="tel:+6285176987693"
                          className="font-serif text-foreground hover:text-primary transition-colors"
                        >
                          +62 851-7698-7693
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Email
                        </p>
                        <a
                          href="mailto:info@veritas.or.id"
                          className="font-serif text-foreground hover:text-primary transition-colors"
                        >
                          info@veritas.or.id
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Alamat
                      </p>
                      <p className="font-serif text-foreground leading-relaxed">
                        Jalan Bebedahan II No.48,
                        <br />
                        Tasikmalaya, Jawa Barat
                        <br />
                        Indonesia 46111
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-3 justify-center">
                  <Button variant="default" asChild className="font-serif">
                    <Link to="/kontak">Hubungi Kami</Link>
                  </Button>
                  <Button variant="outline" asChild className="font-serif">
                    <Link to="/program">Lihat Program</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
