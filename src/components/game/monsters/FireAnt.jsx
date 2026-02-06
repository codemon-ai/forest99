import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

export default function FireAnt({ position }) {
  const stats = MONSTER_STATS[MONSTER_TYPES.FIRE_ANT];
  
  return (
    <group position={position} scale={0.5}>
      <mesh position={[0, 0.15, 0.25]} castShadow>
        <sphereGeometry args={[0.15, 5, 3]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.2, 5, 3]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.2, -0.35]} castShadow>
        <sphereGeometry args={[0.25, 5, 3]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.15, 0.05, 0.1]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
      <mesh position={[0.15, 0.05, 0.1]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
      <mesh position={[-0.18, 0.05, -0.1]} rotation={[0, 0, Math.PI / 3]} castShadow>
        <boxGeometry args={[0.02, 0.18, 0.02]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
      <mesh position={[0.18, 0.05, -0.1]} rotation={[0, 0, -Math.PI / 3]} castShadow>
        <boxGeometry args={[0.02, 0.18, 0.02]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
    </group>
  );
}
