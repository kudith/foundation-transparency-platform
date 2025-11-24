import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Commitments from "@/components/home/Commitments";
import Statistics from "@/components/home/Statistics";
import About from "@/components/home/About";
import Programs from "@/components/home/Programs";
import Footer from "@/components/home/Footer";
import TransparencyReport from "@/components/home/TransparencyReport";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Commitments />
        <TransparencyReport />
        <Statistics />
        <Programs />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
