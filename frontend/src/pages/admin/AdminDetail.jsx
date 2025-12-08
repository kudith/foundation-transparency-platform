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
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  User,
  IdCard,
} from "lucide-react";
import { getAdminById, deleteAdmin } from "../../services/adminService";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";

const AdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "super_admin";

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [id]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);

    const result = await getAdminById(id);

    if (result.success) {
      setAdmin(result.data);
    } else {
      setError(result.error);
      toast.error(result.error || "Gagal memuat data admin");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!isSuperAdmin) {
      toast.error("Hanya Super Admin yang dapat menghapus admin");
      return;
    }

    // Prevent deleting self
    if (id === user?._id || id === user?.id) {
      toast.error("Anda tidak dapat menghapus akun Anda sendiri");
      return;
    }

    if (
      !globalThis.confirm(
        `Apakah Anda yakin ingin menghapus admin "${admin?.name}"?`
      )
    ) {
      return;
    }

    setDeleting(true);
    const result = await deleteAdmin(id);

    if (result.success) {
      toast.success(result.message || "Admin berhasil dihapus");
      navigate("/admin/admins");
    } else {
      toast.error(result.error || "Gagal menghapus admin");
      setDeleting(false);
    }
  };

  // Check if viewing self
  const isViewingSelf = id === user?._id || id === user?.id;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get role badge
  const getRoleBadge = (role) => {
    if (role === "super_admin") {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Super Admin
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
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

  if (error || !admin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/admins">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Detail Admin
            </h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Admin Tidak Ditemukan
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error || "Admin tidak ditemukan atau telah dihapus"}
              </p>
              <Button
                onClick={() => navigate("/admin/admins")}
                variant="outline"
              >
                Kembali ke Daftar Admin
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
          <Link to="/admin/admins">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-bold text-foreground">
                {admin.name}
              </h1>
              {isViewingSelf && (
                <Badge variant="outline" className="text-xs">
                  Anda
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Detail informasi admin
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/admins/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {isSuperAdmin && !isViewingSelf && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          )}
        </div>
      </div>

      {/* Admin Information */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Admin</CardTitle>
              <CardDescription>Data akun admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ID */}
              <div className="flex items-start gap-3">
                <IdCard className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    ID
                  </p>
                  <p className="text-base font-mono">{admin._id}</p>
                </div>
              </div>

              {/* Name */}
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Nama
                  </p>
                  <p className="text-base">{admin.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-base">{admin.email}</p>
                </div>
              </div>

              {/* Created At */}
              {admin.createdAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Tanggal Bergabung
                    </p>
                    <p className="text-base">{formatDate(admin.createdAt)}</p>
                  </div>
                </div>
              )}

              {/* Updated At */}
              {admin.updatedAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Terakhir Diperbarui
                    </p>
                    <p className="text-base">{formatDate(admin.updatedAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role & Permissions
              </CardTitle>
              <CardDescription>
                Level akses yang dimiliki admin ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Role:
                  </span>
                  {getRoleBadge(admin.role)}
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  {admin.role === "super_admin" ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-600">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="font-semibold">Super Admin</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Admin ini memiliki akses penuh ke seluruh sistem:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Dapat menambah admin baru
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Dapat menghapus admin lain
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Dapat mengubah role admin lain
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Akses ke semua fitur sistem
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <span className="font-semibold">Admin Biasa</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Admin ini memiliki akses standar:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Mengelola events, donations, expenses
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Melihat dan membuat reports
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Mengelola users (anggota)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Tidak dapat mengelola akun admin
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
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
                onClick={() => navigate(`/admin/admins/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Admin
              </Button>
              {isSuperAdmin && !isViewingSelf && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Admin
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Akun Aktif
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDetail;



