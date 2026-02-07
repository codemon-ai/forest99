import { useMemo, useEffect } from 'react';
import LowPolyTree from '../lowpoly/LowPolyTree';
import { GAME_CONFIG } from '../../data/config';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';
import { registerCollider, unregisterCollider } from '../../systems/CollisionSystem';
import { useResourceStore } from '../../stores/resourceStore';

const TREE_COUNT = 100;
const BASE_RADIUS = 10;

export default function Forest() {
  const registerResource = useResourceStore((state) => state.registerResource);
  const unregisterResource = useResourceStore((state) => state.unregisterResource);
  
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
      
      result.push({ position, scale, key: i, id: `tree-${i}` });
    }
    
    return result;
  }, []);

  useEffect(() => {
    const colliderIds = trees.map(tree => 
      registerCollider(tree.position, 0.4 * tree.scale, 'tree')
    );
    
    trees.forEach(tree => {
      registerResource(tree.id, 'tree', tree.position);
    });
    
    return () => {
      colliderIds.forEach(unregisterCollider);
      trees.forEach(tree => {
        unregisterResource(tree.id);
      });
    };
  }, [trees, registerResource, unregisterResource]);

  return (
    <group>
      {trees.map(({ position, scale, key }) => (
        <LowPolyTree key={key} position={position} scale={scale} />
      ))}
    </group>
  );
}
