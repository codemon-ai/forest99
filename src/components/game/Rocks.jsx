import { useMemo, useEffect } from 'react';
import LowPolyRock from '../lowpoly/LowPolyRock';
import { GAME_CONFIG } from '../../data/config';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';
import { useResourceStore } from '../../stores/resourceStore';

const ROCK_COUNT = 30;

export default function Rocks() {
  const registerResource = useResourceStore((state) => state.registerResource);
  const unregisterResource = useResourceStore((state) => state.unregisterResource);
  
  const rocks = useMemo(() => {
    const result = [];
    const mapSize = GAME_CONFIG.worldSize;
    
    for (let i = 0; i < ROCK_COUNT; i++) {
      const position = getRandomPosition(mapSize);
      const height = getTerrainHeight(position[0], position[2]);
      position[1] = height + 0.2;
      
      const scale = 0.5 + Math.random() * 1.5;
      
      result.push({ position, scale, key: i, id: `rock-${i}` });
    }
    
    return result;
  }, []);
  
  useEffect(() => {
    rocks.forEach(rock => {
      registerResource(rock.id, 'rock', rock.position);
    });
    
    return () => {
      rocks.forEach(rock => {
        unregisterResource(rock.id);
      });
    };
  }, [rocks, registerResource, unregisterResource]);

  return (
    <group>
      {rocks.map(({ position, scale, key }) => (
        <LowPolyRock key={key} position={position} scale={scale} />
      ))}
    </group>
  );
}
