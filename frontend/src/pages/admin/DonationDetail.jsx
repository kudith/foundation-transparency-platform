import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Gift,
  Calendar,
  Tag,
  FileText,
  Building,
} from "lucide-react";
import {
  getDonationById,
  deleteDonation,
  DONATION_TYPES,
  formatCurrency,
} from "../../services/donationService";
import { toast } from "sonner";

const DonationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonation();
  }, [id]);

  const loadDonation = async () => {
    setLoading(true);
    const result = await getDonationById(id);

    if (result.success) {
      setDonation(result.data);
    } else {
      toast.error(result.error || "Gagal memuat data donasi");
      navigate("/admin/donations");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!globalThis.confirm("Apakah Anda yakin ingin menghapus donasi ini?")) {
      return;
    }

    const result = await deleteDonation(id);
    if (result.success) {
      toast.success(result.message || "Donasi berhasil dihapus");
      navigate("/admin/donations");
    } else {
      toast.error(result.error || "Gagal menghapus donasi");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!donation) {
    return null;
  }

  const typeConfig = DONATION_TYPES[donation.donationType];
  const value =
    donation.donationType === "Cash"
      ? donation.cashDetails?.amount
      : donation.inKindDetails?.estimatedValue;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/donations")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Detail Donasi
            </h1>
            <p className="text-muted-foreground mt-2">
              Informasi lengkap tentang donasi
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/donations/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{donation.source}</CardTitle>
                <Badge variant="outline" className={typeConfig.color}>
                  {typeConfig.label}
                </Badge>
              </div>
              <CardDescription>{typeConfig.description}</CardDescription>
            </div>
            <div
              className={`h-16 w-16 rounded-lg ${
                donation.donationType === "Cash"
                  ? "bg-green-500/10"
                  : "bg-blue-500/10"
              } flex items-center justify-center`}
            >
              {donation.donationType === "Cash" ? (
                <DollarSign className="h-8 w-8 text-green-600" />
              ) : (
                <Gift className="h-8 w-8 text-blue-600" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Value Display */}
          <div className="p-6 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {donation.donationType === "Cash"
                ? "Jumlah Donasi"
                : "Estimasi Nilai"}
            </p>
            <p className="text-4xl font-bold text-foreground">
              {formatCurrency(value)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Program */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>Program</span>
              </div>
              <p className="text-base font-medium">{donation.program}</p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Tanggal</span>
              </div>
              <p className="text-base font-medium">
                {formatDate(donation.date)}
              </p>
            </div>

            {/* Cash Amount (if Cash) */}
            {donation.donationType === "Cash" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Jumlah Uang Tunai</span>
                </div>
                <p className="text-base font-medium">
                  {formatCurrency(donation.cashDetails.amount)}
                </p>
              </div>
            )}

            {/* InKind Details */}
            {donation.donationType === "InKind" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Kategori</span>
                  </div>
                  <p className="text-base font-medium">
                    {donation.inKindDetails.category}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gift className="h-4 w-4" />
                    <span>Estimasi Nilai</span>
                  </div>
                  <p className="text-base font-medium">
                    {formatCurrency(donation.inKindDetails.estimatedValue)}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* InKind Description (full width) */}
          {donation.donationType === "InKind" && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Deskripsi Barang/Jasa</span>
              </div>
              <p className="text-base leading-relaxed">
                {donation.inKindDetails.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <span className="text-muted-foreground">ID Donasi:</span>
              <p className="font-mono text-xs mt-1">{donation._id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tipe:</span>
              <p className="mt-1">{donation.donationType}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationDetail;

