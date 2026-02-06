import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

export default function Monkey({ position }) {
  const groupRef = useRef();
  const stats = MONSTER_STATS[MONSTER_TYPES.MONKEY];
  const jumpPhase = useRef(0);
  
  useFrame((_, delta) => {
    jumpPhase.current += delta * 5;
    if (groupRef.current) {
      groupRef.current.position.y = Math.abs(Math.sin(jumpPhase.current)) * 0.5;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.3, 6, 4]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.3]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.25, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.25, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.3, 0.12]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.3, 0.12]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
    </group>
  );
}
