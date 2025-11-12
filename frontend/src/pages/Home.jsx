import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import Statistics from "../components/home/Statistics";
import About from "../components/home/About";
import Programs from "../components/home/Programs";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Statistics />
      <About />
      <Programs />
      <Footer />
    </div>
  );
};

export default Home;
