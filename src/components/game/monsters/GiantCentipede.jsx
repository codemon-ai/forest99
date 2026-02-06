import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '../../../data/config';

const SEGMENT_COUNT = 20;
const LEG_PAIRS = 10;

export default function GiantCentipede({ position, isInvincible = true }) {
  const groupRef = useRef();
  const time = useRef(0);
  
  useFrame((_, delta) => {
    time.current += delta * 2;
    
    if (groupRef.current) {
      const segments = groupRef.current.children;
      for (let i = 0; i < segments.length; i++) {
        if (segments[i].userData.isSegment) {
          const offset = Math.sin(time.current + i * 0.3) * 0.5;
          segments[i].position.x = offset;
        }
      }
    }
  });
  
  const segments = useMemo(() => {
    return Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
      key: `seg-${i}`,
      size: 0.4 - i * 0.01,
      y: 0.3,
      z: -i * 0.5,
      hasLegs: i < LEG_PAIRS * 2 && i % 2 === 0,
    }));
  }, []);
  
  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {segments.map(({ key, size, y, z, hasLegs }) => (
        <group key={key} position={[0, y, z]} userData={{ isSegment: true }}>
          <mesh castShadow>
            <sphereGeometry args={[size, 6, 4]} />
            <meshStandardMaterial color={COLORS.centipede} flatShading />
          </mesh>
          
          {hasLegs && (
            <>
              <mesh position={[-size - 0.1, -0.15, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <boxGeometry args={[0.05, 0.3, 0.05]} />
                <meshStandardMaterial color="#333" flatShading />
              </mesh>
              <mesh position={[size + 0.1, -0.15, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                <boxGeometry args={[0.05, 0.3, 0.05]} />
                <meshStandardMaterial color="#333" flatShading />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}
