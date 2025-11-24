import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";

const Dashboard = () => {
  // Dummy data untuk statistik
  const stats = [
    {
      title: "Total Events",
      value: "12",
      description: "Events bulan ini",
      icon: Calendar,
      trend: "+2 dari bulan lalu",
    },
    {
      title: "Total Peserta",
      value: "248",
      description: "Peserta aktif",
      icon: Users,
      trend: "+18% dari bulan lalu",
    },
    {
      title: "Donasi Terkumpul",
      value: "Rp 45.2M",
      description: "Total donasi tahun ini",
      icon: DollarSign,
      trend: "+12% dari tahun lalu",
    },
    {
      title: "Pengeluaran",
      value: "Rp 32.8M",
      description: "Total pengeluaran tahun ini",
      icon: TrendingUp,
      trend: "8% dari budget",
    },
  ];

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
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-green-600 mt-2">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Terbaru</CardTitle>
            <CardDescription>Event yang akan datang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">Event {i}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Date.now() + i * 86400000).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Upcoming
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donasi Terbaru</CardTitle>
            <CardDescription>Donasi yang baru masuk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">Donatur {i}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Date.now() - i * 3600000).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    Rp{" "}
                    {(Math.random() * 5000000)
                      .toFixed(0)
                      .replaceAll(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
