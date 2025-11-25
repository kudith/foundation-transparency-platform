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
  getDonationById,
  createDonation,
  updateDonation,
  DONATION_TYPES,
  INKIND_CATEGORIES,
  PROGRAMS,
} from "../../services/donationService";
import { toast } from "sonner";

const DonationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    donationType: "Cash",
    source: "",
    program: "",
    date: new Date().toISOString().split("T")[0],
    // Cash fields
    cashAmount: "",
    // InKind fields
    inKindEstimatedValue: "",
    inKindDescription: "",
    inKindCategory: "",
  });

  const [errors, setErrors] = useState({});

  // Load donation data if editing
  useEffect(() => {
    if (isEdit) {
      loadDonation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDonation = async () => {
    setLoading(true);
    const result = await getDonationById(id);

    if (result.success) {
      const donation = result.data;
      setFormData({
        donationType: donation.donationType,
        source: donation.source,
        program: donation.program,
        date: new Date(donation.date).toISOString().split("T")[0],
        cashAmount: donation.cashDetails?.amount || "",
        inKindEstimatedValue: donation.inKindDetails?.estimatedValue || "",
        inKindDescription: donation.inKindDetails?.description || "",
        inKindCategory: donation.inKindDetails?.category || "",
      });
    } else {
      toast.error(result.error || "Gagal memuat data donasi");
      navigate("/admin/donations");
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

  // Handle donation type change
  const handleDonationTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      donationType: value,
      // Reset type-specific fields
      cashAmount: "",
      inKindEstimatedValue: "",
      inKindDescription: "",
      inKindCategory: "",
    }));
    setErrors({});
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.source?.trim()) {
      newErrors.source = "Sumber donasi wajib diisi";
    }

    if (!formData.program?.trim()) {
      newErrors.program = "Program wajib diisi";
    }

    if (!formData.date) {
      newErrors.date = "Tanggal wajib diisi";
    }

    if (formData.donationType === "Cash") {
      if (!formData.cashAmount) {
        newErrors.cashAmount = "Jumlah uang wajib diisi";
      } else if (
        Number.isNaN(Number(formData.cashAmount)) ||
        Number(formData.cashAmount) <= 0
      ) {
        newErrors.cashAmount = "Jumlah uang harus angka positif";
      }
    }

    if (formData.donationType === "InKind") {
      if (!formData.inKindEstimatedValue) {
        newErrors.inKindEstimatedValue = "Estimasi nilai wajib diisi";
      } else if (
        Number.isNaN(Number(formData.inKindEstimatedValue)) ||
        Number(formData.inKindEstimatedValue) <= 0
      ) {
        newErrors.inKindEstimatedValue = "Estimasi nilai harus angka positif";
      }

      if (!formData.inKindDescription?.trim()) {
        newErrors.inKindDescription = "Deskripsi barang/jasa wajib diisi";
      }

      if (!formData.inKindCategory) {
        newErrors.inKindCategory = "Kategori wajib dipilih";
      }
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
    const donationData = {
      donationType: formData.donationType,
      source: formData.source.trim(),
      program: formData.program.trim(),
      date: formData.date,
    };

    if (formData.donationType === "Cash") {
      donationData.cashDetails = {
        amount: Number(formData.cashAmount),
      };
    } else {
      donationData.inKindDetails = {
        estimatedValue: Number(formData.inKindEstimatedValue),
        description: formData.inKindDescription.trim(),
        category: formData.inKindCategory,
      };
    }

    const result = isEdit
      ? await updateDonation(id, donationData)
      : await createDonation(donationData);

    if (result.success) {
      toast.success(result.message);
      navigate("/admin/donations");
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
          onClick={() => navigate("/admin/donations")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {isEdit ? "Edit Donasi" : "Tambah Donasi"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit
              ? "Perbarui data donasi"
              : "Tambahkan donasi baru ke sistem"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Donasi</CardTitle>
            <CardDescription>
              Lengkapi form di bawah untuk {isEdit ? "memperbarui" : "menambah"}{" "}
              donasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Donation Type */}
            <div className="space-y-2">
              <Label htmlFor="donationType">
                Tipe Donasi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.donationType}
                onValueChange={handleDonationTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe donasi" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DONATION_TYPES).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label} - {config.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isEdit && (
                <p className="text-xs text-muted-foreground">
                  💡 Mengubah tipe donasi akan mereset field spesifik tipe
                </p>
              )}
            </div>

            {/* Source */}
            <div className="space-y-2">
              <Label htmlFor="source">
                Sumber Donasi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="source"
                placeholder="Contoh: Yayasan ABC, Perusahaan XYZ, Individu"
                value={formData.source}
                onChange={(e) => handleChange("source", e.target.value)}
                className={errors.source ? "border-red-500" : ""}
              />
              {errors.source && (
                <p className="text-xs text-red-500">{errors.source}</p>
              )}
            </div>

            {/* Program */}
            <div className="space-y-2">
              <Label htmlFor="program">
                Program <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.program}
                onValueChange={(value) => handleChange("program", value)}
              >
                <SelectTrigger
                  className={errors.program ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Pilih program" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMS.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.program && (
                <p className="text-xs text-red-500">{errors.program}</p>
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

            {/* Cash Details */}
            {formData.donationType === "Cash" && (
              <div className="space-y-2">
                <Label htmlFor="cashAmount">
                  Jumlah Uang (IDR) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="cashAmount"
                    type="text"
                    placeholder="1.000.000"
                    value={formatNumber(formData.cashAmount)}
                    onChange={(e) =>
                      handleCurrencyChange("cashAmount", e.target.value)
                    }
                    className={`pl-10 ${
                      errors.cashAmount ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.cashAmount && (
                  <p className="text-xs text-red-500">{errors.cashAmount}</p>
                )}
                {formData.cashAmount && !errors.cashAmount && (
                  <p className="text-xs text-muted-foreground">
                    Total: Rp {formatNumber(formData.cashAmount)}
                  </p>
                )}
              </div>
            )}

            {/* InKind Details */}
            {formData.donationType === "InKind" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="inKindEstimatedValue">
                    Estimasi Nilai (IDR) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="inKindEstimatedValue"
                      type="text"
                      placeholder="500.000"
                      value={formatNumber(formData.inKindEstimatedValue)}
                      onChange={(e) =>
                        handleCurrencyChange(
                          "inKindEstimatedValue",
                          e.target.value
                        )
                      }
                      className={`pl-10 ${
                        errors.inKindEstimatedValue ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.inKindEstimatedValue && (
                    <p className="text-xs text-red-500">
                      {errors.inKindEstimatedValue}
                    </p>
                  )}
                  {formData.inKindEstimatedValue &&
                    !errors.inKindEstimatedValue && (
                      <p className="text-xs text-muted-foreground">
                        Total: Rp {formatNumber(formData.inKindEstimatedValue)}
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inKindCategory">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.inKindCategory}
                    onValueChange={(value) =>
                      handleChange("inKindCategory", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.inKindCategory ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {INKIND_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.inKindCategory && (
                    <p className="text-xs text-red-500">
                      {errors.inKindCategory}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inKindDescription">
                    Deskripsi Barang/Jasa{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="inKindDescription"
                    placeholder="Jelaskan detail barang atau jasa yang didonasikan"
                    value={formData.inKindDescription}
                    onChange={(e) =>
                      handleChange("inKindDescription", e.target.value)
                    }
                    className={errors.inKindDescription ? "border-red-500" : ""}
                    rows={4}
                  />
                  {errors.inKindDescription && (
                    <p className="text-xs text-red-500">
                      {errors.inKindDescription}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/donations")}
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
                {isEdit ? "Perbarui" : "Simpan"} Donasi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
