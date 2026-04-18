import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Grid Synth',
    artist: 'AI System',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cyberpunk Overdrive',
    artist: 'AI System',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Digital Dreamscape',
    artist: 'AI System',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="bg-glass border border-glass-border rounded-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col gap-4 w-full">
      <h2 className="text-[14px] font-semibold uppercase tracking-[1px] mb-2 text-neon-magenta">Audio Feed</h2>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="flex flex-col gap-3 mb-4">
        {TRACKS.map((t, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${idx === currentTrackIndex ? 'bg-neon-cyan/10 border-glass-border' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
          >
            <div className="w-8 h-8 shrink-0 bg-[#222] rounded flex items-center justify-center text-sm font-mono text-white/80">
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div className="overflow-hidden flex-grow">
              <div className="text-[13px] whitespace-nowrap overflow-hidden text-ellipsis text-white">{t.title}</div>
              <div className="text-[11px] text-white/40">{t.artist}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto bg-black/30 p-4 rounded-lg">
        <div className="h-1 bg-[#222] rounded-[2px] mb-4 relative cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (audioRef.current && audioRef.current.duration) {
              audioRef.current.currentTime = clickPos * audioRef.current.duration;
              setProgress(clickPos * 100);
            }
        }}>
          <div className="h-full bg-neon-cyan shadow-[0_0_8px_var(--color-neon-cyan)] rounded-[2px]" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex justify-center items-center gap-5 mt-2">
          <button onClick={prevTrack} className="w-10 h-10 rounded-full border border-glass-border flex flex-shrink-0 items-center justify-center hover:bg-white/5 transition-colors text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-neon-cyan text-bg-dark rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? (
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button onClick={nextTrack} className="w-10 h-10 rounded-full border border-glass-border flex flex-shrink-0 items-center justify-center hover:bg-white/5 transition-colors text-white">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
          
          <button onClick={toggleMute} className="w-10 h-10 ml-auto rounded-full border border-glass-border flex flex-shrink-0 items-center justify-center hover:bg-white/5 transition-colors text-white/50 hover:text-white">
             {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
