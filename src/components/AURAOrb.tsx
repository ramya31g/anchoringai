import { Sparkles } from 'lucide-react';

interface AURAOrbProps {
  state: 'idle' | 'speaking' | 'completed';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-24 h-24',
  md: 'w-40 h-40',
  lg: 'w-56 h-56',
  xl: 'w-72 h-72',
};

export default function AURAOrb({ state, size = 'md' }: AURAOrbProps) {
  const isActive = state === 'speaking';
  const isCompleted = state === 'completed';

  return (
    <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
      {/* Outer glow rings */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${
          isActive ? 'opacity-70' : isCompleted ? 'opacity-40' : 'opacity-30'
        }`}
        style={{
          background: isCompleted
            ? 'radial-gradient(circle, rgba(16,185,129,0.4), transparent)'
            : 'radial-gradient(circle, rgba(99,102,241,0.4), rgba(34,211,238,0.2), transparent)',
        }}
      />

      {/* Rotating ring */}
      <div
        className={`absolute inset-2 rounded-full border-2 border-transparent ${
          isActive ? 'animate-spin-slow' : ''
        }`}
        style={{
          borderTopColor: isCompleted ? 'rgba(16,185,129,0.6)' : 'rgba(99,102,241,0.6)',
          borderRightColor: isCompleted ? 'rgba(16,185,129,0.3)' : 'rgba(34,211,238,0.4)',
        }}
      />

      {/* Inner orb */}
      <div
        className={`relative rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive ? 'animate-orb-pulse' : 'animate-float'
        }`}
        style={{
          width: '70%',
          height: '70%',
          background: isCompleted
            ? 'radial-gradient(circle at 35% 35%, rgba(16,185,129,0.3), rgba(5,150,105,0.15))'
            : 'radial-gradient(circle at 35% 35%, rgba(99,102,241,0.3), rgba(34,211,238,0.15))',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Sparkles
          className={`w-1/4 h-1/4 transition-colors duration-500 ${
            isCompleted ? 'text-emerald-400' : 'text-primary-400'
          }`}
        />
      </div>

      {/* Pulsing dots when speaking */}
      {isActive && (
        <>
          <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-accent-400 animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="absolute top-1/3 right-0 w-2 h-2 rounded-full bg-accent-300 animate-pulse" style={{ animationDelay: '400ms' }} />
        </>
      )}
    </div>
  );
}
