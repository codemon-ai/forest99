import { useMemo } from 'react';
import { COLORS, GAME_CONFIG } from '../../data/config';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';

const NEST_COUNT = 10;
const MIN_DISTANCE_FROM_BASE = 20;
const MIN_DISTANCE_BETWEEN_NESTS = 15;

function SingleNest({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[1.5, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.dirt} flatShading />
      </mesh>
      
      <mesh position={[1, 0, 0.5]} castShadow>
        <sphereGeometry args={[0.6, 5, 3, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.dirt} flatShading />
      </mesh>
      <mesh position={[-0.8, 0, 0.8]} castShadow>
        <sphereGeometry args={[0.5, 5, 3, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.dirt} flatShading />
      </mesh>
      
      <mesh position={[0, 0.3, 1]} rotation={[Math.PI / 4, 0, 0]}>
        <circleGeometry args={[0.3, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

export default function AntNest() {
  const nests = useMemo(() => {
    const result = [];
    const mapSize = GAME_CONFIG.worldSize;
    
    for (let i = 0; i < NEST_COUNT; i++) {
      let position;
      let attempts = 0;
      let valid = false;
      
      while (!valid && attempts < 50) {
        position = getRandomPosition(mapSize, 10);
        const distFromBase = Math.sqrt(position[0] ** 2 + position[2] ** 2);
        
        if (distFromBase < MIN_DISTANCE_FROM_BASE) {
          attempts++;
          continue;
        }
        
        valid = result.every(nest => {
          const dx = nest.position[0] - position[0];
          const dz = nest.position[2] - position[2];
          return Math.sqrt(dx * dx + dz * dz) >= MIN_DISTANCE_BETWEEN_NESTS;
        });
        
        attempts++;
      }
      
      if (valid) {
        const height = getTerrainHeight(position[0], position[2]);
        position[1] = height;
        result.push({ position, key: i });
      }
    }
    
    return result;
  }, []);

  return (
    <group>
      {nests.map(({ position, key }) => (
        <SingleNest key={key} position={position} />
      ))}
    </group>
  );
}
