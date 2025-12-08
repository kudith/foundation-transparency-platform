import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import {
  Users,
  DollarSign,
  TrendingDown,
  Trophy,
  ArrowRight,
  FileText,
  TrendingUp,
  Building2,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { getAllUsers } from "../../services/userService";
import {
  getAllDonations,
  getDonationStats,
} from "../../services/donationService";
import { getExpenseStats } from "../../services/expenseService";
import {
  getAllMilestones,
  getMilestoneStats,
} from "../../services/milestoneService";

// Format currency to IDR
const formatCurrency = (amount) => {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format full currency
const formatFullCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Milestone type config
const MILESTONE_TYPE_CONFIG = {
  project_submitted: {
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Project Submitted",
  },
  level_up: {
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Level Up",
  },
  job_placement: {
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    label: "Job Placement",
  },
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalExpenses: 0,
    totalMilestones: 0,
    balance: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentMilestones, setRecentMilestones] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // Fetch all data in parallel
      const [
        usersResult,
        donationsResult,
        donationStatsResult,
        expenseStatsResult,
        milestonesResult,
        milestoneStatsResult,
      ] = await Promise.all([
        getAllUsers(),
        getAllDonations(),
        getDonationStats(),
        getExpenseStats(),
        getAllMilestones(),
        getMilestoneStats(),
      ]);

      // Calculate total donations
      let totalDonations = 0;
      if (donationStatsResult.success && donationStatsResult.data) {
        donationStatsResult.data.forEach((stat) => {
          totalDonations += stat.totalAmount || 0;
        });
      }

      // Get total expenses
      const totalExpenses = expenseStatsResult.success
        ? expenseStatsResult.data?.overall?.total || 0
        : 0;

      // Set stats
      setStats({
        totalUsers: usersResult.success ? usersResult.data.length : 0,
        totalDonations,
        totalExpenses,
        totalMilestones: milestoneStatsResult.success
          ? milestoneStatsResult.data?.total || 0
          : 0,
        balance: totalDonations - totalExpenses,
      });

      // Set recent donations (last 5)
      if (donationsResult.success && donationsResult.data.length > 0) {
        const sorted = [...donationsResult.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRecentDonations(sorted.slice(0, 5));
      }

      // Set recent milestones (last 5)
      if (milestonesResult.success && milestonesResult.data.length > 0) {
        const sorted = [...milestonesResult.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRecentMilestones(sorted.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }

    setLoading(false);
  };

  // Get donation display value
  const getDonationAmount = (donation) => {
    if (donation.donationType === "Cash") {
      return donation.cashDetails?.amount || 0;
    }
    return donation.inKindDetails?.estimatedValue || 0;
  };

  // Get milestone display info
  const getMilestoneDisplay = (milestone) => {
    const config = MILESTONE_TYPE_CONFIG[milestone.type] || {
      icon: Trophy,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: milestone.type,
    };

    let title = "";
    switch (milestone.type) {
      case "project_submitted":
        title = milestone.detail?.title || "Project";
        break;
      case "level_up":
        title = `${milestone.detail?.from} → ${milestone.detail?.to}`;
        break;
      case "job_placement":
        title = `${milestone.detail?.role} @ ${milestone.detail?.company}`;
        break;
      default:
        title = "Milestone";
    }

    return { ...config, title };
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: "Total Peserta",
      value: stats.totalUsers,
      description: "Peserta terdaftar",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      link: "/admin/users",
    },
    {
      title: "Total Donasi",
      value: formatCurrency(stats.totalDonations),
      description: "Donasi terkumpul",
      icon: PiggyBank,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      link: "/admin/donations",
    },
    {
      title: "Total Pengeluaran",
      value: formatCurrency(stats.totalExpenses),
      description: "Pengeluaran tercatat",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      link: "/admin/expenses",
    },
    {
      title: "Saldo",
      value: formatCurrency(stats.balance),
      description: "Donasi - Pengeluaran",
      icon: Wallet,
      color: stats.balance >= 0 ? "text-emerald-600" : "text-red-600",
      bgColor: stats.balance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Selamat datang di panel administrasi Veritas Pelita Nusantara
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const CardWrapper = stat.link ? Link : "div";
          const cardProps = stat.link ? { to: stat.link } : {};

          return (
            <CardWrapper key={stat.title} {...cardProps}>
              <Card
                className={
                  stat.link
                    ? "hover:shadow-md transition-shadow cursor-pointer"
                    : ""
                }
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </CardWrapper>
          );
        })}
      </div>

      {/* Milestones Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Ringkasan Milestone
              </CardTitle>
              <CardDescription>
                Total {stats.totalMilestones} milestone tercatat
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(MILESTONE_TYPE_CONFIG).map(([type, config]) => {
              const Icon = config.icon;
              const count = recentMilestones.filter(
                (m) => m.type === type
              ).length;
              return (
                <div
                  key={type}
                  className={`p-4 rounded-lg ${config.bgColor} flex items-center gap-3`}
                >
                  <Icon className={`h-8 w-8 ${config.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">
                      {config.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Donasi Terbaru</CardTitle>
                <CardDescription>Donasi yang baru masuk</CardDescription>
              </div>
              <Link
                to="/admin/donations"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Lihat Semua
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentDonations.length > 0 ? (
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">
                          {donation.source}
                        </p>
                        <Badge
                          variant={
                            donation.donationType === "Cash"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs shrink-0"
                        >
                          {donation.donationType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(donation.date)} • {donation.program}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600 shrink-0 ml-2">
                      {formatFullCurrency(getDonationAmount(donation))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Belum ada donasi tercatat
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Milestones */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Milestone Terbaru</CardTitle>
                <CardDescription>Pencapaian peserta terbaru</CardDescription>
              </div>
              <Link
                to="/admin/users"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Lihat Users
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentMilestones.length > 0 ? (
              <div className="space-y-4">
                {recentMilestones.map((milestone) => {
                  const {
                    icon: Icon,
                    color,
                    bgColor,
                    title,
                    label,
                  } = getMilestoneDisplay(milestone);

                  return (
                    <div
                      key={milestone._id}
                      className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div
                        className={`h-9 w-9 rounded-full ${bgColor} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-xs">
                            {label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(milestone.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Belum ada milestone tercatat
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
