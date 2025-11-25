import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-background pt-28 pb-24 md:pt-32">
      <div className="mx-auto max-w-4xl px-4 flex flex-col items-center text-center md:px-6">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Kebenaran • Pencerahan • Pemberdayaan
        </p>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-foreground md:text-6xl md:leading-[1.05]">
          Menerangi Nusantara Melalui Pemberdayaan Komunitas
        </h1>
        <p className="mt-6 font-serif text-lg text-muted-foreground md:text-xl leading-relaxed">
          Yayasan Veritas Pelita Nusantara berdedikasi untuk menciptakan masa depan yang inklusif 
          melalui pemberdayaan komunitas. Kami merangkul, membimbing, dan melengkapi setiap individu 
          untuk mengembangkan potensi terbaik mereka dalam bahasa dan teknologi.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-start lg:justify-start">
          <Button
            size="lg"
            asChild
            className="h-12 px-6 font-serif text-base shadow-lg"
          >
            <Link to="/program">
              Jelajahi Program Kami
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="h-12 px-6 font-serif text-base text-muted-foreground hover:text-foreground border-2 shadow-lg"
          >
            <Link to="/tentang">Pelajari Lebih Lanjut</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
