import ErrorPage from "./ErrorPage";

const ServerError = () => {
  return (
    <ErrorPage
      code="500"
      title="Terjadi Kesalahan Server"
      message="Maaf, terjadi kesalahan pada server kami. Tim kami sedang bekerja untuk memperbaikinya. Silakan coba lagi nanti."
    />
  );
};

export default ServerError;
