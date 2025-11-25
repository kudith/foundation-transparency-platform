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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ArrowLeft, Save, Loader } from "lucide-react";
import {
  getExpenseById,
  createExpense,
  updateExpense,
  EXPENSE_CATEGORIES,
} from "../../services/expenseService";
import { toast } from "sonner";

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  // Load expense data if editing
  useEffect(() => {
    if (isEdit) {
      loadExpense();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadExpense = async () => {
    setLoading(true);
    const result = await getExpenseById(id);

    if (result.success) {
      const expense = result.data;
      setFormData({
        category: expense.category,
        amount: expense.amount.toString(),
        description: expense.description || "",
        date: new Date(expense.date).toISOString().split("T")[0],
      });
    } else {
      toast.error(result.error || "Gagal memuat data pengeluaran");
      navigate("/admin/expenses");
    }

    setLoading(false);
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle currency input with formatting
  const handleCurrencyChange = (field, value) => {
    // Remove non-numeric characters
    const numericValue = value.replaceAll(/\D/g, "");
    handleChange(field, numericValue);
  };

  // Format number with thousand separators
  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("id-ID");
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = "Kategori wajib dipilih";
    }

    if (!formData.amount) {
      newErrors.amount = "Jumlah wajib diisi";
    } else if (
      Number.isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Jumlah harus angka positif";
    }

    if (!formData.date) {
      newErrors.date = "Tanggal wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setSubmitting(true);

    // Prepare data
    const expenseData = {
      category: formData.category,
      amount: Number(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
    };

    const result = isEdit
      ? await updateExpense(id, expenseData)
      : await createExpense(expenseData);

    if (result.success) {
      toast.success(result.message);
      navigate("/admin/expenses");
    } else {
      toast.error(result.error);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
            {isEdit ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit
              ? "Perbarui data pengeluaran"
              : "Tambahkan pengeluaran baru ke sistem"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengeluaran</CardTitle>
            <CardDescription>
              Lengkapi form di bawah untuk {isEdit ? "memperbarui" : "menambah"}{" "}
              pengeluaran
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Jumlah (IDR) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  Rp
                </span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="1.000.000"
                  value={formatNumber(formData.amount)}
                  onChange={(e) => handleCurrencyChange("amount", e.target.value)}
                  className={`pl-10 ${errors.amount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount}</p>
              )}
              {formData.amount && !errors.amount && (
                <p className="text-xs text-muted-foreground">
                  Total: Rp {formatNumber(formData.amount)}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">
                Tanggal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Deskripsi <span className="text-muted-foreground">(Opsional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Jelaskan detail pengeluaran ini..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Tambahkan informasi tambahan tentang pengeluaran ini
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/expenses")}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Perbarui" : "Simpan"} Pengeluaran
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;

