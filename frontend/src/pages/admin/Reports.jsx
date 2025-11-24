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
  Download,
  FileText,
  Clock,
  Loader,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  UserCheck,
  TrendingUp,
  Filter,
  Trash2,
  Calendar,
} from "lucide-react";
import {
  getAllReports,
  deleteReport,
  enqueueReport,
  REPORT_TYPES,
  REPORT_STATUS,
} from "../../services/reportService";
import { toast } from "sonner";

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const reportsResult = await getAllReports();

    if (reportsResult.success) {
      setReports(reportsResult.data);
    } else {
      setError(reportsResult.error);
      toast.error(reportsResult.error || "Gagal memuat data report");
    }

    setLoading(false);
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    return matchesType && matchesStatus;
  });

  // Get icon component
  const getIconComponent = (iconName) => {
    const icons = {
      DollarSign,
      Users,
      UserCheck,
      TrendingUp,
      Clock,
      Loader,
      CheckCircle,
      XCircle,
      FileText,
    };
    return icons[iconName] || FileText;
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!globalThis.confirm("Apakah Anda yakin ingin menghapus report ini?")) {
      return;
    }

    const result = await deleteReport(id);
    if (result.success) {
      toast.success(result.message || "Report berhasil dihapus");
      fetchData();
    } else {
      toast.error(result.error || "Gagal menghapus report");
    }
  };

  // Handle retry - re-enqueue failed report
  const handleRetry = async (id) => {
    if (
      !globalThis.confirm(
        "Proses ulang report ini? Report akan dimasukkan ke antrian worker."
      )
    ) {
      return;
    }

    const result = await enqueueReport(id);
    if (result.success) {
      toast.success(
        "Report berhasil dimasukkan ke antrian untuk diproses ulang"
      );
      // Refresh after short delay to show status change
      setTimeout(() => fetchData(), 500);
    } else {
      toast.error(result.error || "Gagal memproses report");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
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

  // Stats cards
  const totalReports = reports.length;
  const completedReports = reports.filter(
    (r) => r.status === "completed"
  ).length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const failedReports = reports.filter((r) => r.status === "failed").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate dan kelola laporan sistem
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
            onClick={() => navigate("/admin/reports/generate")}
          >
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted border">
        <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">Status Dikelola Otomatis</p>
          <p className="text-muted-foreground">
            Status report (pending → processing → completed/failed) dikelola
            otomatis oleh worker. Klik tombol refresh untuk melihat status
            terbaru.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalReports}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total laporan
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {completedReports}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Siap diunduh
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingReports}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sedang diproses
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gagal</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">
                  {failedReports}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Perlu diproses ulang
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Reports</CardTitle>
              <CardDescription>
                {filteredReports.length} dari {reports.length} reports
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipe Report" />
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

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {Object.entries(REPORT_STATUS).map(([key, config]) => (
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
          {!loading && !error && reports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mulai dengan generate report pertama Anda
              </p>
              <Button onClick={() => navigate("/admin/reports/generate")}>
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          )}

          {/* Reports List */}
          {!loading && !error && filteredReports.length > 0 && (
            <div className="space-y-3">
              {filteredReports.map((report) => {
                const reportConfig = REPORT_TYPES[report.type];
                const statusConfig = REPORT_STATUS[report.status];
                const TypeIcon = getIconComponent(reportConfig?.icon);
                const StatusIcon = getIconComponent(statusConfig?.icon);

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
                            className={statusConfig?.color}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig?.label || report.status}
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
                        {report.errorMsg && (
                          <p className="text-xs text-destructive mt-2">
                            Error: {report.errorMsg}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {report.status === "completed" && report.fileURL && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            globalThis.open(report.fileURL, "_blank")
                          }
                          title="Download report yang sudah selesai"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {report.status === "processing" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled
                          title="Report sedang diproses oleh worker"
                        >
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Diproses...
                        </Button>
                      )}
                      {report.status === "failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetry(report._id)}
                          title="Proses ulang report yang gagal (akan di-enqueue ke worker)"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(report._id)}
                        title="Hapus report"
                        disabled={report.status === "processing"}
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
            reports.length > 0 &&
            filteredReports.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tidak ada report yang sesuai dengan filter Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTypeFilter("all");
                    setStatusFilter("all");
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

export default Reports;
