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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { SearchableSelect } from "../../components/ui/searchable-select";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  RefreshCw,
  Calendar,
  MapPin,
  Mail,
} from "lucide-react";
import {
  getAttendanceById,
  createAttendance,
  updateAttendance,
} from "../../services/attendanceService";
import { getAllEvents } from "../../services/eventService";
import { getAllUsers } from "../../services/userService";
import { toast } from "sonner";
import { useBreadcrumbStore } from "../../store/useBreadcrumbStore";

const AttendanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { setDynamicBreadcrumbLabel } = useBreadcrumbStore();

  // Form state
  const [formData, setFormData] = useState({
    eventID: "",
    attendeeType: "Member",
    attendeeUserID: "",
    attendeeName: "",
  });

  // Options
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDynamicBreadcrumbLabel(
      `/admin/attendance/${id || "new"}`,
      isEdit ? "Edit" : "Baru"
    );
    fetchOptions();
    if (isEdit && id) {
      fetchAttendanceData();
    } else {
      setLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const fetchOptions = async () => {
    const [eventResult, userResult] = await Promise.all([
      getAllEvents(),
      getAllUsers(),
    ]);

    if (eventResult.success) {
      setEvents(eventResult.data);
    }

    if (userResult.success) {
      setUsers(userResult.data);
    }
  };

  const fetchAttendanceData = async () => {
    setLoadingData(true);
    setError(null);

    const result = await getAttendanceById(id);

    if (result.success) {
      const attendance = result.data;
      // Handle populated data - extract IDs if data is object
      const eventId =
        typeof attendance.eventID === "object"
          ? attendance.eventID?._id
          : attendance.eventID;
      const userId =
        typeof attendance.attendee.userID === "object"
          ? attendance.attendee.userID?._id
          : attendance.attendee.userID;

      setFormData({
        eventID: eventId || "",
        attendeeType: attendance.attendee.type || "Member",
        attendeeUserID: userId || "",
        attendeeName: attendance.attendee.name || "",
      });
    } else {
      setError(result.error);
      toast.error(result.error || "Gagal memuat data attendance");
    }

    setLoadingData(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      attendeeType: type,
      attendeeUserID: "",
      attendeeName: "",
    }));
    setErrors({});
  };

  const handleUserSelect = (userId) => {
    const selectedUser = users.find((u) => u._id === userId);
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        attendeeUserID: userId,
        attendeeName: selectedUser.name,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventID) {
      newErrors.eventID = "Event harus dipilih";
    }

    if (!formData.attendeeType) {
      newErrors.attendeeType = "Tipe peserta harus dipilih";
    }

    if (formData.attendeeType === "Member") {
      if (!formData.attendeeUserID) {
        newErrors.attendeeUserID = "Member harus dipilih";
      }
    } else if (formData.attendeeType === "Guest") {
      if (!formData.attendeeName || formData.attendeeName.trim() === "") {
        newErrors.attendeeName = "Nama guest harus diisi";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format event options for searchable select
  const formatEventOptions = () => {
    return events.map((event) => {
      const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return {
        value: event._id,
        label: event.name,
        searchText: `${event.name} ${
          event.community || event.communityName
        } ${eventDate}`,
        data: event,
      };
    });
  };

  // Format user options for searchable select
  const formatUserOptions = () => {
    return users.map((user) => ({
      value: user._id,
      label: user.name,
      searchText: `${user.name} ${user.email || ""}`,
      data: user,
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang required");
      return;
    }

    setLoading(true);

    const attendanceData = {
      eventID: formData.eventID,
      attendee: {
        type: formData.attendeeType,
        ...(formData.attendeeType === "Member"
          ? { userID: formData.attendeeUserID }
          : { name: formData.attendeeName }),
      },
    };

    let result;
    if (isEdit) {
      result = await updateAttendance(id, attendanceData);
    } else {
      result = await createAttendance(attendanceData);
    }

    if (result.success) {
      toast.success(
        result.message ||
          `Attendance berhasil ${isEdit ? "diupdate" : "dibuat"}`
      );
      navigate("/admin/attendance");
    } else {
      toast.error(
        result.error || `Gagal ${isEdit ? "mengupdate" : "membuat"} attendance`
      );
    }

    setLoading(false);
  };

  if (loadingData) {
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
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
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
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/attendance")}
              >
                Kembali ke List
              </Button>
              <Button onClick={fetchAttendanceData}>
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
            {isEdit ? "Edit Kehadiran" : "Tambah Kehadiran"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEdit
              ? "Perbarui informasi kehadiran"
              : "Tambahkan kehadiran baru ke event"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kehadiran</CardTitle>
            <CardDescription>
              Isi form di bawah untuk {isEdit ? "mengupdate" : "menambahkan"}{" "}
              kehadiran
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Event Selection */}
            <div className="space-y-2">
              <Label htmlFor="eventID">
                Event <span className="text-destructive">*</span>
              </Label>
              <SearchableSelect
                value={formData.eventID}
                onChange={(value) => handleInputChange("eventID", value)}
                options={formatEventOptions()}
                placeholder="Pilih event..."
                searchPlaceholder="Cari nama event, komunitas, atau tanggal..."
                emptyText="Tidak ada event ditemukan"
                className={errors.eventID ? "border-destructive" : ""}
                renderOption={(option) => (
                  <div className="flex flex-col gap-1 py-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {option.data.community || option.data.communityName}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(option.data.date)}</span>
                      </div>
                      {option.data.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{option.data.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                renderValue={(option) => (
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {option.data.community || option.data.communityName}
                    </Badge>
                  </div>
                )}
              />
              {errors.eventID && (
                <p className="text-sm text-destructive">{errors.eventID}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Ketik untuk mencari event berdasarkan nama, komunitas, atau
                tanggal
              </p>
            </div>

            {/* Attendee Type */}
            <div className="space-y-2">
              <Label htmlFor="attendeeType">
                Tipe Peserta <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.attendeeType}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger
                  id="attendeeType"
                  className={errors.attendeeType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Pilih tipe peserta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                </SelectContent>
              </Select>
              {errors.attendeeType && (
                <p className="text-sm text-destructive">
                  {errors.attendeeType}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.attendeeType === "Member"
                  ? "Pilih dari daftar member yang terdaftar"
                  : "Masukkan nama guest secara manual"}
              </p>
            </div>

            {/* Member Selection */}
            {formData.attendeeType === "Member" && (
              <div className="space-y-2">
                <Label htmlFor="attendeeUserID">
                  Pilih Member <span className="text-destructive">*</span>
                </Label>
                <SearchableSelect
                  value={formData.attendeeUserID}
                  onChange={handleUserSelect}
                  options={formatUserOptions()}
                  placeholder="Pilih member..."
                  searchPlaceholder="Cari nama atau email member..."
                  emptyText="Tidak ada member ditemukan"
                  className={errors.attendeeUserID ? "border-destructive" : ""}
                  renderOption={(option) => (
                    <div className="flex flex-col gap-0.5 py-1">
                      <div className="font-medium">{option.label}</div>
                      {option.data.email && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{option.data.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                  renderValue={(option) => (
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                      {option.data.email && (
                        <span className="text-xs text-muted-foreground">
                          ({option.data.email})
                        </span>
                      )}
                    </div>
                  )}
                />
                {errors.attendeeUserID && (
                  <p className="text-sm text-destructive">
                    {errors.attendeeUserID}
                  </p>
                )}
                {formData.attendeeName && (
                  <div className="rounded-md bg-muted p-3 mt-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        Member terpilih:
                      </span>{" "}
                      <span className="font-semibold">
                        {formData.attendeeName}
                      </span>
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Ketik untuk mencari member berdasarkan nama atau email
                </p>
              </div>
            )}

            {/* Guest Name Input */}
            {formData.attendeeType === "Guest" && (
              <div className="space-y-2">
                <Label htmlFor="attendeeName">
                  Nama Guest <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="attendeeName"
                  type="text"
                  placeholder="Masukkan nama guest"
                  value={formData.attendeeName}
                  onChange={(e) =>
                    handleInputChange("attendeeName", e.target.value)
                  }
                  className={errors.attendeeName ? "border-destructive" : ""}
                />
                {errors.attendeeName && (
                  <p className="text-sm text-destructive">
                    {errors.attendeeName}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/attendance")}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {isEdit ? "Menyimpan..." : "Membuat..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? "Simpan Perubahan" : "Tambah Kehadiran"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AttendanceForm;
