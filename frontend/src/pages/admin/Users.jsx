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
  User,
  Users as UsersIcon,
  Briefcase,
  Calendar,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { getAllUsers, deleteUser } from "../../services/userService";
import { toast } from "sonner";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [communityFilter, setCommunityFilter] = useState("all");
  const [statusPekerjaanFilter, setStatusPekerjaanFilter] = useState("all");
  const [kategoriUsiaFilter, setKategoriUsiaFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const result = await getAllUsers();

    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error);
      toast.error(result.error || "Gagal memuat data users");
    }

    setLoading(false);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCommunity =
      communityFilter === "all" ||
      (user.communities || []).includes(communityFilter);

    const matchesStatusPekerjaan =
      statusPekerjaanFilter === "all" ||
      user.statusPekerjaan === statusPekerjaanFilter;

    const matchesKategoriUsia =
      kategoriUsiaFilter === "all" || user.kategoriUsia === kategoriUsiaFilter;

    return (
      matchesSearch &&
      matchesCommunity &&
      matchesStatusPekerjaan &&
      matchesKategoriUsia
    );
  });

  // Get unique communities
  const communities = [
    ...new Set(users.flatMap((u) => u.communities || [])),
  ].sort();

  // Get unique status pekerjaan
  const statusPekerjaanOptions = [
    "Pelajar",
    "Mahasiswa",
    "Pekerja",
    "Wirausaha",
    "Lainnya",
  ];

  // Get unique kategori usia
  const kategoriUsiaOptions = ["<18", "18-25", "26-35", "36-45", ">45"];

  // Handle delete
  const handleDelete = async (id) => {
    if (!globalThis.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      return;
    }

    const result = await deleteUser(id);
    if (result.success) {
      toast.success(result.message || "User berhasil dihapus");
      fetchData();
    } else {
      toast.error(result.error || "Gagal menghapus user");
    }
  };

  // Calculate stats
  const totalUsers = users.length;
  const usersWithCommunities = users.filter(
    (u) => (u.communities || []).length > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Users
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola semua user dan anggota organisasi
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
            onClick={() => navigate("/admin/users/new")}
          >
            <Plus className="h-4 w-4" />
            Tambah User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  User terdaftar
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Dengan Komunitas
            </CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {usersWithCommunities}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  User dengan komunitas
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Filtered</CardTitle>
            <Filter className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {filteredUsers.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hasil filter
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
              <CardTitle>Daftar Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} dari {users.length} user
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
                placeholder="Cari user (nama atau ID)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Community Filter */}
            <Select value={communityFilter} onValueChange={setCommunityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <UsersIcon className="h-4 w-4 mr-2" />
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

            {/* Status Pekerjaan Filter */}
            <Select
              value={statusPekerjaanFilter}
              onValueChange={setStatusPekerjaanFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status Pekerjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {statusPekerjaanOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Kategori Usia Filter */}
            <Select
              value={kategoriUsiaFilter}
              onValueChange={setKategoriUsiaFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategori Usia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Usia</SelectItem>
                {kategoriUsiaOptions.map((kategori) => (
                  <SelectItem key={kategori} value={kategori}>
                    {kategori}
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
              <Button onClick={fetchData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada User</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mulai dengan menambahkan user pertama Anda
              </p>
              <Button onClick={() => navigate("/admin/users/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah User
              </Button>
            </div>
          )}

          {/* Users List */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <Card key={user._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          {user.roles && user.roles.length > 0 && (
                            <Badge variant="outline">
                              {user.roles.join(", ")}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <span className="font-mono text-xs">{user._id}</span>
                          </div>
                          {user.communities && user.communities.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <UsersIcon className="h-4 w-4" />
                              <span>{user.communities.join(", ")}</span>
                            </div>
                          )}
                          {user.statusPekerjaan && (
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="h-4 w-4" />
                              <span>{user.statusPekerjaan}</span>
                            </div>
                          )}
                          {user.kategoriUsia && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>{user.kategoriUsia}</span>
                            </div>
                          )}
                          {user.domisili && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{user.domisili}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/users/${user._id}/edit`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
            users.length > 0 &&
            filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tidak ada user yang sesuai dengan filter Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setCommunityFilter("all");
                    setStatusPekerjaanFilter("all");
                    setKategoriUsiaFilter("all");
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

export default Users;





