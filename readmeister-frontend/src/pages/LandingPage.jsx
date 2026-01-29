import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Github, FileText, Eye } from "lucide-react";
import FeaturesSection from "../components/FeatureCard";
import Hero from "../components/Hero";
import FAQ from "../components/FAQ";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900">
      <Navbar />
      <Hero />
      <FeaturesSection />
     <FAQ/>
      

      <Footer />
    </div>
  );
};
export default LandingPage;