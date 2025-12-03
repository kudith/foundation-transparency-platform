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
import { ArrowLeft, Loader2, X } from "lucide-react";
import { createUser, updateUser, getUserById } from "../../services/userService";
import { toast } from "sonner";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    communities: [],
    roles: [],
    statusPekerjaan: "",
    kategoriUsia: "",
    domisili: "",
  });

  // Available options
  const statusPekerjaanOptions = [
    "Pelajar",
    "Mahasiswa",
    "Pekerja",
    "Wirausaha",
    "Lainnya",
  ];

  const kategoriUsiaOptions = ["<18", "18-25", "26-35", "36-45", ">45"];

  const communityOptions = [
    "all",
    "Komunitas A",
    "Komunitas B",
    "Komunitas C",
    // Tambahkan komunitas lain sesuai kebutuhan
  ];

  const roleOptions = [
    "Admin",
    "Member",
    "Volunteer",
    // Tambahkan role lain sesuai kebutuhan
  ];

  useEffect(() => {
    if (isEdit) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    const result = await getUserById(id);

    if (result.success) {
      const user = result.data;
      setFormData({
        id: user._id || "",
        name: user.name || "",
        communities: user.communities || [],
        roles: user.roles || [],
        statusPekerjaan: user.statusPekerjaan || "",
        kategoriUsia: user.kategoriUsia || "",
        domisili: user.domisili || "",
      });
    } else {
      toast.error(result.error || "Gagal memuat data user");
      navigate("/admin/users");
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [name]: currentValues.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [name]: [...currentValues, value],
        };
      }
    });
  };

  const handleRemoveTag = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((v) => v !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name) {
      toast.error("Nama wajib diisi");
      return;
    }

    setSubmitting(true);

    const userData = {
      name: formData.name,
      communities: formData.communities,
      roles: formData.roles,
      statusPekerjaan: formData.statusPekerjaan || undefined,
      kategoriUsia: formData.kategoriUsia || undefined,
      domisili: formData.domisili || undefined,
    };

    // Add id for create
    if (!isEdit && formData.id) {
      userData.id = formData.id;
    }

    let result;
    if (isEdit) {
      result = await updateUser(id, userData);
    } else {
      result = await createUser(userData);
    }

    if (result.success) {
      toast.success(
        isEdit ? "User berhasil diupdate" : "User berhasil dibuat"
      );
      navigate(`/admin/users/${result.data._id}`);
    } else {
      toast.error(result.error || "Gagal menyimpan user");
    }

    setSubmitting(false);
  };

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
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={isEdit ? `/admin/users/${id}` : "/admin/users"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {isEdit ? "Edit User" : "Tambah User Baru"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEdit
              ? "Update informasi user"
              : "Buat user baru untuk organisasi"}
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
                <CardTitle>Informasi User</CardTitle>
                <CardDescription>
                  Lengkapi informasi dasar user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ID (only for create) */}
                {!isEdit && (
                  <div className="space-y-2">
                    <Label htmlFor="id">ID User (opsional)</Label>
                    <Input
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      placeholder="Kosongkan untuk auto-generate"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Jika dikosongkan, ID akan dibuat otomatis
                    </p>
                  </div>
                )}

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
                    placeholder="Masukkan nama user"
                    required
                  />
                </div>

                {/* Domisili */}
                <div className="space-y-2">
                  <Label htmlFor="domisili">Domisili</Label>
                  <Input
                    id="domisili"
                    name="domisili"
                    value={formData.domisili}
                    onChange={handleInputChange}
                    placeholder="Masukkan domisili user"
                  />
                </div>

                {/* Status Pekerjaan */}
                <div className="space-y-2">
                  <Label htmlFor="statusPekerjaan">Status Pekerjaan</Label>
                  <Select
                    value={formData.statusPekerjaan}
                    onValueChange={(value) =>
                      handleSelectChange("statusPekerjaan", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status pekerjaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tidak ada</SelectItem>
                      {statusPekerjaanOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Kategori Usia */}
                <div className="space-y-2">
                  <Label htmlFor="kategoriUsia">Kategori Usia</Label>
                  <Select
                    value={formData.kategoriUsia}
                    onValueChange={(value) =>
                      handleSelectChange("kategoriUsia", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori usia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tidak ada</SelectItem>
                      {kategoriUsiaOptions.map((kategori) => (
                        <SelectItem key={kategori} value={kategori}>
                          {kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Communities */}
            <Card>
              <CardHeader>
                <CardTitle>Komunitas</CardTitle>
                <CardDescription>
                  Pilih komunitas yang diikuti user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Pilih Komunitas</Label>
                  <div className="flex flex-wrap gap-2">
                    {communityOptions.map((community) => (
                      <Button
                        key={community}
                        type="button"
                        variant={
                          formData.communities.includes(community)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleMultiSelectChange("communities", community)
                        }
                      >
                        {community}
                      </Button>
                    ))}
                  </div>
                </div>
                {formData.communities.length > 0 && (
                  <div className="space-y-2">
                    <Label>Komunitas Terpilih</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.communities.map((community) => (
                        <div
                          key={community}
                          className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
                        >
                          <span>{community}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag("communities", community)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Roles */}
            <Card>
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>Pilih role user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Pilih Role</Label>
                  <div className="flex flex-wrap gap-2">
                    {roleOptions.map((role) => (
                      <Button
                        key={role}
                        type="button"
                        variant={
                          formData.roles.includes(role) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleMultiSelectChange("roles", role)}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
                {formData.roles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Role Terpilih</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.roles.map((role) => (
                        <div
                          key={role}
                          className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
                        >
                          <span>{role}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag("roles", role)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
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
                    navigate(isEdit ? `/admin/users/${id}` : "/admin/users")
                  }
                  disabled={submitting}
                >
                  Batal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;


