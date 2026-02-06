import { useMemo } from 'react';
import { COLORS } from '../../data/config';

export default function LowPolyTree({ position = [0, 0, 0], scale = 1 }) {
  const rotation = useMemo(() => [0, Math.random() * Math.PI * 2, 0], []);
  
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 6]} />
        <meshStandardMaterial color={COLORS.tree_leaves} flatShading />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 6]} />
        <meshStandardMaterial color={COLORS.tree_leaves} flatShading />
      </mesh>
      <mesh position={[0, 4.3, 0]} castShadow>
        <coneGeometry args={[0.6, 1, 6]} />
        <meshStandardMaterial color={COLORS.tree_leaves} flatShading />
      </mesh>
    </group>
  );
}
