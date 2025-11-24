import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Plus,
  Calendar,
  Users,
  User,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Search,
  Filter,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  CalendarX2,
} from "lucide-react";
import { getAllEvents, getEventStatus } from "../../services/eventService";
import { toast } from "sonner";

// Event Card Component with Carousel
const EventCard = ({ event, status, onDetail, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = event.images || [];
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStatusBadge = (statusValue) => {
    const variants = {
      upcoming: "bg-blue-500/10 text-blue-700 border-blue-200",
      ongoing: "bg-green-500/10 text-green-700 border-green-200",
      completed: "bg-gray-500/10 text-gray-700 border-gray-200",
    };

    const labels = {
      upcoming: "Upcoming",
      ongoing: "Ongoing",
      completed: "Completed",
    };

    return (
      <Badge variant="outline" className={variants[statusValue]}>
        {labels[statusValue]}
      </Badge>
    );
  };

  const getTutorDisplay = (tutor) => {
    if (!tutor) return "N/A";
    return tutor.type === "Internal"
      ? `${tutor.name} (Internal)`
      : `${tutor.name} (External)`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Section with Carousel */}
      <div className="relative aspect-video bg-muted">
        {hasImages ? (
          <>
            <img
              src={images[currentImageIndex].url}
              alt={event.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={onDetail}
            />
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            {hasMultipleImages && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                {currentImageIndex + 1}/{images.length}
              </div>
            )}
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={onDetail}
          >
            <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">No Image</p>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className="text-lg line-clamp-2 cursor-pointer hover:text-primary transition-colors"
            onClick={onDetail}
          >
            {event.name}
          </CardTitle>
          {getStatusBadge(status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Event Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {new Date(event.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {event.community || event.communityName || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">{getTutorDisplay(event.tutor)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onDetail}
          >
            Detail
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [communityFilter, setCommunityFilter] = useState("all");

  // Fetch events data
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    const result = await getAllEvents();

    if (result.success) {
      setEvents(result.data);
    } else {
      setError(result.error);
      toast.error(result.error || "Gagal memuat data events");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter and search events
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const eventStatus = getEventStatus(event.date);
    const matchesStatus =
      statusFilter === "all" || eventStatus === statusFilter;

    const eventCommunity = event.community || event.communityName || "";
    const matchesCommunity =
      communityFilter === "all" || eventCommunity === communityFilter;

    return matchesSearch && matchesStatus && matchesCommunity;
  });

  // Calculate stats from all events (not filtered)
  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (e) => getEventStatus(e.date) === "upcoming"
  ).length;
  const ongoingEvents = events.filter(
    (e) => getEventStatus(e.date) === "ongoing"
  ).length;
  const completedEvents = events.filter(
    (e) => getEventStatus(e.date) === "completed"
  ).length;

  // Get unique communities
  const communities = [
    ...new Set(
      events.map((e) => e.community || e.communityName).filter(Boolean)
    ),
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Events
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola semua event dan kegiatan organisasi
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchEvents}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            className="gap-2"
            onClick={() => navigate("/admin/events/new")}
          >
            <Plus className="h-4 w-4" />
            Tambah Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Event terdaftar
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {upcomingEvents}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Event yang akan datang
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ongoing Events
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {ongoingEvents}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Event sedang berlangsung
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Events
            </CardTitle>
            <CalendarX2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-600">
                  {completedEvents}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Event selesai
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Event</CardTitle>
              <CardDescription>
                {filteredEvents.length} dari {events.length} event
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Community Filter */}
            <Select value={communityFilter} onValueChange={setCommunityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Komunitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Komunitas</SelectItem>
                {communities.map((community) => (
                  <SelectItem key={community} value={community}>
                    {community}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-64" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gagal Memuat Data</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchEvents} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Event</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mulai dengan menambahkan event pertama Anda
              </p>
              <Button onClick={() => navigate("/admin/events/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Event
              </Button>
            </div>
          )}

          {/* Events List */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const status = getEventStatus(event.date);
                return (
                  <EventCard
                    key={event._id}
                    event={event}
                    status={status}
                    onDetail={() => navigate(`/admin/events/${event._id}`)}
                    onEdit={() => navigate(`/admin/events/${event._id}/edit`)}
                  />
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            events.length > 0 &&
            filteredEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tidak ada event yang sesuai dengan filter Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCommunityFilter("all");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
