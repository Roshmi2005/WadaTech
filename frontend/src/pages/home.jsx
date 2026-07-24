import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Features from "../components/home/Features";
import Notice from "../components/home/Notice";
import FAQ from "../components/home/FAQ";
import Contact from "../components/home/Contact";
import Footer from "../components/home/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Features />
      <Notice />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;