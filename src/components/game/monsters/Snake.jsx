import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

const SEGMENT_COUNT = 8;

export default function Snake({ position }) {
  const groupRef = useRef();
  const stats = MONSTER_STATS[MONSTER_TYPES.SNAKE];
  const time = useRef(0);
  
  useFrame((_, delta) => {
    time.current += delta * 3;
    
    if (groupRef.current) {
      const children = groupRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const offset = Math.sin(time.current + i * 0.5) * 0.3;
        children[i].position.x = offset;
      }
    }
  });
  
  const segments = useMemo(() => {
    return Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
      key: i,
      size: 0.3 - i * 0.02,
      y: 0.2,
      z: -i * 0.35,
    }));
  }, []);
  
  return (
    <group ref={groupRef} position={position}>
      {segments.map(({ key, size, y, z }) => (
        <mesh key={key} position={[0, y, z]} castShadow>
          <sphereGeometry args={[size, 6, 4]} />
          <meshStandardMaterial color={stats.color} flatShading />
        </mesh>
      ))}
    </group>
  );
}
