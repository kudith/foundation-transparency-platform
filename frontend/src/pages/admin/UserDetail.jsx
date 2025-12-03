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
  User,
  Users as UsersIcon,
  Briefcase,
  Calendar,
  MapPin,
  IdCard,
} from "lucide-react";
import { getUserById, deleteUser } from "../../services/userService";
import { toast } from "sonner";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    const result = await getUserById(id);

    if (result.success) {
      setUser(result.data);
    } else {
      setError(result.error);
      toast.error(result.error || "Gagal memuat data user");
    }

    setLoading(false);
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
                className="w-full text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus User
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;


