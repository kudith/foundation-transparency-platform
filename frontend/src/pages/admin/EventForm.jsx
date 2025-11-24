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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { ArrowLeft, X, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  createEvent,
  updateEvent,
  getEventById,
  deleteEventImage,
} from "../../services/eventService";
import { getAllUsers } from "../../services/userService";
import { toast } from "sonner";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    community: "",
    date: "",
    location: "",
    description: "",
    tutorType: "External",
    tutorName: "",
    tutorUserID: "",
  });

  // Image states
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletingImageId, setDeletingImageId] = useState(null);

  // Users list for Internal tutor
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchEventData();
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      console.error("Failed to fetch users:", result.error);
    }
    setLoadingUsers(false);
  };

  const fetchEventData = async () => {
    setLoading(true);
    const result = await getEventById(id);

    if (result.success) {
      const event = result.data;
      setFormData({
        name: event.name || "",
        community: event.community || event.communityName || "",
        date: event.date ? event.date.split("T")[0] : "",
        location: event.location || "",
        description: event.description || "",
        tutorType: event.tutor?.type || "External",
        tutorName: event.tutor?.name || "",
        tutorUserID: event.tutor?.userID || "",
      });
      setExistingImages(event.images || []);
    } else {
      toast.error(result.error || "Gagal memuat data event");
      navigate("/admin/events");
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSelect = (userId) => {
    const selectedUser = users.find((u) => u._id === userId);
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        tutorUserID: userId,
        tutorName: selectedUser.name,
      }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Validate max 5 images total
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      toast.error("Maksimal 5 gambar per event");
      return;
    }

    // Validate file size (5MB max)
    const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    // Validate file type
    const invalidTypes = files.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidTypes.length > 0) {
      toast.error("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Add to new images
    setNewImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, { file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (publicId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus gambar ini?")) {
      return;
    }

    setDeletingImageId(publicId);
    const result = await deleteEventImage(id, publicId);

    if (result.success) {
      setExistingImages((prev) =>
        prev.filter((img) => img.publicId !== publicId)
      );
      toast.success("Gambar berhasil dihapus");
    } else {
      toast.error(result.error || "Gagal menghapus gambar");
    }

    setDeletingImageId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.community || !formData.date) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (!formData.tutorName) {
      toast.error("Nama tutor wajib diisi");
      return;
    }

    setSubmitting(true);

    const eventData = {
      name: formData.name,
      community: formData.community,
      date: formData.date,
      location: formData.location,
      description: formData.description,
      tutor: {
        type: formData.tutorType,
        name: formData.tutorName,
        ...(formData.tutorType === "Internal" && formData.tutorUserID
          ? { userID: formData.tutorUserID }
          : {}),
      },
    };

    let result;
    if (isEdit) {
      result = await updateEvent(id, eventData, newImages);
    } else {
      result = await createEvent(eventData, newImages);
    }

    if (result.success) {
      toast.success(
        isEdit ? "Event berhasil diupdate" : "Event berhasil dibuat"
      );
      navigate(`/admin/events/${result.data._id}`);
    } else {
      toast.error(result.error || "Gagal menyimpan event");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalImages = existingImages.length + newImages.length;
  const canAddMoreImages = totalImages < 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={isEdit ? `/admin/events/${id}` : "/admin/events"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {isEdit ? "Edit Event" : "Tambah Event Baru"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEdit
              ? "Update informasi event"
              : "Buat event baru untuk komunitas"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Main Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Event</CardTitle>
                <CardDescription>
                  Lengkapi informasi dasar event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nama Event <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Workshop Cyber Security"
                    required
                  />
                </div>

                {/* Community */}
                <div className="space-y-2">
                  <Label htmlFor="community">
                    Komunitas <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.community}
                    onValueChange={(value) =>
                      handleSelectChange("community", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih komunitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nostracode">Nostracode</SelectItem>
                      <SelectItem value="Cordis Lingua">
                        Cordis Lingua
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Tanggal Event <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Jakarta"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Deskripsi event..."
                    rows={4}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Galeri Foto</CardTitle>
                <CardDescription>
                  Upload foto event (maksimal 5 gambar, masing-masing max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Images (for edit) */}
                {isEdit && existingImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-3">
                      Gambar yang ada ({existingImages.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingImages.map((image) => (
                        <div
                          key={image.publicId}
                          className="relative aspect-video rounded-lg overflow-hidden border bg-muted group"
                        >
                          <img
                            src={image.url}
                            alt="Event"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteExistingImage(image.publicId)
                            }
                            disabled={deletingImageId === image.publicId}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          >
                            {deletingImageId === image.publicId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {imagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-3">
                      Gambar baru ({imagePreviews.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((item, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden border bg-muted group"
                        >
                          <img
                            src={item.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {canAddMoreImages && (
                  <div>
                    <label htmlFor="images">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm font-medium mb-1">
                          Klik untuk upload gambar
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 5MB ({5 - totalImages} slot
                          tersisa)
                        </p>
                      </div>
                    </label>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tutor Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Tutor</CardTitle>
                <CardDescription>Pilih tipe dan nama tutor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tutor Type */}
                <div className="space-y-2">
                  <Label htmlFor="tutorType">
                    Tipe Tutor <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.tutorType}
                    onValueChange={(value) =>
                      handleSelectChange("tutorType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="External">External</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tutor Selection - Internal */}
                {formData.tutorType === "Internal" && (
                  <div className="space-y-2">
                    <Label htmlFor="tutorUser">
                      Pilih Tutor <span className="text-destructive">*</span>
                    </Label>
                    {loadingUsers ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={formData.tutorUserID}
                        onValueChange={handleUserSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Tutor Internal" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.length === 0 ? (
                            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                              Tidak ada tutor internal tersedia
                            </div>
                          ) : (
                            users.map((user) => (
                              <SelectItem key={user._id} value={user._id}>
                                {user.name}
                                {user.communities &&
                                  user.communities.length > 0 && (
                                    <span className="text-muted-foreground ml-2">
                                      ({user.communities.join(", ")})
                                    </span>
                                  )}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    {formData.tutorUserID && formData.tutorName && (
                      <p className="text-xs text-muted-foreground">
                        Terpilih: <strong>{formData.tutorName}</strong> (ID:{" "}
                        {formData.tutorUserID})
                      </p>
                    )}
                  </div>
                )}

                {/* Tutor Name - External */}
                {formData.tutorType === "External" && (
                  <div className="space-y-2">
                    <Label htmlFor="tutorName">
                      Nama Tutor <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="tutorName"
                      name="tutorName"
                      value={formData.tutorName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEdit ? "Menyimpan..." : "Membuat..."}
                    </>
                  ) : (
                    <>{isEdit ? "Simpan Perubahan" : "Buat Event"}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    navigate(isEdit ? `/admin/events/${id}` : "/admin/events")
                  }
                  disabled={submitting}
                >
                  Batal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
