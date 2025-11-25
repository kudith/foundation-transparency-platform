import { useState, useEffect } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  RefreshCw,
  AlertCircle,
  Download,
  FileText,
  DollarSign,
  Users,
  UserCheck,
  TrendingUp,
  Filter,
  Calendar,
} from "lucide-react";
import { getAllReports, REPORT_TYPES } from "../services/reportService";
import { toast } from "sonner";

const PublicReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const reportsResult = await getAllReports();

    if (reportsResult.success) {
      // Hanya tampilkan report yang sudah completed
      const completedReports = reportsResult.data.filter(
        (report) => report.status === "completed" && report.fileURL
      );
      setReports(completedReports);
    } else {
      setError(reportsResult.error);
      toast.error(reportsResult.error || "Gagal memuat data laporan");
    }

    setLoading(false);
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    return matchesType;
  });

  // Get icon component
  const getIconComponent = (iconName) => {
    const icons = {
      DollarSign,
      Users,
      UserCheck,
      TrendingUp,
      FileText,
    };
    return icons[iconName] || FileText;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format filter display
  const formatFilters = (filters) => {
    const parts = [];
    if (filters.start_date && filters.end_date) {
      const start = new Date(filters.start_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const end = new Date(filters.end_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      parts.push(`${start} - ${end}`);
    }
    if (filters.community_name) {
      parts.push(
        filters.community_name === "all"
          ? "Semua Komunitas"
          : filters.community_name
      );
    }
    return parts.join(" • ");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex flex-col flex-1">
        {/* Hero Section */}
        <section className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-4 text-center md:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Transparansi Laporan
            </p>
            <h1 className="mt-6 font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Laporan Publik
            </h1>
            <p className="mt-6 font-serif text-lg text-muted-foreground md:text-xl">
              Akses dan unduh berbagai laporan organisasi kami. Kami berkomitmen
              untuk transparansi penuh dalam setiap aspek kegiatan kami.
            </p>
          </div>
        </section>

        {/* Reports Section */}
        <section className="py-16 px-4 md:px-6">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Page Header with Refresh Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Daftar Laporan
                </h2>
                <p className="text-muted-foreground mt-1">
                  {loading ? (
                    "Memuat laporan..."
                  ) : (
                    <>
                      {filteredReports.length} dari {reports.length} laporan
                      tersedia
                    </>
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchData}
                disabled={loading}
                title="Refresh data"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted border">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Laporan Terbaru</p>
                <p className="text-muted-foreground">
                  Semua laporan di halaman ini telah selesai diproses dan siap
                  untuk diunduh. Klik tombol "Unduh Laporan" untuk mengakses
                  file PDF.
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-medium">
                    Total Laporan Tersedia
                  </CardTitle>
                  <CardDescription>
                    Laporan yang telah selesai diproses
                  </CardDescription>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-12 w-24" />
                ) : (
                  <div className="text-4xl font-bold">{reports.length}</div>
                )}
              </CardContent>
            </Card>

            {/* Reports List Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Laporan</CardTitle>
                    <CardDescription>
                      Unduh laporan yang Anda perlukan
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-64">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tipe Laporan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      {Object.entries(REPORT_TYPES).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
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
                        <Skeleton className="h-9 w-32" />
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
                {!loading && !error && reports.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Belum Ada Laporan
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Saat ini belum ada laporan yang tersedia untuk diunduh.
                      Silakan cek kembali nanti.
                    </p>
                  </div>
                )}

                {/* Reports List */}
                {!loading && !error && filteredReports.length > 0 && (
                  <div className="space-y-3">
                    {filteredReports.map((report) => {
                      const reportConfig = REPORT_TYPES[report.type];
                      const TypeIcon = getIconComponent(reportConfig?.icon);

                      return (
                        <div
                          key={report._id}
                          className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <TypeIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold truncate">
                                  {reportConfig?.label || report.type}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 text-green-700 border-green-200"
                                >
                                  Selesai
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {reportConfig?.description}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(report.createdAt)}</span>
                                </div>
                                {report.filters && (
                                  <span>• {formatFilters(report.filters)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                globalThis.open(report.fileURL, "_blank")
                              }
                              title="Unduh laporan"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Unduh Laporan
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* No Results from Filter */}
                {!loading &&
                  !error &&
                  reports.length > 0 &&
                  filteredReports.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Tidak Ada Hasil
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tidak ada laporan yang sesuai dengan filter Anda
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTypeFilter("all");
                        }}
                      >
                        Reset Filter
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PublicReports;

