import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import LoginForm from "../../components/admin/LoginForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const getErrorMessage = (error) => {
  if (!error) return null;
  if (
    error.toLowerCase().includes("invalid") ||
    error.toLowerCase().includes("unauthorized") ||
    error.toLowerCase().includes("not found") ||
    error.toLowerCase().includes("user") ||
    error.toLowerCase().includes("password")
  ) {
    return "Email atau password salah. Silakan periksa kembali.";
  }
  if (
    error.toLowerCase().includes("network") ||
    error.toLowerCase().includes("timeout")
  ) {
    return "Tidak dapat terhubung ke server. Silakan cek koneksi internet Anda.";
  }
  if (
    error.toLowerCase().includes("server") ||
    error.toLowerCase().includes("internal")
  ) {
    return "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.";
  }
  return error;
};

const Login = () => {
  const navigate = useNavigate();
  const { isLoading, error, login } = useAuthStore();

  const onSubmit = async (credentials) => {
    const result = await login(credentials);

    if (result.success) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link to="/" className="flex justify-center">
          <h1 className="font-serif font-bold text-2xl text-foreground">
            Veritas Pelita Nusantara
          </h1>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-3xl font-bold text-foreground text-center">
              Login Admin
            </CardTitle>
            <CardDescription className="font-serif text-center">
              Masuk ke panel administrasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded border border-destructive/30 bg-destructive/10 text-destructive font-serif text-sm text-center">
                {getErrorMessage(error)}
              </div>
            )}

            <LoginForm onSubmit={onSubmit} isLoading={isLoading} />

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Kembali ke Beranda
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
