import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  Loader,
  DollarSign,
  Users,
  UserCheck,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  createAndEnqueueReport,
  REPORT_TYPES,
} from "../../services/reportService";
import { toast } from "sonner";
import { useBreadcrumbStore } from "../../store/useBreadcrumbStore";

const ReportGenerator = () => {
  const navigate = useNavigate();
  const { setDynamicBreadcrumbLabel } = useBreadcrumbStore();

  // Form state
  const [formData, setFormData] = useState({
    type: "",
    start_date: "",
    end_date: "",
    community_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Set breadcrumb
  useState(() => {
    setDynamicBreadcrumbLabel("/admin/reports/generate", "Generate");
  });

  // Get icon component
  const getIconComponent = (iconName) => {
    const icons = {
      DollarSign,
      Users,
      UserCheck,
      TrendingUp,
      FileText,
    };
    return icons[iconName] || FileText;
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle type change - reset other fields
  const handleTypeChange = (type) => {
    setFormData({
      type,
      start_date: "",
      end_date: "",
      community_name: "",
    });
    setErrors({});
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const reportConfig = REPORT_TYPES[formData.type];

    if (!formData.type) {
      newErrors.type = "Tipe report harus dipilih";
      setErrors(newErrors);
      return false;
    }

    // Check required filters
    if (reportConfig?.requiredFilters.includes("start_date")) {
      if (!formData.start_date) {
        newErrors.start_date = "Tanggal mulai harus diisi";
      }
    }

    if (reportConfig?.requiredFilters.includes("end_date")) {
      if (!formData.end_date) {
        newErrors.end_date = "Tanggal selesai harus diisi";
      }
    }

    // Validate date range
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start > end) {
        newErrors.end_date = "Tanggal selesai harus setelah tanggal mulai";
      }
    }

    if (reportConfig?.requiredFilters.includes("community_name")) {
      if (!formData.community_name) {
        newErrors.community_name = "Komunitas harus dipilih";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang required");
      return;
    }

    setLoading(true);

    // Build report data
    const reportData = {
      type: formData.type,
      filters: {},
    };

    // Add filters based on type
    const reportConfig = REPORT_TYPES[formData.type];
    
    if (reportConfig.requiredFilters.includes("start_date") && formData.start_date) {
      reportData.filters.start_date = new Date(formData.start_date).toISOString();
    }

    if (reportConfig.requiredFilters.includes("end_date") && formData.end_date) {
      reportData.filters.end_date = new Date(formData.end_date).toISOString();
    }

    if (reportConfig.requiredFilters.includes("community_name") && formData.community_name) {
      reportData.filters.community_name = formData.community_name;
    }

    const result = await createAndEnqueueReport(reportData);

    if (result.success) {
      toast.success(
        result.message || "Report berhasil dibuat dan sedang diproses"
      );
      navigate("/admin/reports");
    } else {
      toast.error(result.error || "Gagal membuat report");
    }

    setLoading(false);
  };

  // Get required filters for selected type
  const selectedReportConfig = formData.type ? REPORT_TYPES[formData.type] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/reports")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Generate Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Pilih tipe report dan atur parameter yang diperlukan
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Catatan Penting</p>
          <p>
            Report akan dibuat dengan status <strong>"pending"</strong> dan otomatis diproses oleh worker backend. 
            Status akan berubah menjadi "processing" → "completed" atau "failed" secara otomatis. 
            Anda tidak perlu mengatur status secara manual.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Pilih Tipe Report</CardTitle>
            <CardDescription>
              Pilih tipe report yang ingin Anda generate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(REPORT_TYPES).map(([key, config]) => {
                const Icon = getIconComponent(config.icon);
                const isSelected = formData.type === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTypeChange(key)}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{config.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.type && (
              <p className="text-sm text-destructive mt-2">{errors.type}</p>
            )}
          </CardContent>
        </Card>

        {/* Report Parameters */}
        {formData.type && (
          <Card>
            <CardHeader>
              <CardTitle>Parameter Report</CardTitle>
              <CardDescription>
                Atur parameter untuk {selectedReportConfig?.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Informasi</p>
                  <p>{selectedReportConfig?.description}</p>
                </div>
              </div>

              {/* Community Selection */}
              {selectedReportConfig?.requiredFilters.includes("community_name") && (
                <div className="space-y-2">
                  <Label htmlFor="community_name">
                    Komunitas <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.community_name}
                    onValueChange={(value) =>
                      handleInputChange("community_name", value)
                    }
                  >
                    <SelectTrigger
                      id="community_name"
                      className={errors.community_name ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Pilih komunitas" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.type === "program_impact" && (
                        <SelectItem value="all">Semua Komunitas</SelectItem>
                      )}
                      <SelectItem value="Nostracode">Nostracode</SelectItem>
                      <SelectItem value="Cordis Lingua">Cordis Lingua</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.community_name && (
                    <p className="text-sm text-destructive">
                      {errors.community_name}
                    </p>
                  )}
                </div>
              )}

              {/* Date Range */}
              {selectedReportConfig?.requiredFilters.includes("start_date") && (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="start_date">
                      Tanggal Mulai <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        handleInputChange("start_date", e.target.value)
                      }
                      className={errors.start_date ? "border-destructive" : ""}
                    />
                    {errors.start_date && (
                      <p className="text-sm text-destructive">
                        {errors.start_date}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label htmlFor="end_date">
                      Tanggal Selesai <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        handleInputChange("end_date", e.target.value)
                      }
                      min={formData.start_date}
                      className={errors.end_date ? "border-destructive" : ""}
                    />
                    {errors.end_date && (
                      <p className="text-sm text-destructive">
                        {errors.end_date}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/reports")}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default ReportGenerator;

