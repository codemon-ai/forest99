import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS, GAME_CONFIG } from '../../data/config';
import { getTerrainHeight } from '../../utils/noise';

export default function Terrain() {
  const geometry = useMemo(() => {
    const size = GAME_CONFIG.worldSize;
    const segments = 50;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const height = getTerrainHeight(x, -y);
      positions.setZ(i, height);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial color={COLORS.grass} flatShading />
    </mesh>
  );
}
