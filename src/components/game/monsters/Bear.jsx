import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

export default function Bear({ position }) {
  const stats = MONSTER_STATS[MONSTER_TYPES.BEAR];
  
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0.5]} castShadow>
        <sphereGeometry args={[0.45, 6, 4]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 0.8, 1.2]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.35, 0.2, 0.35]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.35, 0.2, 0.35]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[-0.35, 0.2, -0.35]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.35, 0.2, -0.35]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
    </group>
  );
}
