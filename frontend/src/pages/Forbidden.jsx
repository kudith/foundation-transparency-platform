import ErrorPage from "./ErrorPage";

const Forbidden = () => {
  return (
    <ErrorPage
      code="403"
      title="Akses Ditolak"
      message="Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan."
      showBackButton={false}
    />
  );
};

export default Forbidden;
