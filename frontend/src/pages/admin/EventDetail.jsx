import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import {
  Calendar,
  Users,
  User,
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ImageIcon,
} from "lucide-react";
import {
  getEventById,
  deleteEvent,
  getEventStatus,
} from "../../services/eventService";
import { toast } from "sonner";

// Image Carousel Component
const ImageCarousel = ({ images, eventName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
        <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">Tidak ada gambar</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      {/* Main Carousel */}
      <div className="space-y-4">
        {/* Large Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
          <img
            src={images[currentIndex].url}
            alt={`${eventName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={openLightbox}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                type="button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/70 text-white text-sm rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, idx) => (
              <button
                key={image.publicId}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/50"
                }`}
                type="button"
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <img
              src={images[currentIndex].url}
              alt={`${eventName} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  type="button"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  type="button"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 text-white rounded-full">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    setLoading(true);
    setError(null);

    const result = await getEventById(id);

    if (result.success) {
      setEvent(result.data);
    } else {
      setError(result.error);
      toast.error(result.error || "Gagal memuat detail event");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      return;
    }

    setDeleting(true);
    const result = await deleteEvent(id);

    if (result.success) {
      toast.success("Event berhasil dihapus");
      navigate("/admin/events");
    } else {
      toast.error(result.error || "Gagal menghapus event");
    }

    setDeleting(false);
  };

  const getStatusBadge = (status) => {
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
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getTutorDisplay = (tutor) => {
    if (!tutor) return "N/A";
    return tutor.type === "Internal"
      ? `${tutor.name} (Internal)`
      : `${tutor.name} (External)`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <Link to="/admin/events">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Event Tidak Ditemukan
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate("/admin/events")} variant="outline">
              Kembali ke Daftar Event
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getEventStatus(event.date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Detail Event
            </h1>
            <p className="text-muted-foreground mt-1">
              Informasi lengkap event
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/events/${id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{event.name}</CardTitle>
                {getStatusBadge(status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images Carousel */}
              <div>
                <h3 className="font-semibold mb-3">
                  {event.images && event.images.length > 0
                    ? "Galeri Foto"
                    : "Foto Event"}
                </h3>
                <ImageCarousel images={event.images} eventName={event.name} />
              </div>

              {/* Description */}
              {event.description && (
                <div>
                  <h3 className="font-semibold mb-2">Deskripsi</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tanggal</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Lokasi</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>
              )}

              {/* Community */}
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Komunitas</p>
                  <p className="text-sm text-muted-foreground">
                    {event.community || event.communityName || "N/A"}
                  </p>
                </div>
              </div>

              {/* Tutor */}
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tutor</p>
                  <p className="text-sm text-muted-foreground">
                    {getTutorDisplay(event.tutor)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Dibuat pada</p>
                <p className="font-medium">
                  {new Date(event.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Terakhir diupdate</p>
                <p className="font-medium">
                  {new Date(event.updatedAt).toLocaleString("id-ID")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
