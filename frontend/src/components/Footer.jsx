export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/10 bg-black/20 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
        
        {/* Brand */}
        <div className="flex items-center gap-2 text-white font-semibold">
           <span className="material-symbols-outlined text-3xl text-[var(--primary)]">
            video_camera_front
          </span>
          Video Call
        </div>

        {/* Links */}
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
          <a href="#" className="hover:text-white">Help</a>
        </div>

        {/* Copyright */}
        <p>© 2025 Video Call</p>
      </div>
    </footer>
  );
}
