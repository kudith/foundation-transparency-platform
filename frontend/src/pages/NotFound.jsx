import ErrorPage from "./ErrorPage";

const NotFound = () => {
  return (
    <ErrorPage
      code="404"
      title="Halaman Tidak Ditemukan"
      message="Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan periksa kembali URL atau kembali ke beranda."
    />
  );
};

export default NotFound;
