import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-white py-32 md:py-40 mt-16">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Transparansi dan Akuntabilitas untuk Masa Depan yang Lebih Terang
        </h1>

        <p className="mt-8 font-serif text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Yayasan Veritas Pelita Nusantara berkomitmen untuk mewujudkan
          keterbukaan penuh dalam setiap aspek operasional kami. Kami percaya
          bahwa transparansi adalah fondasi kepercayaan dan akuntabilitas adalah
          jalan menuju dampak yang berkelanjutan.
        </p>

        <div className="mt-12">
          <Link
            to="/programs"
            className="inline-block font-serif font-semibold px-8 py-3 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-100 transition-colors"
          >
            Lihat Program Kami
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
