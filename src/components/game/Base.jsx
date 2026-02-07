import { COLORS } from '../../data/config';
import { getTerrainHeight } from '../../utils/noise';

export default function Base() {
  const terrainY = getTerrainHeight(0, 0);
  
  return (
    <group position={[0, terrainY, 0]}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[6, 0.1, 6]} />
        <meshStandardMaterial color={COLORS.dirt} flatShading />
      </mesh>
      
      <mesh position={[0, 1.5, 3]} castShadow>
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      <mesh position={[0, 1, 3.05]}>
        <boxGeometry args={[1.2, 2, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      <mesh position={[0, 1.5, -3]} castShadow>
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      
      <mesh position={[-3, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      <mesh position={[-3.05, 1.5, 0]}>
        <boxGeometry args={[0.3, 1, 1]} />
        <meshStandardMaterial color="#4fc3f7" flatShading />
      </mesh>
      
      <mesh position={[3, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      <mesh position={[3.05, 1.5, 0]}>
        <boxGeometry args={[0.3, 1, 1]} />
        <meshStandardMaterial color="#4fc3f7" flatShading />
      </mesh>
      
      <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[5, 2, 4]} />
        <meshStandardMaterial color="#8d6e63" flatShading />
      </mesh>
    </group>
  );
}
