import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
import { Spinner } from "@/components/ui/spinner";
import {
  Calendar,
  MapPin,
  User,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { getEventById } from "@/services/eventService";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getEventStatus = (dateString) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate < today) {
    return { label: "Selesai", color: "bg-muted text-muted-foreground" };
  } else if (eventDate.toDateString() === today.toDateString()) {
    return { label: "Hari Ini", color: "bg-primary text-primary-foreground" };
  } else {
    return { label: "Akan Datang", color: "bg-blue-500 text-white" };
  }
};

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);

    const result = await getEventById(id);

    if (result.success) {
      setEvent(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="mt-16 flex flex-1 items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-6 text-primary" />
            <p className="font-serif text-sm text-muted-foreground">
              Memuat detail program...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="mt-16 flex flex-1 flex-col items-center justify-center px-4">
          <Card className="max-w-md border-destructive/40 bg-destructive/10 text-center">
            <CardHeader>
              <CardTitle className="font-serif text-foreground">
                Tidak Dapat Menampilkan Program
              </CardTitle>
              <CardDescription className="font-serif text-sm text-destructive">
                {error || "Program tidak ditemukan atau telah dihapus."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="font-serif text-sm"
                onClick={() => navigate("/program")}
              >
                Kembali ke Daftar Program
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const status = getEventStatus(event.date);
  const images = event.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="relative bg-background px-4 pt-24 pb-16 md:px-6">
          <div className="mx-auto max-w-6xl">
            {/* Breadcrumb & Status */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                to="/program"
                className="font-serif text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Kembali ke Program
              </Link>
              <Badge className={status.color}>{status.label}</Badge>
              <Badge variant="outline" className="font-serif">
                {event.community || event.communityName}
              </Badge>
            </div>

            {/* Title & Description */}
            <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl mb-6">
              {event.name}
            </h1>

            {event.description && (
              <p className="font-serif text-lg text-muted-foreground max-w-3xl mb-8">
                {event.description}
              </p>
            )}

            {/* Quick Info Grid */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Tanggal
                  </p>
                  <p className="font-serif text-sm font-medium">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      Lokasi
                    </p>
                    <p className="font-serif text-sm font-medium">
                      {event.location}
                    </p>
                  </div>
                </div>
              )}

              {event.tutor && (
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
                  <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      Tutor / Pembicara
                    </p>
                    <p className="font-serif text-sm font-medium">
                      {event.tutor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.tutor.type}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        {hasImages && (
          <section className="border-y border-border bg-muted/20 py-16">
            <div className="mx-auto max-w-6xl px-4 lg:px-6">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  Galeri
                </h2>
                <p className="font-serif text-sm text-muted-foreground mt-2">
                  Dokumentasi kegiatan program
                </p>
              </div>

              {/* Main Image */}
              <div className="mb-4">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <img
                    src={images[selectedImage].url}
                    alt={`${event.name} - ${selectedImage + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={img.publicId || index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-video overflow-hidden rounded border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* No Images Placeholder */}
        {!hasImages && (
          <section className="border-y border-border bg-muted/20 py-16">
            <div className="mx-auto max-w-6xl px-4 lg:px-6">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="font-serif text-muted-foreground">
                    Belum ada dokumentasi untuk program ini
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Community Info */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <Card className="border-border/70 bg-background/95">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="font-serif text-lg text-foreground">
                      Tentang Program
                    </CardTitle>
                    <CardDescription className="font-serif text-sm text-muted-foreground mt-1">
                      Informasi lengkap mengenai program ini
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Community */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Komunitas
                  </p>
                  <Badge variant="outline" className="font-serif">
                    {event.community || event.communityName}
                  </Badge>
                </div>

                {/* Description */}
                {event.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Deskripsi
                    </p>
                    <p className="font-serif text-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Date & Time */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Tanggal Pelaksanaan
                    </p>
                    <p className="font-serif text-foreground">
                      {formatDate(event.date)}
                    </p>
                  </div>

                  {event.location && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Tempat
                      </p>
                      <p className="font-serif text-foreground">
                        {event.location}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tutor Info */}
                {event.tutor && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Tutor / Pembicara
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-serif text-foreground font-medium">
                        {event.tutor.name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {event.tutor.type}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-muted/20 py-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 lg:px-6">
            <div className="max-w-2xl font-serif text-sm text-muted-foreground">
              Tertarik mengikuti program kami? Hubungi tim kami untuk informasi
              lebih lanjut atau pendaftaran.
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="font-serif text-sm" asChild>
                <Link to="/kontak">Hubungi Kami</Link>
              </Button>
              <Button
                variant="link"
                className="font-serif text-sm px-0"
                asChild
              >
                <Link to="/program">← Kembali ke semua program</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramDetail;
