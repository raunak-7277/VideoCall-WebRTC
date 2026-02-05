import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <div 
          className="flex items-center gap-2 font-bold text-lg cursor-pointer group" 
          onClick={() => navTo("/")}
        >
          <span className="material-symbols-outlined text-3xl text-[var(--primary)] group-hover:scale-110 transition-transform">
            video_camera_front
          </span>
          <span>Video Call</span>
        </div>

        {/* HAMBURGER ICON */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white p-1">
            <span className="material-symbols-outlined text-3xl transition-all duration-300">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* RIGHT: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => navTo("/guest")}>Join as Guest</span>
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => navTo("/auth")}>Register</span>
          <button 
            className="bg-[var(--primary)] text-black px-6 py-2 rounded-full font-bold hover:brightness-110 transition-all active:scale-95" 
            onClick={() => navTo("/auth")}
          >
            Login
          </button>
        </nav>
      </div>

      {/* MOBILE MENU: Animated Slide-down */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } bg-black/90 border-t border-white/5`}
      >
        <div className="flex flex-col px-6 py-6 gap-6 text-center">
          <span className="text-gray-300 text-lg" onClick={() => navTo("/guest")}>Join as Guest</span>
          <span className="text-gray-300 text-lg" onClick={() => navTo("/auth")}>Register</span>
          <button 
            className="bg-[var(--primary)] text-black py-3 rounded-xl font-bold shadow-lg shadow-[var(--primary)]/20" 
            onClick={() => navTo("/auth")}
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}