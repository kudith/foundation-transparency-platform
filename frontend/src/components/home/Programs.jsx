import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { getAllEvents } from "@/services/eventService";
import ProgramCard from "@/components/home/ProgramCard";

const Programs = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    const result = await getAllEvents();

    if (result.success) {
      // Sort by date descending (newest first)
      const sortedEvents = result.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setEvents(sortedEvents);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const featuredPrograms = events.slice(0, 3);

  if (loading) {
    return (
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
          <Card className="border-border/70 bg-background/95">
            <CardContent className="flex flex-col items-center gap-3 py-10">
              <Spinner className="size-6 text-primary" />
              <p className="font-serif text-sm text-muted-foreground">
                Memuat program unggulan...
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
          <Card className="border-destructive/40 bg-destructive/10">
            <CardHeader>
              <CardTitle className="font-serif text-foreground">
                Terjadi Kesalahan
              </CardTitle>
              <CardDescription className="font-serif text-sm text-destructive">
                Gagal memuat program. Silakan coba lagi beberapa saat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={fetchEvents}
                className="font-serif text-sm"
              >
                Muat Ulang
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (featuredPrograms.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-12 text-center">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-primary/80">
            Program Kami
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Inisiatif Transparan untuk Dampak Nyata
          </h2>
          <p className="mt-4 font-serif text-base text-muted-foreground md:text-lg">
            Setiap program disertai laporan menyeluruh dan indikator
            keberhasilan yang dapat dipantau secara berkala oleh publik.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredPrograms.map((event) => (
            <ProgramCard key={event._id} event={event} />
          ))}
        </div>

        {events.length > featuredPrograms.length && (
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="font-serif text-sm"
            >
              <Link to="/program">Lihat Semua Program</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;
