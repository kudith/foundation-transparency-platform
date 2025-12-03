import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import apiClient from "@/config/api";

const contactChannels = [
  {
    title: "Hubungi Tim Transparansi",
    description:
      "Tim kami siap membantu permintaan data, verifikasi laporan, dan koordinasi kolaborasi.",
    items: [
      "info@veritaspelita.org",
      "+62 21 1234 5678",
      "Senin–Jumat, 09.00–17.00 WIB",
    ],
  },
  {
    title: "Alamat Kantor",
    description:
      "Kunjungi kami untuk diskusi lebih lanjut mengenai inisiatif transparansi dan monitoring program.",
    items: [
      "Jl. Pelita Nusantara No. 18",
      "Jakarta Selatan 12540",
      "Indonesia",
    ],
  },
  {
    title: "Sarana Kolaborasi",
    description:
      "Terhubung dengan tim kami untuk peluang kemitraan, penelitian, dan program berbasis data.",
    items: ["partnership@veritaspelita.org", "research@veritaspelita.org"],
  },
];

const contactTopics = [
  "Permintaan Laporan",
  "Kemitraan Program",
  "Konfirmasi Donasi",
  "Media & Publikasi",
  "Audit & Risiko",
];

const Contact = () => {
  const [topic, setTopic] = useState(contactTopics[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const response = await apiClient.post("/contact", {
        ...formData,
        topic,
      });

      setSubmitStatus({
        type: "success",
        message: response.data.message || "Pesan berhasil dikirim!",
      });

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      setTopic(contactTopics[0]);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Gagal mengirim pesan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex flex-1 flex-col">
        <section className="mt-16 bg-background py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Hubungi Kami
            </p>
            <h1 className="mt-6 font-serif text-4xl font-semibold text-foreground md:text-6xl md:leading-[1.05]">
              Terhubung dengan Tim Transparansi Kami
            </h1>
            <p className="mt-6 font-serif text-lg text-muted-foreground md:text-xl">
              Kami siap membantu Anda mengakses laporan keuangan, memahami
              dampak program, dan menjalin kolaborasi strategis. Silakan pilih
              saluran yang sesuai atau kirim pesan melalui formulir di bawah
              ini.
            </p>
          </div>
        </section>

        <section className="border-y border-border bg-muted/20 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 lg:px-6">
            {contactChannels.map((channel) => (
              <Card
                key={channel.title}
                className="border-border/70 bg-background/95"
              >
                <CardHeader>
                  <CardTitle className="font-serif text-lg text-foreground">
                    {channel.title}
                  </CardTitle>
                  <CardDescription className="font-serif text-sm text-muted-foreground">
                    {channel.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 font-serif text-sm text-muted-foreground">
                    {channel.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 lg:px-6">
            <Card className="border-border/70 bg-background/95">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-foreground">
                  Kirim Pesan
                </CardTitle>
                <CardDescription className="font-serif text-sm text-muted-foreground">
                  Lengkapi formulir berikut dan tim kami akan menghubungi Anda
                  dalam 2x24 jam kerja.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitStatus.message && (
                  <div
                    className={cn(
                      "mb-6 p-4 text-sm font-serif border",
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-red-50 text-red-800 border-red-200"
                    )}
                  >
                    {submitStatus.message}
                  </div>
                )}
                <form
                  className="grid gap-6 font-serif text-sm text-muted-foreground"
                  onSubmit={handleSubmit}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Nama Anda"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="border border-border/70 bg-background/90 rounded-none"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="nama@organisasi.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="border border-border/70 bg-background/90 rounded-none"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="topic">Topik</Label>
                    <div className="flex flex-wrap gap-2">
                      {contactTopics.map((item) => (
                        <Button
                          key={item}
                          type="button"
                          variant="outline"
                          disabled={isSubmitting}
                          className={cn(
                            "border border-border/60 bg-background/80 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground hover:border-foreground hover:text-foreground",
                            topic === item &&
                              "border-foreground bg-foreground text-background"
                          )}
                          onClick={() => setTopic(item)}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                    <input type="hidden" name="topic" value={topic} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Pesan</Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tuliskan detail permintaan atau pertanyaan Anda"
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="border border-border/70 bg-background/90 p-3 font-serif text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-none disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
                    <span>
                      Dengan mengirim pesan, Anda menyetujui kebijakan privasi
                      Veritas Pelita Nusantara.
                    </span>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-6 font-serif text-base"
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t border-border bg-muted/20 py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center lg:px-6">
            <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Terbuka untuk Diskusi dan Kolaborasi
            </h2>
            <p className="mt-4 font-serif text-base text-muted-foreground">
              Jadwalkan pertemuan dengan tim kami untuk membahas peluang
              kerjasama, konsultasi audit, maupun pengembangan kapasitas
              organisasi Anda.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="h-12 px-6 font-serif text-base"
              >
                <a href="mailto:info@veritaspelita.org">
                  Email Tim Transparansi
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-12 px-6 font-serif text-base text-muted-foreground hover:text-foreground"
              >
                <a href="tel:+622112345678">Hubungi via Telepon</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
