import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import LoginForm from "../../components/admin/LoginForm";

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h1 className="font-serif font-bold text-2xl text-gray-900">
            Veritas Pelita Nusantara
          </h1>
        </Link>
        <h2 className="mt-6 text-center font-serif text-3xl font-bold text-gray-900">
          Login Admin
        </h2>
        <p className="mt-2 text-center font-serif text-sm text-gray-600">
          Masuk ke panel administrasi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 font-serif text-sm">
              {error}
            </div>
          )}

          <LoginForm onSubmit={onSubmit} isLoading={isLoading} />

          <div className="mt-6">
            <Link
              to="/"
              className="font-serif text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
