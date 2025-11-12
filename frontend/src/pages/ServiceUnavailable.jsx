import ErrorPage from "./ErrorPage";

const ServiceUnavailable = () => {
  return (
    <ErrorPage
      code="503"
      title="Layanan Tidak Tersedia"
      message="Situs sedang dalam pemeliharaan atau mengalami beban tinggi. Silakan coba lagi dalam beberapa saat."
      showBackButton={false}
    />
  );
};

export default ServiceUnavailable;
