import manImg from "../assets/man.png";
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-20 items-center">
      
      {/* LEFT CONTENT */}
      <div>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs uppercase tracking-wide text-gray-300">
            Live HD Video
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
          <span className="text-[var(--primary)]">Connect</span> with your <br />
          Loved Ones
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-[var(--muted)] text-lg max-w-xl">
          Cover any distance instantly. Crystal clear video, lag-free audio,
          and a secure environment for your most important conversations.
        </p>

        {/* CTA */}
      <Link
  to="/auth"
  className="inline-flex items-center gap-2 bg-[var(--primary)] text-black px-8 py-4 mt-10 rounded-full font-bold transition-all shadow-xl hover:-translate-y-1"
>
  <span>Get Started Free</span>
  <span className="material-symbols-outlined text-xl">
    arrow_forward
  </span>
</Link>

  

        {/* Social proof */}
        <p className="mt-6 text-sm text-gray-400">
          Trusted by thousands of happy users
        </p>
      </div>

      {/* RIGHT VISUAL */}
      <div className="relative">
        <div className="bg-[var(--surface)] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          
          {/* Window top bar */}
          <div className="h-8 bg-black/40 flex items-center px-3 gap-2 border-b border-white/5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>

          {/* Video mock */}
          <div className="h-64 bg-black/50 flex items-center justify-center text-gray-400">
          <img alt="Video call participant" class="w-full h-full object-cover opacity-90" data-alt="Professional woman smiling in a video conference" src={manImg}/>
          <div class="absolute top-10 left-4 bg-black/40 px-2 py-1 rounded text-xs text-white font-medium">Sarah Jenkins</div>
          </div>
        </div>

       
      </div>
    </section>
  );
}
