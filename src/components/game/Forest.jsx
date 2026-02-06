import { useMemo, useEffect } from 'react';
import LowPolyTree from '../lowpoly/LowPolyTree';
import { GAME_CONFIG } from '../../data/config';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';
import { registerCollider, unregisterCollider } from '../../systems/CollisionSystem';

const TREE_COUNT = 100;
const BASE_RADIUS = 10;

export default function Forest() {
  const trees = useMemo(() => {
    const result = [];
    const mapSize = GAME_CONFIG.worldSize;
    
    for (let i = 0; i < TREE_COUNT; i++) {
      let position;
      let attempts = 0;
      
      do {
        position = getRandomPosition(mapSize);
        attempts++;
      } while (
        Math.sqrt(position[0] ** 2 + position[2] ** 2) < BASE_RADIUS &&
        attempts < 10
      );
      
      const height = getTerrainHeight(position[0], position[2]);
      position[1] = height;
      
      const scale = 0.8 + Math.random() * 0.6;
      
      result.push({ position, scale, key: i });
    }
    
    return result;
  }, []);

  useEffect(() => {
    const ids = trees.map(tree => 
      registerCollider(tree.position, 0.4 * tree.scale, 'tree')
    );
    
    return () => {
      ids.forEach(unregisterCollider);
    };
  }, [trees]);

  return (
    <group>
      {trees.map(({ position, scale, key }) => (
        <LowPolyTree key={key} position={position} scale={scale} />
      ))}
    </group>
  );
}
