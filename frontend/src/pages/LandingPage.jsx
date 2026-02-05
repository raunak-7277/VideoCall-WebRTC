import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
     <div className="layout-container flex h-full grow flex-col z-10 relative">


      {/* AMBIENT GLOWS */}
      <div className="fixed top-[-20%] left-[-10%] w-[1400px] h-[1200px] bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="fixed bottom-[-10%] right-[-5%] w-[1400px] h-[1200px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

   
      {/* PAGE CONTENT */}
      <div className="relative z-10 bg-[var(--primary)]/5">
        <Navbar />
        <Hero />
        <Footer />
      </div>

    </div>
  );
}