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
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { getAllAdmins, deleteAdmin } from "../../services/adminService";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";

const Admins = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "super_admin";

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const result = await getAllAdmins();

    if (result.success) {
      setAdmins(result.data);
    } else {
      setError(result.error);
      toast.error(result.error || "Gagal memuat data admin");
    }

    setLoading(false);
  };

  // Filter admins
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || admin.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Handle delete
  const handleDelete = async (id, adminName) => {
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
      !globalThis.confirm(`Apakah Anda yakin ingin menghapus admin "${adminName}"?`)
    ) {
      return;
    }

    const result = await deleteAdmin(id);
    if (result.success) {
      toast.success(result.message || "Admin berhasil dihapus");
      fetchData();
    } else {
      toast.error(result.error || "Gagal menghapus admin");
    }
  };

  // Calculate stats
  const totalAdmins = admins.length;
  const superAdminCount = admins.filter((a) => a.role === "super_admin").length;
  const regularAdminCount = admins.filter((a) => a.role === "admin").length;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Manajemen Admin
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola akun admin dan super admin
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
          {isSuperAdmin && (
            <Button
              className="gap-2"
              onClick={() => navigate("/admin/admins/new")}
            >
              <Plus className="h-4 w-4" />
              Tambah Admin
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalAdmins}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Akun admin terdaftar
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Super Admin</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-amber-600">
                  {superAdminCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dengan akses penuh
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admin Biasa</CardTitle>
            <Filter className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {regularAdminCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Admin standar
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
              <CardTitle>Daftar Admin</CardTitle>
              <CardDescription>
                {filteredAdmins.length} dari {admins.length} admin
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
                placeholder="Cari admin (nama atau email)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Shield className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
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
              <Button onClick={fetchData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && admins.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Admin</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mulai dengan menambahkan admin pertama
              </p>
              {isSuperAdmin && (
                <Button onClick={() => navigate("/admin/admins/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Admin
                </Button>
              )}
            </div>
          )}

          {/* Admin List */}
          {!loading && !error && filteredAdmins.length > 0 && (
            <div className="space-y-3">
              {filteredAdmins.map((admin) => (
                <Card
                  key={admin._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{admin.name}</h3>
                          {getRoleBadge(admin.role)}
                          {(admin._id === user?._id || admin._id === user?.id) && (
                            <Badge variant="outline" className="text-xs">
                              Anda
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4" />
                            <span>{admin.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>Bergabung {formatDate(admin.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/admins/${admin._id}`)}
                        >
                          Detail
                        </Button>
                        {/* Only super_admin can edit roles, but anyone can edit basic info */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/admins/${admin._id}/edit`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* Only super_admin can delete, and cannot delete self */}
                        {isSuperAdmin &&
                          admin._id !== user?._id &&
                          admin._id !== user?.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(admin._id, admin.name)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            admins.length > 0 &&
            filteredAdmins.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tidak ada admin yang sesuai dengan filter Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("all");
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

export default Admins;

