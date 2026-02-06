import { usePlayerStore } from '../../stores/playerStore';

export default function SanityEffect() {
  const sanity = usePlayerStore((state) => state.sanity);
  
  // Vignette intensity: starts at sanity 50%, full at sanity 0%
  const vignette = sanity <= 50 ? (50 - sanity) / 50 : 0;
  
  if (vignette <= 0) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99,
        background: `radial-gradient(ellipse at center, transparent 0%, transparent ${60 - vignette * 40}%, rgba(0,0,0,${vignette * 0.8}) 100%)`,
      }}
    />
  );
}
