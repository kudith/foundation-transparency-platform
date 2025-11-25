const commitments = [
  {
    title: "Menjadi Pelopor Pemberdayaan",
    description:
      "Membuka jalan bagi komunitas inovatif yang berbasis pada kejujuran dan integritas.",
  },
  {
    title: "Membimbing dengan Sepenuh Hati",
    description:
      "Memberikan dukungan dan sumber daya untuk pertumbuhan dan kemandirian setiap individu.",
  },
  {
    title: "Membangun Fondasi Kuat",
    description:
      "Bersinergi membangun komunitas yang berkembang dan memperluas dampak positif di nusantara.",
  },
  {
    title: "Menjunjung Transparansi",
    description:
      "Menerapkan nilai kebenaran, integritas, dan transparansi dalam setiap aspek operasional.",
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
            Misi Kami
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Empat Pilar Pemberdayaan Komunitas
          </h2>
          <p className="mt-4 font-serif text-base leading-relaxed text-muted-foreground max-w-2xl">
            Misi kami adalah merangkul, membimbing, dan melengkapi setiap individu 
            untuk membentuk pribadi dengan jiwa yang siap berjuang untuk hidup dan 
            impian mereka. Empat pilar ini menjadi panduan dalam setiap langkah kami.
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
