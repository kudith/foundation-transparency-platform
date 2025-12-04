import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import {
  createAdmin,
  updateAdmin,
  getAdminById,
} from "../../services/adminService";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";

const AdminForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isEdit = !!id;
  const isSuperAdmin = user?.role === "super_admin";

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [originalAdmin, setOriginalAdmin] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  // Errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchAdminData();
    }
  }, [id]);

  const fetchAdminData = async () => {
    setLoading(true);
    const result = await getAdminById(id);

    if (result.success) {
      const admin = result.data;
      setOriginalAdmin(admin);
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        password: "",
        role: admin.role || "admin",
      });
    } else {
      toast.error(result.error || "Gagal memuat data admin");
      navigate("/admin/admins");
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    }

    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (isEdit && formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon perbaiki kesalahan pada form");
      return;
    }

    // Check permission for create
    if (!isEdit && !isSuperAdmin) {
      toast.error("Hanya Super Admin yang dapat menambah admin baru");
      return;
    }

    setSubmitting(true);

    const adminData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
    };

    // Only include password if provided
    if (formData.password) {
      adminData.password = formData.password;
    }

    // Only include role if super_admin (for edit) or creating new admin
    if (isSuperAdmin) {
      adminData.role = formData.role;
    }

    let result;
    if (isEdit) {
      result = await updateAdmin(id, adminData);
    } else {
      result = await createAdmin(adminData);
    }

    if (result.success) {
      toast.success(
        isEdit ? "Admin berhasil diperbarui" : "Admin berhasil ditambahkan"
      );
      navigate(`/admin/admins/${result.data._id}`);
    } else {
      toast.error(result.error || "Gagal menyimpan admin");
    }

    setSubmitting(false);
  };

  // Check if current user is editing their own profile
  const isEditingSelf =
    isEdit && (id === user?._id || id === user?.id);

  // Check if role can be changed
  const canChangeRole = isSuperAdmin && !isEditingSelf;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permission for create page
  if (!isEdit && !isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/admins">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Akses Ditolak
            </h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Tidak Memiliki Izin
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hanya Super Admin yang dapat menambahkan admin baru
              </p>
              <Button
                onClick={() => navigate("/admin/admins")}
                variant="outline"
              >
                Kembali ke Daftar Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={isEdit ? `/admin/admins/${id}` : "/admin/admins"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {isEdit ? "Edit Admin" : "Tambah Admin Baru"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEdit
              ? `Perbarui informasi admin${isEditingSelf ? " (akun Anda)" : ""}`
              : "Buat akun admin baru untuk sistem"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Main Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Admin</CardTitle>
                <CardDescription>
                  Lengkapi data dasar untuk akun admin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nama <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama admin"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password{" "}
                    {!isEdit && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={
                        isEdit
                          ? "Kosongkan jika tidak ingin mengubah"
                          : "Minimal 6 karakter"
                      }
                      className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                  {isEdit && (
                    <p className="text-xs text-muted-foreground">
                      Biarkan kosong jika tidak ingin mengubah password
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role & Permissions
                </CardTitle>
                <CardDescription>
                  Tentukan level akses untuk admin ini
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {canChangeRole ? (
                  <div className="space-y-2">
                    <Label htmlFor="role">Role Admin</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="super_admin">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-amber-500" />
                            <span>Super Admin</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Role Description */}
                    <div className="mt-4 p-4 rounded-lg bg-muted/50">
                      {formData.role === "super_admin" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-amber-600">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="font-medium">Super Admin</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Memiliki akses penuh ke seluruh sistem termasuk:
                          </p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            <li>Menambah admin baru</li>
                            <li>Menghapus admin</li>
                            <li>Mengubah role admin lain</li>
                            <li>Semua fitur admin standar</li>
                          </ul>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <span className="font-medium">Admin</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Admin standar dengan akses terbatas:
                          </p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            <li>Mengelola events, donations, expenses</li>
                            <li>Melihat reports</li>
                            <li>Mengelola users (anggota)</li>
                            <li>Tidak dapat mengelola akun admin lain</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label>Role saat ini:</Label>
                      {formData.role === "super_admin" ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Super Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>

                    {isEditingSelf && (
                      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">
                              Anda tidak dapat mengubah role sendiri
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                              Untuk keamanan, Super Admin tidak dapat mengubah
                              role akun mereka sendiri. Minta Super Admin lain
                              untuk melakukan perubahan jika diperlukan.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isSuperAdmin && (
                      <div className="p-4 rounded-lg bg-muted border">
                        <div className="flex items-start gap-2">
                          <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">
                              Perubahan role dibatasi
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Hanya Super Admin yang dapat mengubah role admin.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    navigate(isEdit ? `/admin/admins/${id}` : "/admin/admins")
                  }
                  disabled={submitting}
                >
                  Batal
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            {isEdit && originalAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Info Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Dibuat:</span>{" "}
                    {originalAdmin.createdAt
                      ? new Date(originalAdmin.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </p>
                  {originalAdmin.updatedAt && (
                    <p>
                      <span className="font-medium">Terakhir diubah:</span>{" "}
                      {new Date(originalAdmin.updatedAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;

