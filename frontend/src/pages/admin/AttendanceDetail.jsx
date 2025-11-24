import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Separator } from "../../components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  AlertCircle,
  RefreshCw,
  MapPin,
  Users,
} from "lucide-react";
import {
  getAttendanceById,
  deleteAttendance,
} from "../../services/attendanceService";
import { toast } from "sonner";
import { useBreadcrumbStore } from "../../store/useBreadcrumbStore";

const AttendanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setDynamicBreadcrumbLabel } = useBreadcrumbStore();

  useEffect(() => {
    if (id) {
      fetchAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching attendance with ID:", id);
      const result = await getAttendanceById(id);
      console.log("Attendance result:", result);

      if (result.success && result.data) {
        console.log("Setting attendance data:", result.data);
        setAttendance(result.data);
        // Set breadcrumb label
        if (result.data.attendee?.name) {
          setDynamicBreadcrumbLabel(
            `/admin/attendance/${id}`,
            result.data.attendee.name
          );
        }
      } else {
        console.error("Failed to fetch attendance:", result.error);
        setError(result.error || "Gagal memuat data attendance");
        toast.error(result.error || "Gagal memuat data attendance");
      }
    } catch (err) {
      console.error("Error in fetchAttendance:", err);
      setError(err.message || "Terjadi kesalahan");
      toast.error("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !globalThis.confirm("Apakah Anda yakin ingin menghapus attendance ini?")
    ) {
      return;
    }

    const result = await deleteAttendance(id);

    if (result.success) {
      toast.success(result.message || "Attendance berhasil dihapus");
      navigate("/admin/attendance");
    } else {
      toast.error(result.error || "Gagal menghapus attendance");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loading && (error || !attendance)) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate("/admin/attendance")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gagal Memuat Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error || "Attendance tidak ditemukan"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/attendance")}
              >
                Kembali ke List
              </Button>
              <Button onClick={fetchAttendance}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/attendance")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Detail Kehadiran
            </h1>
            <p className="text-muted-foreground mt-1">
              {attendance?.attendee?.name || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/attendance/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Attendance Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {attendance?.attendee?.name || "N/A"}
              </CardTitle>
              <CardDescription className="mt-2">
                ID: {attendance?._id || "N/A"}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={
                attendance?.attendee?.type === "Member"
                  ? "bg-blue-500/10 text-blue-700 border-blue-200"
                  : "bg-green-500/10 text-green-700 border-green-200"
              }
            >
              {attendance?.attendee?.type || "N/A"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Attendee Type */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Tag className="h-4 w-4" />
              <span>Tipe Peserta</span>
            </div>
            <p className="text-base font-semibold">
              {attendance?.attendee?.type || "N/A"}
            </p>
          </div>

          <Separator />

          {/* Attendee Name */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <User className="h-4 w-4" />
              <span>Nama Peserta</span>
            </div>
            <p className="text-base">{attendance?.attendee?.name || "N/A"}</p>
          </div>

          {/* User Info (if Member) */}
          {attendance?.attendee?.type === "Member" &&
            attendance?.attendee?.userID && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <Users className="h-4 w-4" />
                    <span>Informasi Member</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono text-xs">
                        {typeof attendance.attendee.userID === "object"
                          ? attendance.attendee.userID._id
                          : attendance.attendee.userID}
                      </span>
                    </div>
                    {typeof attendance.attendee.userID === "object" &&
                      attendance.attendee.userID.email && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{attendance.attendee.userID.email}</span>
                        </div>
                      )}
                    {typeof attendance.attendee.userID === "object" &&
                      attendance.attendee.userID.role && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Role:</span>
                          <Badge variant="outline">
                            {attendance.attendee.userID.role}
                          </Badge>
                        </div>
                      )}
                  </div>
                </div>
              </>
            )}

          <Separator />

          {/* Event Info */}
          {attendance?.eventID && (
            <>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>Event</span>
                </div>
                {typeof attendance.eventID === "object" ? (
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-lg">
                        {attendance.eventID.name}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {attendance.eventID.community ||
                          attendance.eventID.communityName}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(attendance.eventID.date)}</span>
                      </div>
                      {attendance.eventID.location && (
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{attendance.eventID.location}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/events/${attendance.eventID._id}`)
                      }
                    >
                      Lihat Event Detail
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Event ID: {attendance.eventID}
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceDetail;
