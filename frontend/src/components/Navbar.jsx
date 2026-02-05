import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate(); 

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LEFT */}
        <div 
          className="flex items-center gap-2 font-bold text-lg cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <span className="material-symbols-outlined text-3xl text-[var(--primary)]">
            video_camera_front
          </span>
          <span>Video Call</span>
        </div>

        {/* RIGHT */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {/* Use button or span for internal routing to avoid 'href' issues */}
          <span 
            className="text-gray-300 hover:text-white cursor-pointer" 
            onClick={() => navigate("/guest")}
          >
            Join as Guest
          </span>
          
          <span 
            className="text-gray-300 hover:text-white cursor-pointer" 
            onClick={() => navigate("/auth")}
          >
            Register
          </span>

          <button 
            className="bg-[var(--primary)] text-black px-5 py-2 rounded-full font-semibold hover:bg-[var(--primary)] transition-all" 
            onClick={() => navigate("/auth")}
          >
            Login
          </button>
        </nav>

      </div>
    </header>
  );
}