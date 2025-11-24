const commitments = [
  {
    title: "Laporan Keuangan Terbuka",
    description:
      "Akses publik diperbarui setiap triwulan dengan format yang mudah diverifikasi.",
  },
  {
    title: "Audit Independen",
    description:
      "Diawasi auditor eksternal bersertifikasi untuk memastikan kepatuhan penuh.",
  },
  {
    title: "Dasbor Program",
    description:
      "Indikator capaian tersedia secara real-time untuk setiap program aktif.",
  },
  {
    title: "Pelibatan Publik",
    description:
      "Forum transparansi rutin bersama pemangku kepentingan di seluruh daerah.",
  },
];

const CommitmentPoint = ({ number, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-lg font-bold shadow">
        {number}
      </span>
    </div>
    <div>
      <p className="font-serif text-base font-semibold text-foreground">
        {title}
      </p>
      <p className="font-serif text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const Commitments = () => {
  return (
    <section className="bg-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 lg:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-primary/80">
            Komitmen Utama
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Transparansi yang Konsisten di Setiap Langkah
          </h2>
          <p className="mt-4 font-serif text-base leading-relaxed text-muted-foreground max-w-2xl">
            Setiap proses pengambilan keputusan, pelaporan keuangan, dan
            evaluasi program selalu dibuka untuk publik. Komitmen berikut
            menjadi dasar bagi kami dalam menjaga kepercayaan dan memastikan
            akuntabilitas berkelanjutan.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {commitments.map((item, idx) => (
            <CommitmentPoint
              key={item.title}
              number={idx + 1}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Commitments;
