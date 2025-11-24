import { useEffect, useMemo, useState } from "react";

import ProgramCard from "@/components/home/ProgramCard";
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
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getAllEvents } from "@/services/eventService";

const communities = ["Nostracode", "Cordis Lingua"];

const statuses = [
  { value: "upcoming", label: "Akan Datang" },
  { value: "today", label: "Hari Ini" },
  { value: "past", label: "Selesai" },
];

const Programs = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);

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

  // Get event status
  const getEventStatus = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return "past";
    } else if (eventDate.toDateString() === today.toDateString()) {
      return "today";
    } else {
      return "upcoming";
    }
  };

  const filteredPrograms = useMemo(() => {
    let result = [...events];

    if (activeCommunity) {
      result = result.filter(
        (event) => (event.community || event.communityName) === activeCommunity
      );
    }

    if (activeStatus) {
      result = result.filter(
        (event) => getEventStatus(event.date) === activeStatus
      );
    }

    return result;
  }, [events, activeCommunity, activeStatus]);

  const handleCommunityFilter = (community) => {
    const nextCommunity = activeCommunity === community ? null : community;
    setActiveCommunity(nextCommunity);
  };

  const handleStatusFilter = (status) => {
    const nextStatus = activeStatus === status ? null : status;
    setActiveStatus(nextStatus);
  };

  const handleClearFilters = () => {
    setActiveCommunity(null);
    setActiveStatus(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex flex-col flex-1">
        {/* Hero Section */}
        <section className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center md:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Transparansi Program
            </p>
            <h1 className="mt-6 font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Program Kami
            </h1>
            <p className="mt-6 font-serif text-lg text-muted-foreground md:text-xl">
              Jelajahi berbagai program dan kegiatan yang kami jalankan dengan
              akuntabilitas menyeluruh. Setiap program menampilkan informasi
              lengkap, dokumentasi, serta detail pelaksanaan untuk menjaga
              kepercayaan publik.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="border-y border-border bg-muted/20 py-12">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Community Filter */}
              <div>
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Filter Komunitas
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {communities.map((community) => (
                    <Button
                      key={community}
                      variant="outline"
                      className={cn(
                        "border border-border/60 bg-background/80 px-4 py-2 font-serif text-sm text-muted-foreground hover:border-foreground hover:text-foreground transition-colors",
                        activeCommunity === community &&
                          "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleCommunityFilter(community)}
                    >
                      {community}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Filter Status
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status.value}
                      variant="outline"
                      className={cn(
                        "border border-border/60 bg-background/80 px-4 py-2 font-serif text-sm text-muted-foreground hover:border-foreground hover:text-foreground transition-colors",
                        activeStatus === status.value &&
                          "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleStatusFilter(status.value)}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(activeCommunity || activeStatus) && (
              <Button
                variant="link"
                className="mt-6 px-0 font-serif text-sm text-muted-foreground hover:text-foreground"
                onClick={handleClearFilters}
              >
                Hapus semua filter
              </Button>
            )}
          </div>
        </section>

        {/* Programs List Section */}
        <section className="flex-1 bg-background py-16">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            {loading && (
              <Card className="border-border/70 bg-background/95">
                <CardContent className="flex flex-col items-center gap-3 py-16">
                  <Spinner className="size-6 text-primary" />
                  <p className="font-serif text-sm text-muted-foreground">
                    Memuat program...
                  </p>
                </CardContent>
              </Card>
            )}

            {!loading && error && (
              <Card className="border-destructive/40 bg-destructive/10">
                <CardHeader>
                  <CardTitle className="font-serif text-foreground">
                    Terjadi Kesalahan
                  </CardTitle>
                  <CardDescription className="font-serif text-sm text-destructive">
                    {error}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="font-serif text-sm"
                    onClick={fetchEvents}
                  >
                    Muat Ulang
                  </Button>
                </CardContent>
              </Card>
            )}

            {!loading && !error && filteredPrograms.length === 0 && (
              <Card className="border-border/70 bg-background/95">
                <CardContent className="py-16 text-center">
                  <p className="font-serif text-base text-muted-foreground mb-2">
                    {events.length === 0
                      ? "Belum ada program yang tersedia."
                      : "Tidak ada program yang sesuai dengan filter saat ini."}
                  </p>
                  {events.length > 0 && (
                    <Button
                      variant="link"
                      className="font-serif text-sm"
                      onClick={handleClearFilters}
                    >
                      Hapus filter
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {!loading && !error && filteredPrograms.length > 0 && (
              <>
                <div className="mb-8">
                  <p className="font-serif text-sm text-muted-foreground">
                    Menampilkan {filteredPrograms.length} dari {events.length}{" "}
                    program
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPrograms.map((event) => (
                    <ProgramCard key={event._id} event={event} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Programs;
