const About = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Tentang Kami
            </h2>
            <p className="font-serif text-gray-700 leading-relaxed mb-4">
              Yayasan Veritas Pelita Nusantara adalah organisasi nirlaba yang
              didedikasikan untuk memberdayakan masyarakat melalui pendidikan,
              kesehatan, dan pembangunan berkelanjutan.
            </p>
            <p className="font-serif text-gray-700 leading-relaxed">
              Dengan prinsip transparansi penuh, kami membuka akses publik
              terhadap laporan keuangan, program, dan dampak sosial yang kami
              ciptakan.
            </p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm p-8">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
              Nilai Kami
            </h3>
            <ul className="space-y-3 font-serif text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Transparansi dalam setiap keputusan</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Akuntabilitas kepada donatur dan publik</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Integritas dalam pengelolaan dana</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Dampak sosial yang terukur</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
