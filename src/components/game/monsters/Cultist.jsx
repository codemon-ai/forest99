import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

export default function Cultist({ position }) {
  const stats = MONSTER_STATS[MONSTER_TYPES.CULTIST];
  
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 6, 4]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
      
      <mesh position={[0, 1.65, 0.05]} castShadow>
        <coneGeometry args={[0.25, 0.3, 4]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[0.5, 1.5, 6]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.4, 1.1, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.4, 1.1, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.12, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
      <mesh position={[0.12, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
    </group>
  );
}
