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
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  User,
} from "lucide-react";
import { getAllAttendances } from "../../services/attendanceService";
import { getAllEvents } from "../../services/eventService";
import { toast } from "sonner";

const Attendances = () => {
  const navigate = useNavigate();
  const [attendances, setAttendances] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");

  // Fetch data
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const [attendanceResult, eventResult] = await Promise.all([
      getAllAttendances(),
      getAllEvents(),
    ]);

    if (attendanceResult.success) {
      setAttendances(attendanceResult.data);
    } else {
      setError(attendanceResult.error);
      toast.error(attendanceResult.error || "Gagal memuat data attendance");
    }

    if (eventResult.success) {
      setEvents(eventResult.data);
    }

    setLoading(false);
  };

  // Filter and search attendances
  const filteredAttendances = attendances.filter((attendance) => {
    const matchesSearch = attendance.attendee.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || attendance.attendee.type === typeFilter;

    const attendanceEventId = typeof attendance.eventID === "object" 
      ? attendance.eventID?._id 
      : attendance.eventID;
    const matchesEvent =
      eventFilter === "all" || attendanceEventId === eventFilter;

    return matchesSearch && matchesType && matchesEvent;
  });

  // Calculate stats
  const totalAttendances = attendances.length;
  const memberAttendances = attendances.filter(
    (a) => a.attendee.type === "Member"
  ).length;
  const guestAttendances = attendances.filter(
    (a) => a.attendee.type === "Guest"
  ).length;

  // Get event name - handle both populated object and ID string
  const getEventName = (eventData) => {
    if (typeof eventData === "object" && eventData !== null) {
      return eventData.name || "Unknown Event";
    }
    const event = events.find((e) => e._id === eventData);
    return event ? event.name : "Unknown Event";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Attendance
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola kehadiran member dan guest di event
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            className="gap-2"
            onClick={() => navigate("/admin/attendance/new")}
          >
            <Plus className="h-4 w-4" />
            Tambah Kehadiran
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Kehadiran
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalAttendances}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total kehadiran
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Member</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {memberAttendances}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Member hadir
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Guest</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {guestAttendances}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Guest hadir
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Kehadiran</CardTitle>
              <CardDescription>
                {filteredAttendances.length} dari {attendances.length} kehadiran
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
                placeholder="Cari nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Guest">Guest</SelectItem>
              </SelectContent>
            </Select>

            {/* Event Filter */}
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Event</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Gagal Memuat Data
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && attendances.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Belum Ada Kehadiran
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mulai dengan menambahkan kehadiran pertama
              </p>
              <Button onClick={() => navigate("/admin/attendance/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kehadiran
              </Button>
            </div>
          )}

          {/* Attendance List */}
          {!loading && !error && filteredAttendances.length > 0 && (
            <div className="space-y-3">
              {filteredAttendances.map((attendance) => (
                <div
                  key={attendance._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{attendance.attendee.name}</p>
                        <Badge
                          variant="outline"
                          className={
                            attendance.attendee.type === "Member"
                              ? "bg-blue-500/10 text-blue-700 border-blue-200"
                              : "bg-green-500/10 text-green-700 border-green-200"
                          }
                        >
                          {attendance.attendee.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getEventName(attendance.eventID)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/attendance/${attendance._id}`)
                      }
                    >
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/attendance/${attendance._id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            attendances.length > 0 &&
            filteredAttendances.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tidak ada kehadiran yang sesuai dengan filter Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setEventFilter("all");
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

export default Attendances;

