import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useEventStore } from '../../stores/eventStore';
import { EVENT_TYPES } from '../../data/events';

function StormParticles() {
  const particlesRef = useRef();
  const count = 500;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);
  
  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3] -= delta * 30;
      positions[i * 3 + 1] -= delta * 20;
      
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 30;
        positions[i * 3] = (Math.random() - 0.5) * 100;
      }
      if (positions[i * 3] < -50) {
        positions[i * 3] = 50;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#aaaaaa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function FogEffect({ density }) {
  return (
    <fog attach="fog" args={['#666666', 5, density]} />
  );
}

function BloodMoonLight() {
  return (
    <>
      <ambientLight intensity={0.15} color="#330000" />
      <directionalLight
        position={[30, 50, 30]}
        intensity={0.4}
        color="#ff2200"
        castShadow
      />
    </>
  );
}

function EarthquakeShake({ intensity }) {
  const groupRef = useRef();
  
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = (Math.random() - 0.5) * intensity;
    groupRef.current.position.y = (Math.random() - 0.5) * intensity * 0.5;
    groupRef.current.position.z = (Math.random() - 0.5) * intensity;
  });
  
  return <group ref={groupRef} />;
}

export default function EventEffects() {
  const currentEvent = useEventStore((state) => state.currentEvent);
  
  if (!currentEvent) return null;
  
  const effects = currentEvent.effects || {};
  const visibilityRange = effects.visibilityRange ?? 100;
  const cameraShake = effects.cameraShake ?? 0;
  
  return (
    <>
      {currentEvent.id === EVENT_TYPES.STORM && <StormParticles />}
      
      {(currentEvent.id === EVENT_TYPES.FOG || currentEvent.id === EVENT_TYPES.STORM) && (
        <FogEffect density={visibilityRange} />
      )}
      
      {currentEvent.id === EVENT_TYPES.BLOOD_MOON && <BloodMoonLight />}
      
      {currentEvent.id === EVENT_TYPES.EARTHQUAKE && (
        <EarthquakeShake intensity={cameraShake} />
      )}
    </>
  );
}
