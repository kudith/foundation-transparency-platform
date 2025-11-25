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
  Receipt,
  Calendar,
  Tag,
  FileText,
} from "lucide-react";
import {
  getExpenseById,
  deleteExpense,
  formatCurrency,
  getCategoryColor,
} from "../../services/expenseService";
import { toast } from "sonner";

const ExpenseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadExpense = async () => {
    setLoading(true);
    const result = await getExpenseById(id);

    if (result.success) {
      setExpense(result.data);
    } else {
      toast.error(result.error || "Gagal memuat data pengeluaran");
      navigate("/admin/expenses");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!globalThis.confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
      return;
    }

    const result = await deleteExpense(id);
    if (result.success) {
      toast.success(result.message || "Pengeluaran berhasil dihapus");
      navigate("/admin/expenses");
    } else {
      toast.error(result.error || "Gagal menghapus pengeluaran");
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

  if (!expense) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/expenses")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Detail Pengeluaran
            </h1>
            <p className="text-muted-foreground mt-2">
              Informasi lengkap tentang pengeluaran
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/expenses/${id}/edit`)}
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
                <CardTitle className="text-2xl">
                  {expense.description || "Pengeluaran"}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={getCategoryColor(expense.category)}
                >
                  {expense.category}
                </Badge>
              </div>
              <CardDescription>
                Transaksi pengeluaran organisasi
              </CardDescription>
            </div>
            <div className="h-16 w-16 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Receipt className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Display */}
          <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg text-center border border-red-200 dark:border-red-900">
            <p className="text-sm text-muted-foreground mb-2">
              Total Pengeluaran
            </p>
            <p className="text-4xl font-bold text-red-600">
              {formatCurrency(expense.amount)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Kategori</span>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className={`${getCategoryColor(expense.category)} text-base py-1.5 px-3`}
                >
                  {expense.category}
                </Badge>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Tanggal</span>
              </div>
              <p className="text-base font-medium">
                {formatDate(expense.date)}
              </p>
            </div>
          </div>

          {/* Description (full width) */}
          {expense.description && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Deskripsi</span>
              </div>
              <p className="text-base leading-relaxed">
                {expense.description}
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
              <span className="text-muted-foreground">ID Pengeluaran:</span>
              <p className="font-mono text-xs mt-1">{expense._id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Jumlah:</span>
              <p className="mt-1 font-semibold text-red-600">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseDetail;

