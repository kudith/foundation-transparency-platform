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
  Receipt,
  TrendingUp,
  Filter,
  Calendar,
} from "lucide-react";
import {
  getAllExpenses,
  getExpenseStats,
  deleteExpense,
  EXPENSE_CATEGORIES,
  formatCurrency,
  getCategoryColor,
} from "../../services/expenseService";
import { toast } from "sonner";

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ byCategory: [], overall: { total: 0, count: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const [expensesResult, statsResult] = await Promise.all([
      getAllExpenses(),
      getExpenseStats(),
    ]);

    if (expensesResult.success) {
      setExpenses(expensesResult.data);
    } else {
      setError(expensesResult.error);
      toast.error(expensesResult.error || "Gagal memuat data pengeluaran");
    }

    if (statsResult.success) {
      setStats(statsResult.data);
    }

    setLoading(false);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    return matchesCategory;
  });

  // Handle delete
  const handleDelete = async (id) => {
    if (!globalThis.confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
      return;
    }

    const result = await deleteExpense(id);
    if (result.success) {
      toast.success(result.message || "Pengeluaran berhasil dihapus");
      fetchData();
    } else {
      toast.error(result.error || "Gagal menghapus pengeluaran");
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

  // Calculate totals
  const totalExpenses = stats.overall.count;
  const totalAmount = stats.overall.total;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Expenses
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola data pengeluaran organisasi
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
            onClick={() => navigate("/admin/expenses/new")}
          >
            <Plus className="h-4 w-4" />
            Tambah Pengeluaran
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalExpenses}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total transaksi
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalAmount)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total semua pengeluaran
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Stats */}
      {!loading && stats.byCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pengeluaran per Kategori</CardTitle>
            <CardDescription>Top 5 kategori dengan pengeluaran terbesar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byCategory.slice(0, 5).map((cat) => (
                <div key={cat._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className={getCategoryColor(cat._id)}>
                      {cat._id}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {cat.count} transaksi
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(cat.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">
                      Rata-rata: {formatCurrency(cat.avgAmount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Pengeluaran</CardTitle>
              <CardDescription>
                {filteredExpenses.length} dari {expenses.length} pengeluaran
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
          {!loading && !error && expenses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Pengeluaran</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mulai dengan menambahkan pengeluaran pertama
              </p>
              <Button onClick={() => navigate("/admin/expenses/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pengeluaran
              </Button>
            </div>
          )}

          {/* Expenses List */}
          {!loading && !error && filteredExpenses.length > 0 && (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => {
                return (
                  <div
                    key={expense._id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Receipt className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {expense.description || "Pengeluaran"}
                          </h3>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(expense.category)}
                          >
                            {expense.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(expense.date)}</span>
                          </div>
                          <span className="font-semibold text-red-600 text-sm">
                            {formatCurrency(expense.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/admin/expenses/${expense._id}`)
                        }
                        title="Lihat detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/admin/expenses/${expense._id}/edit`)
                        }
                        title="Edit pengeluaran"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(expense._id)}
                        title="Hapus pengeluaran"
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
            expenses.length > 0 &&
            filteredExpenses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tidak ada pengeluaran yang sesuai dengan filter Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategoryFilter("all");
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

export default Expenses;

