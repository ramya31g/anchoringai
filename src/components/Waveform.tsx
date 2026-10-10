interface WaveformProps {
  active: boolean;
  bars?: number;
}

export default function Waveform({ active, bars = 24 }: WaveformProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-primary-500 to-accent-400 transition-all duration-150"
          style={{
            height: active ? `${20 + Math.random() * 80}%` : '15%',
            animation: active ? `wave 0.${5 + (i % 5)}s ease-in-out infinite` : 'none',
            animationDelay: `${i * 50}ms`,
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
