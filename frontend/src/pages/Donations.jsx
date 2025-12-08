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
  DollarSign,
  Gift,
  TrendingUp,
  Calendar,
  Users,
  Heart,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
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
} from "recharts";
import {
  getAllExpenses,
  getExpenseStats,
  formatCurrency,
  getCategoryColor,
} from "../services/expenseService";
import { getDonationStats } from "../services/donationService";

const Donations = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [expenseStats, setExpenseStats] = useState(null);
  const [donationStats, setDonationStats] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [expensesResult, statsResult, donationStatsResult] =
      await Promise.all([
        getAllExpenses(),
        getExpenseStats(),
        getDonationStats(),
      ]);

    if (expensesResult.success) {
      const sortedExpenses = expensesResult.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
      setExpenses(sortedExpenses);
    }

    if (statsResult.success) {
      setExpenseStats(statsResult.data);
    }

    if (donationStatsResult.success) {
      setDonationStats(donationStatsResult.data);
    }

    setLoading(false);
  };

  // Calculate totals
  let totalDonations = 0;
  let totalCash = 0;
  let totalInKind = 0;
  let cashCount = 0;
  let inKindCount = 0;

  if (donationStats && donationStats.length > 0) {
    donationStats.forEach((stat) => {
      totalDonations += stat.totalAmount || 0;
      if (stat._id === "Cash") {
        totalCash = stat.totalAmount || 0;
        cashCount = stat.count || 0;
      } else if (stat._id === "InKind") {
        totalInKind = stat.totalAmount || 0;
        inKindCount = stat.count || 0;
      }
    });
  }

  const totalExpenses = expenseStats?.overall?.total || 0;
  const balance = totalDonations - totalExpenses;

  // Chart data
  const donationTypeData = [
    { name: "Uang Tunai", value: totalCash },
    { name: "Barang/Jasa", value: totalInKind },
  ].filter((item) => item.value > 0);

  const categoryChartData = expenseStats?.byCategory?.map((cat) => ({
    name: cat._id,
    value: cat.totalAmount || 0,
  })) || [];

  const comparisonData = [
    { name: "Total Donasi", Jumlah: totalDonations },
    { name: "Total Pengeluaran", Jumlah: totalExpenses },
    { name: "Saldo", Jumlah: balance },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#06b6d4", "#f97316"];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex flex-col flex-1">
        {/* Hero Section */}
        <section className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-4 text-center md:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Transparansi Keuangan
            </p>
            <h1 className="mt-6 font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Donasi & Pengeluaran
            </h1>
            <p className="mt-6 font-serif text-lg text-muted-foreground md:text-xl">
              Akses informasi lengkap tentang pemasukan donasi dan pengeluaran yayasan.
              Kami berkomitmen untuk transparansi penuh dalam pengelolaan dana.
            </p>
          </div>
        </section>

        {/* Donation CTA Section */}
        <section className="py-16 px-4 md:px-6 bg-primary/5">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Info Card */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary" />
                    Dukung Kami
                  </CardTitle>
                  <CardDescription>
                    Donasi Anda membantu kami memberdayakan lebih banyak individu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Setiap kontribusi Anda, baik dalam bentuk uang tunai maupun
                    barang/jasa, sangat berarti untuk keberlangsungan program-program
                    pemberdayaan kami.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Donasi Tunai</p>
                        <p className="text-muted-foreground">Transfer bank atau e-wallet</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Gift className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Donasi Barang/Jasa</p>
                        <p className="text-muted-foreground">Peralatan, konsumsi, atau keahlian</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="bg-primary text-primary-foreground border-primary">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Informasi Donasi
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Hubungi kami untuk berdonasi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-semibold">Transfer Bank</p>
                        <p className="text-sm text-primary-foreground/80">
                          BCA: 1234567890
                          <br />
                          a.n. Yayasan Veritas Pelita Nusantara
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-semibold">WhatsApp</p>
                        <p className="text-sm text-primary-foreground/80">
                          +62 851-7698-7693
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-primary-foreground/80">
                          info@veritas.or.id
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="w-full mt-4"
                    asChild
                  >
                    <a href="https://wa.me/6285176987693?text=Halo,%20saya%20ingin%20berdonasi" target="_blank" rel="noopener noreferrer">
                      <Phone className="h-4 w-4 mr-2" />
                      Hubungi via WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Financial Transparency Section */}
        <section className="py-16 px-4 md:px-6">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Transparansi Keuangan
              </h2>
              <p className="mt-4 font-serif text-base text-muted-foreground max-w-2xl mx-auto">
                Lihat secara terbuka bagaimana donasi Anda dikelola dan digunakan
                untuk program pemberdayaan.
              </p>
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
                        {cashCount + inKindCount} donasi diterima
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(totalExpenses)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {expenseStats?.overall?.count || 0} transaksi
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                  <TrendingUp className={`h-4 w-4 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <>
                      <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                  <CardTitle className="text-sm font-medium">Uang Tunai</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalCash)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cashCount} donasi tunai
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            {!loading && (
              <div className="grid gap-4 md:grid-cols-2">
                {/* Donation Type Distribution */}
                {donationTypeData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-xl">
                        Distribusi Donasi
                      </CardTitle>
                      <CardDescription>
                        Perbandingan donasi tunai vs barang/jasa
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={donationTypeData}
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
                            {donationTypeData.map((entry, index) => (
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
                )}

                {/* Financial Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">
                      Perbandingan Keuangan
                    </CardTitle>
                    <CardDescription>
                      Donasi vs Pengeluaran vs Saldo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                        <Bar dataKey="Jumlah" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                          {comparisonData.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={
                                entry.name === "Total Donasi"
                                  ? "#10b981"
                                  : entry.name === "Total Pengeluaran"
                                  ? "#ef4444"
                                  : balance >= 0
                                  ? "#10b981"
                                  : "#ef4444"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Expense Category Distribution */}
            {!loading && categoryChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Distribusi Pengeluaran Per Kategori
                  </CardTitle>
                  <CardDescription>
                    Ke mana dana yayasan digunakan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={120}
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
            )}

            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Pengeluaran Terbaru
                </CardTitle>
                <CardDescription>
                  10 transaksi pengeluaran terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                      </div>
                    ))}
                  </div>
                ) : expenses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Belum ada data pengeluaran
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((expense) => (
                      <div
                        key={expense._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">
                              {expense.description}
                            </h4>
                            <Badge
                              variant="outline"
                              className={getCategoryColor(expense.category)}
                            >
                              {expense.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(expense.date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            {expense.program && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {expense.program}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {formatCurrency(expense.amount)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            {!loading &&
              expenseStats &&
              expenseStats.byCategory &&
              expenseStats.byCategory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">
                      Detail Pengeluaran Per Kategori
                    </CardTitle>
                    <CardDescription>
                      Breakdown lengkap pengeluaran
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {expenseStats.byCategory.map((cat) => {
                        const amount = cat.totalAmount || 0;
                        const percentage = (
                          (amount / (expenseStats.overall?.total || 1)) *
                          100
                        ).toFixed(1);
                        return (
                          <div key={cat._id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={getCategoryColor(cat._id)}
                                >
                                  {cat._id}
                                </Badge>
                                <span className="text-muted-foreground">
                                  {cat.count} transaksi
                                </span>
                              </div>
                              <div className="font-semibold">
                                {formatCurrency(amount)} ({percentage}%)
                              </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donations;

