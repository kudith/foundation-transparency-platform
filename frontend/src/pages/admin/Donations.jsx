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
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Gift,
  Filter,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  getAllDonations,
  getDonationStats,
  deleteDonation,
  DONATION_TYPES,
  PROGRAMS,
  formatCurrency,
} from "../../services/donationService";
import { toast } from "sonner";

const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const [donationsResult, statsResult] = await Promise.all([
      getAllDonations(),
      getDonationStats(),
    ]);

    if (donationsResult.success) {
      setDonations(donationsResult.data);
    } else {
      setError(donationsResult.error);
      toast.error(donationsResult.error || "Gagal memuat data donasi");
    }

    if (statsResult.success) {
      setStats(statsResult.data);
    }

    setLoading(false);
  };

  // Filter donations
  const filteredDonations = donations.filter((donation) => {
    const matchesType =
      typeFilter === "all" || donation.donationType === typeFilter;
    const matchesProgram =
      programFilter === "all" || donation.program === programFilter;
    return matchesType && matchesProgram;
  });

  // Handle delete
  const handleDelete = async (id) => {
    if (!globalThis.confirm("Apakah Anda yakin ingin menghapus donasi ini?")) {
      return;
    }

    const result = await deleteDonation(id);
    if (result.success) {
      toast.success(result.message || "Donasi berhasil dihapus");
      fetchData();
    } else {
      toast.error(result.error || "Gagal menghapus donasi");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate total stats
  const totalCash = stats.find((s) => s._id === "Cash")?.totalAmount || 0;
  const totalInKind = stats.find((s) => s._id === "InKind")?.totalAmount || 0;
  const totalDonations = donations.length;
  const totalValue = totalCash + totalInKind;

  // Get donation value
  const getDonationValue = (donation) => {
    if (donation.donationType === "Cash") {
      return donation.cashDetails?.amount || 0;
    }
    return donation.inKindDetails?.estimatedValue || 0;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Donations
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola data donasi uang tunai dan barang/jasa
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
            onClick={() => navigate("/admin/donations/new")}
          >
            <Plus className="h-4 w-4" />
            Tambah Donasi
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donasi</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalDonations}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total semua donasi
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalValue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tunai + Estimasi Barang
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uang Tunai</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalCash)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.find((s) => s._id === "Cash")?.count || 0} donasi
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Barang/Jasa</CardTitle>
            <Gift className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalInKind)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.find((s) => s._id === "InKind")?.count || 0} donasi
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Donasi</CardTitle>
              <CardDescription>
                {filteredDonations.length} dari {donations.length} donasi
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipe Donasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                {Object.entries(DONATION_TYPES).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Program Filter */}
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Program</SelectItem>
                {PROGRAMS.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-9 w-24" />
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
          {!loading && !error && donations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Gift className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Donasi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mulai dengan menambahkan donasi pertama
              </p>
              <Button onClick={() => navigate("/admin/donations/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Donasi
              </Button>
            </div>
          )}

          {/* Donations List */}
          {!loading && !error && filteredDonations.length > 0 && (
            <div className="space-y-3">
              {filteredDonations.map((donation) => {
                const typeConfig = DONATION_TYPES[donation.donationType];
                const value = getDonationValue(donation);

                return (
                  <div
                    key={donation._id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`h-12 w-12 rounded-lg ${
                          donation.donationType === "Cash"
                            ? "bg-green-500/10"
                            : "bg-blue-500/10"
                        } flex items-center justify-center`}
                      >
                        {donation.donationType === "Cash" ? (
                          <DollarSign className="h-6 w-6 text-green-600" />
                        ) : (
                          <Gift className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{donation.source}</h3>
                          <Badge variant="outline" className={typeConfig.color}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Program: {donation.program}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(donation.date)}</span>
                          </div>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(value)}
                          </span>
                        </div>
                        {donation.donationType === "InKind" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {donation.inKindDetails?.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/admin/donations/${donation._id}`)
                        }
                        title="Lihat detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/admin/donations/${donation._id}/edit`)
                        }
                        title="Edit donasi"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(donation._id)}
                        title="Hapus donasi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            donations.length > 0 &&
            filteredDonations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tidak ada donasi yang sesuai dengan filter Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTypeFilter("all");
                    setProgramFilter("all");
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

export default Donations;
