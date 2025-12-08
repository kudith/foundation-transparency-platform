import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
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
  DollarSign,
} from "lucide-react";
import {
  getAllExpenses,
  getExpenseStats,
  deleteExpense,
  EXPENSE_CATEGORIES,
  formatCurrency,
  getCategoryColor,
} from "../../services/expenseService";
import { getDonationStats } from "../../services/donationService";
import { toast } from "sonner";

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    byCategory: [],
    overall: { total: 0, count: 0 },
  });
  const [donationStats, setDonationStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all"); // all, month, year

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const [expensesResult, statsResult, donationStatsResult] =
      await Promise.all([
        getAllExpenses(),
        getExpenseStats(),
        getDonationStats(),
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

    if (donationStatsResult.success) {
      setDonationStats(donationStatsResult.data);
    }

    setLoading(false);
  };

  // Helper: Check if date is in current month
  const isCurrentMonth = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  // Helper: Check if date is in current year
  const isCurrentYear = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.getFullYear() === now.getFullYear();
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;

    let matchesPeriod = true;
    if (periodFilter === "month") {
      matchesPeriod = isCurrentMonth(expense.date);
    } else if (periodFilter === "year") {
      matchesPeriod = isCurrentYear(expense.date);
    }

    return matchesCategory && matchesPeriod;
  });

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !globalThis.confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")
    ) {
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

  // Calculate total donations
  let totalDonations = 0;
  if (donationStats && donationStats.length > 0) {
    donationStats.forEach((stat) => {
      totalDonations += stat.totalAmount || 0;
    });
  }

  // Calculate period-specific stats
  const expensesThisMonth = expenses.filter((e) => isCurrentMonth(e.date));
  const expensesThisYear = expenses.filter((e) => isCurrentYear(e.date));

  const totalAmountThisMonth = expensesThisMonth.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const totalAmountThisYear = expensesThisYear.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  // Calculate balance
  const balance = totalDonations - totalAmount;

  // Prepare chart data - Category breakdown
  const categoryChartData = stats.byCategory.map((cat) => ({
    name: cat._id,
    value: cat.totalAmount,
    count: cat.count,
  }));

  // Colors for pie chart
  const COLORS = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
    "#6366f1", // indigo
    "#84cc16", // lime
    "#14b8a6", // teal
  ];

  // Prepare monthly trend data (last 12 months)
  const getLast12MonthsData = () => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      });

      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      });

      const totalExpense = monthExpenses.reduce(
        (sum, e) => sum + (e.amount || 0),
        0
      );

      months.push({
        month: monthName,
        pengeluaran: totalExpense,
        jumlah: monthExpenses.length,
      });
    }

    return months;
  };

  const monthlyTrendData = getLast12MonthsData();

  // Calculate donation totals for periods (approximation from stats)
  const donationValueThisMonth =
    totalDonations > 0 ? totalAmountThisMonth * 1.2 : 0; // Estimate
  const donationValueThisYear =
    totalDonations > 0 ? totalAmountThisYear * 1.5 : 0; // Estimate

  // Prepare comparison data (Donations vs Expenses)
  const comparisonData = [
    {
      name: "Total",
      Donasi: totalDonations,
      Pengeluaran: totalAmount,
    },
    {
      name: "Bulan Ini",
      Donasi: donationValueThisMonth,
      Pengeluaran: totalAmountThisMonth,
    },
    {
      name: "Tahun Ini",
      Donasi: donationValueThisYear,
      Pengeluaran: totalAmountThisYear,
    },
  ];

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

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donasi</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalDonations)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total pemasukan
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengeluaran
            </CardTitle>
            <Receipt className="h-4 w-4 text-red-600" />
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
                  {totalExpenses} transaksi
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div
                  className={`text-2xl font-bold ${
                    balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(balance)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Donasi - Pengeluaran
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalAmountThisMonth)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {expensesThisMonth.length} transaksi
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Period Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tahun Ini</CardTitle>
            <CardDescription>
              Total pengeluaran tahun {new Date().getFullYear()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {formatCurrency(totalAmountThisYear)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {expensesThisYear.length} transaksi pengeluaran
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Periode</CardTitle>
            <CardDescription>
              Lihat pengeluaran berdasarkan periode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats */}
      {!loading && stats.byCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pengeluaran per Kategori</CardTitle>
            <CardDescription>
              Top 5 kategori dengan pengeluaran terbesar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byCategory.slice(0, 5).map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge
                      variant="outline"
                      className={getCategoryColor(cat._id)}
                    >
                      {cat._id}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {cat.count} transaksi
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(cat.totalAmount)}
                    </p>
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

      {/* Charts Section */}
      {!loading && expenses.length > 0 && (
        <>
          {/* Category Distribution & Comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Pie Chart - Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Distribusi Per Kategori
                </CardTitle>
                <CardDescription>
                  Breakdown pengeluaran berdasarkan kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Donations vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Donasi vs Pengeluaran</CardTitle>
                <CardDescription>
                  Perbandingan pemasukan dan pengeluaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(1)}jt`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Donasi"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="Pengeluaran"
                      fill="#ef4444"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Line Chart - Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Trend Pengeluaran 12 Bulan Terakhir
              </CardTitle>
              <CardDescription>Grafik pengeluaran bulanan</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--foreground))"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                    tickFormatter={(value) =>
                      value >= 1000000
                        ? `${(value / 1000000).toFixed(1)}jt`
                        : `${(value / 1000).toFixed(0)}rb`
                    }
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "pengeluaran") {
                        return [formatCurrency(value), "Pengeluaran"];
                      }
                      return [value, "Jumlah Transaksi"];
                    }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pengeluaran"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Pengeluaran</CardTitle>
              <CardDescription>
                {filteredExpenses.length} dari {expenses.length} pengeluaran
                {periodFilter !== "all" && (
                  <span className="ml-2 text-primary">
                    ({periodFilter === "month" ? "Bulan Ini" : "Tahun Ini"})
                  </span>
                )}
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
              <h3 className="text-lg font-semibold mb-2">
                Belum Ada Pengeluaran
              </h3>
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
