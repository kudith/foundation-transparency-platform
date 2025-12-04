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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  User,
  Users as UsersIcon,
  Briefcase,
  Calendar,
  MapPin,
  IdCard,
  Trophy,
  Plus,
  X,
  Loader2,
  Check,
  FileText,
  TrendingUp,
  Building2,
} from "lucide-react";
import { getUserById, deleteUser } from "../../services/userService";
import {
  getMilestonesByUserId,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../../services/milestoneService";
import { toast } from "sonner";

// Milestone types configuration
const MILESTONE_TYPES = [
  {
    value: "project_submitted",
    label: "Project Submitted",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    value: "level_up",
    label: "Level Up",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    value: "job_placement",
    label: "Job Placement",
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Milestones state
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneSubmitting, setMilestoneSubmitting] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    type: "",
    date: "",
    // project_submitted fields
    title: "",
    // level_up fields
    from: "",
    to: "",
    // job_placement fields
    company: "",
    role: "",
  });

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    const result = await getUserById(id);

    if (result.success) {
      setUser(result.data);
      // Fetch milestones after user data is loaded
      fetchMilestones();
    } else {
      setError(result.error);
      toast.error(result.error || "Gagal memuat data user");
    }

    setLoading(false);
  };

  const fetchMilestones = async () => {
    setMilestonesLoading(true);
    const result = await getMilestonesByUserId(id);

    if (result.success) {
      setMilestones(result.data);
    } else {
      console.error("Failed to fetch milestones:", result.error);
    }

    setMilestonesLoading(false);
  };

  const handleDelete = async () => {
    if (
      !globalThis.confirm(
        `Apakah Anda yakin ingin menghapus user "${user?.name}"?`
      )
    ) {
      return;
    }

    setDeleting(true);
    const result = await deleteUser(id);

    if (result.success) {
      toast.success(result.message || "User berhasil dihapus");
      navigate("/admin/users");
    } else {
      toast.error(result.error || "Gagal menghapus user");
      setDeleting(false);
    }
  };

  // Milestone handlers
  const resetMilestoneForm = () => {
    setMilestoneForm({
      type: "",
      date: "",
      title: "",
      from: "",
      to: "",
      company: "",
      role: "",
    });
    setEditingMilestone(null);
    setShowMilestoneForm(false);
  };

  const handleMilestoneFormChange = (e) => {
    const { name, value } = e.target;
    setMilestoneForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMilestone = () => {
    setEditingMilestone(null);
    resetMilestoneForm();
    setShowMilestoneForm(true);
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    
    const formData = {
      type: milestone.type || "",
      date: milestone.date
        ? new Date(milestone.date).toISOString().split("T")[0]
        : "",
      title: "",
      from: "",
      to: "",
      company: "",
      role: "",
    };

    // Populate detail fields based on type
    switch (milestone.type) {
      case "project_submitted":
        formData.title = milestone.detail?.title || "";
        break;
      case "level_up":
        formData.from = milestone.detail?.from || "";
        formData.to = milestone.detail?.to || "";
        break;
      case "job_placement":
        formData.company = milestone.detail?.company || "";
        formData.role = milestone.detail?.role || "";
        break;
    }

    setMilestoneForm(formData);
    setShowMilestoneForm(true);
  };

  const validateMilestoneForm = () => {
    if (!milestoneForm.type) {
      toast.error("Tipe milestone harus dipilih");
      return false;
    }
    if (!milestoneForm.date) {
      toast.error("Tanggal harus diisi");
      return false;
    }

    switch (milestoneForm.type) {
      case "project_submitted":
        if (!milestoneForm.title) {
          toast.error("Judul project harus diisi");
          return false;
        }
        break;
      case "level_up":
        if (!milestoneForm.from || !milestoneForm.to) {
          toast.error("Level awal dan tujuan harus diisi");
          return false;
        }
        break;
      case "job_placement":
        if (!milestoneForm.company || !milestoneForm.role) {
          toast.error("Nama perusahaan dan posisi harus diisi");
          return false;
        }
        break;
    }

    return true;
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();

    if (!validateMilestoneForm()) {
      return;
    }

    setMilestoneSubmitting(true);

    // Build detail object based on type
    let detail = {};
    switch (milestoneForm.type) {
      case "project_submitted":
        detail = { title: milestoneForm.title };
        break;
      case "level_up":
        detail = { from: milestoneForm.from, to: milestoneForm.to };
        break;
      case "job_placement":
        detail = { company: milestoneForm.company, role: milestoneForm.role };
        break;
    }

    const milestoneData = {
      userID: id,
      type: milestoneForm.type,
      detail,
      date: milestoneForm.date,
    };

    let result;
    if (editingMilestone) {
      result = await updateMilestone(editingMilestone._id, milestoneData);
    } else {
      result = await createMilestone(milestoneData);
    }

    if (result.success) {
      toast.success(
        editingMilestone
          ? "Milestone berhasil diperbarui"
          : "Milestone berhasil ditambahkan"
      );
      resetMilestoneForm();
      fetchMilestones();
    } else {
      toast.error(result.error || "Gagal menyimpan milestone");
    }

    setMilestoneSubmitting(false);
  };

  const handleDeleteMilestone = async (milestoneId, milestoneLabel) => {
    if (
      !globalThis.confirm(
        `Apakah Anda yakin ingin menghapus milestone "${milestoneLabel}"?`
      )
    ) {
      return;
    }

    const result = await deleteMilestone(milestoneId);

    if (result.success) {
      toast.success("Milestone berhasil dihapus");
      fetchMilestones();
    } else {
      toast.error(result.error || "Gagal menghapus milestone");
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get milestone display info
  const getMilestoneDisplay = (milestone) => {
    const typeConfig = MILESTONE_TYPES.find((t) => t.value === milestone.type);
    const Icon = typeConfig?.icon || Trophy;
    const color = typeConfig?.color || "text-amber-500";
    const bgColor = typeConfig?.bgColor || "bg-amber-500/10";

    let title = "";
    let subtitle = "";

    switch (milestone.type) {
      case "project_submitted":
        title = milestone.detail?.title || "Project";
        subtitle = "Project Submitted";
        break;
      case "level_up":
        title = `${milestone.detail?.from} → ${milestone.detail?.to}`;
        subtitle = "Level Up";
        break;
      case "job_placement":
        title = milestone.detail?.role || "Position";
        subtitle = milestone.detail?.company || "Company";
        break;
      default:
        title = "Milestone";
        subtitle = milestone.type;
    }

    return { Icon, color, bgColor, title, subtitle };
  };

  // Render dynamic form fields based on type
  const renderDetailFields = () => {
    switch (milestoneForm.type) {
      case "project_submitted":
        return (
          <div className="space-y-1">
            <Label htmlFor="title" className="text-xs">
              Judul Project <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={milestoneForm.title}
              onChange={handleMilestoneFormChange}
              placeholder="Nama project yang disubmit"
              className="h-9"
            />
          </div>
        );

      case "level_up":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="from" className="text-xs">
                Level Awal <span className="text-destructive">*</span>
              </Label>
              <Input
                id="from"
                name="from"
                value={milestoneForm.from}
                onChange={handleMilestoneFormChange}
                placeholder="Contoh: A2"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="to" className="text-xs">
                Level Tujuan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="to"
                name="to"
                value={milestoneForm.to}
                onChange={handleMilestoneFormChange}
                placeholder="Contoh: B1"
                className="h-9"
              />
            </div>
          </div>
        );

      case "job_placement":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="company" className="text-xs">
                Perusahaan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                value={milestoneForm.company}
                onChange={handleMilestoneFormChange}
                placeholder="Nama perusahaan"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role" className="text-xs">
                Posisi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role"
                name="role"
                value={milestoneForm.role}
                onChange={handleMilestoneFormChange}
                placeholder="Contoh: Fullstack Developer"
                className="h-9"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              User Detail
            </h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">User Tidak Ditemukan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error || "User tidak ditemukan atau telah dihapus"}
              </p>
              <Button onClick={() => navigate("/admin/users")} variant="outline">
                Kembali ke Daftar Users
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {user.name}
            </h1>
            <p className="text-muted-foreground mt-1">Detail informasi user</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/users/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      {/* User Information */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi User</CardTitle>
              <CardDescription>Data dasar user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ID */}
              <div className="flex items-start gap-3">
                <IdCard className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-base font-mono">{user._id}</p>
                </div>
              </div>

              {/* Name */}
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Nama</p>
                  <p className="text-base">{user.name}</p>
                </div>
              </div>

              {/* Domisili */}
              {user.domisili && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Domisili
                    </p>
                    <p className="text-base">{user.domisili}</p>
                  </div>
                </div>
              )}

              {/* Status Pekerjaan */}
              {user.statusPekerjaan && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status Pekerjaan
                    </p>
                    <p className="text-base">{user.statusPekerjaan}</p>
                  </div>
                </div>
              )}

              {/* Kategori Usia */}
              {user.kategoriUsia && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Kategori Usia
                    </p>
                    <p className="text-base">{user.kategoriUsia}</p>
                  </div>
                </div>
              )}

              {/* Created At */}
              {user.createdAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Tanggal Dibuat
                    </p>
                    <p className="text-base">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Communities */}
          <Card>
            <CardHeader>
              <CardTitle>Komunitas</CardTitle>
              <CardDescription>
                Komunitas yang diikuti oleh user
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.communities && user.communities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.communities.map((community) => (
                    <Badge key={community} variant="outline" className="text-sm">
                      <UsersIcon className="h-3 w-3 mr-1" />
                      {community}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  User belum bergabung dengan komunitas manapun
                </p>
              )}
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Role yang dimiliki user</CardDescription>
            </CardHeader>
            <CardContent>
              {user.roles && user.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="default" className="text-sm">
                      {role}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  User belum memiliki role
                </p>
              )}
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Milestones
                  </CardTitle>
                  <CardDescription>
                    Pencapaian dan milestone user ({milestones.length})
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleAddMilestone}>
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Milestone Form */}
              {showMilestoneForm && (
                <div className="mb-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">
                      {editingMilestone ? "Edit Milestone" : "Tambah Milestone"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetMilestoneForm}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                    {/* Type and Date */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label htmlFor="type" className="text-xs">
                          Tipe Milestone <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="type"
                          name="type"
                          value={milestoneForm.type}
                          onChange={handleMilestoneFormChange}
                          className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Pilih tipe...</option>
                          {MILESTONE_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="date" className="text-xs">
                          Tanggal <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={milestoneForm.date}
                          onChange={handleMilestoneFormChange}
                          className="h-9"
                        />
                      </div>
                    </div>

                    {/* Dynamic Detail Fields */}
                    {milestoneForm.type && renderDetailFields()}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resetMilestoneForm}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={milestoneSubmitting}
                      >
                        {milestoneSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Simpan
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Milestones List */}
              {milestonesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : milestones.length > 0 ? (
                <div className="space-y-3">
                  {milestones.map((milestone) => {
                    const { Icon, color, bgColor, title, subtitle } =
                      getMilestoneDisplay(milestone);

                    return (
                      <div
                        key={milestone._id}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">{title}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  {subtitle}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(milestone.date)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditMilestone(milestone)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() =>
                                  handleDeleteMilestone(milestone._id, title)
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada milestone untuk user ini
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddMilestone}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Milestone Pertama
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={() => navigate(`/admin/users/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddMilestone}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Tambah Milestone
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus User
              </Button>
            </CardContent>
          </Card>

          {/* Milestones Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Milestone Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{milestones.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Total Milestones
                  </p>
                </div>
              </div>

              {/* Breakdown by type */}
              {milestones.length > 0 && (
                <div className="pt-2 border-t space-y-2">
                  {MILESTONE_TYPES.map((type) => {
                    const count = milestones.filter(
                      (m) => m.type === type.value
                    ).length;
                    if (count === 0) return null;
                    const TypeIcon = type.icon;
                    return (
                      <div
                        key={type.value}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <TypeIcon className={`h-4 w-4 ${type.color}`} />
                          <span className="text-muted-foreground">
                            {type.label}
                          </span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
