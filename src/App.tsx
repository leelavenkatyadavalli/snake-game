import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="px-6 py-6 md:px-10 flex flex-col md:flex-row justify-between items-center border-b border-glass-border bg-black/40">
        <h1 className="font-mono text-2xl font-black tracking-[4px] text-neon-cyan drop-shadow-[0_0_10px_var(--color-neon-cyan)]">
          NEON_SNAKE.V1
        </h1>
        {/* We can put the high score/score in SnakeGame itself, or just leave this header simple */}
      </header>

      <main className="flex-grow p-4 md:p-8 grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-8 max-w-[1400px] mx-auto w-full items-start">
        {/* Left/Sidebar Section: Music Player */}
        <aside className="w-full xl:order-1 flex flex-col gap-6">
          <MusicPlayer />
        </aside>

        {/* Right Section: Game Window */}
        <section className="relative flex-grow flex items-center justify-center bg-black/60 border-2 border-glass-border rounded-2xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,243,255,0.1)] w-full xl:order-2 p-8">
          <SnakeGame />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none rounded-xl"></div>
        </section>
      </main>

      <footer className="px-10 py-4 flex flex-wrap gap-5 text-[11px] text-white/30 uppercase tracking-[1px] font-sans justify-center md:justify-start">
        <div><span className="text-neon-cyan border border-neon-cyan px-1.5 py-0.5 rounded-[3px] mr-1">W A S D</span> MOVEMENT</div>
        <div><span className="text-neon-cyan border border-neon-cyan px-1.5 py-0.5 rounded-[3px] mr-1">SPACE</span> PAUSE GAME</div>
        <div><span className="text-neon-cyan border border-neon-cyan px-1.5 py-0.5 rounded-[3px] mr-1">M</span> MUTE MUSIC</div>
      </footer>
    </div>
  );
}
