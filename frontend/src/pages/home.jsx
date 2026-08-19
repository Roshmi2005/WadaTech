import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import FAQ from "../components/home/FAQ";
import Contact from "../components/home/Contact";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <FAQ />
      <Contact/>
    </>
  );
}

export default Home;