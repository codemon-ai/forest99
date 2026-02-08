import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { usePerformanceStore } from '../../systems/PerformanceManager';

export default function PostProcessing() {
  const health = usePlayerStore((state) => state.health);
  const sanity = usePlayerStore((state) => state.sanity);
  const isNight = useGameStore((state) => state.isNight);
  const settings = usePerformanceStore((state) => state.settings);
  
  if (!settings.postProcessing) {
    return null;
  }
  
  const healthRatio = health / 100;
  const sanityRatio = sanity / 100;
  
  const vignetteIntensity = Math.max(
    0.3,
    0.3 + (1 - healthRatio) * 0.4 + (1 - sanityRatio) * 0.3
  );
  
  const chromaticIntensity = sanityRatio < 0.3 
    ? (0.3 - sanityRatio) * 0.01 
    : 0;
  
  const bloomIntensity = isNight ? 0.8 : 0.4;
  
  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={vignetteIntensity}
        blendFunction={BlendFunction.NORMAL}
      />
      {sanityRatio < 0.3 && (
        <ChromaticAberration
          offset={[chromaticIntensity, chromaticIntensity]}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
    </EffectComposer>
  );
}
