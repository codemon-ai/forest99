import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../data/config';

export default function LowPolyRock({ position = [0, 0, 0], scale = 1 }) {
  const rotation = useMemo(() => [
    Math.random() * 0.3,
    Math.random() * Math.PI * 2,
    Math.random() * 0.3,
  ], []);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.5, 0);
    const positions = geo.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const noise = 0.9 + Math.random() * 0.2;
      positions.setXYZ(i, x * noise, y * noise * 0.7, z * noise);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      position={position}
      scale={scale}
      rotation={rotation}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={COLORS.rock} flatShading />
    </mesh>
  );
}
