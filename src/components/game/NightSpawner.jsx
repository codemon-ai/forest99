import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import GiantCentipede from './monsters/GiantCentipede';
import { useGameStore } from '../../stores/gameStore';
import { updateCentipedeAI } from '../../systems/AISystem';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';
import { GAME_CONFIG } from '../../data/config';

const MAX_CENTIPEDES = 3;

export default function NightSpawner() {
  const [centipedes, setCentipedes] = useState([]);
  const isNight = useGameStore((state) => state.isNight);
  const spawnedThisNight = useRef(false);
  
  useEffect(() => {
    if (isNight && !spawnedThisNight.current) {
      spawnedThisNight.current = true;
      
      const newCentipedes = [];
      for (let i = 0; i < MAX_CENTIPEDES; i++) {
        const pos = getRandomPosition(GAME_CONFIG.worldSize, 20);
        const height = getTerrainHeight(pos[0], pos[2]);
        
        newCentipedes.push({
          id: Date.now() + i,
          position: [pos[0], height, pos[2]],
          speed: 4,
          wanderTarget: null,
        });
      }
      
      setCentipedes(newCentipedes);
    }
    
    if (!isNight) {
      spawnedThisNight.current = false;
      setCentipedes([]);
    }
  }, [isNight]);
  
  useFrame((_, delta) => {
    if (!isNight) return;
    
    setCentipedes((prev) =>
      prev.map((c) => updateCentipedeAI(c, [0, 0, 0], delta))
    );
  });
  
  if (!isNight) return null;
  
  return (
    <group>
      {centipedes.map((centipede) => (
        <GiantCentipede
          key={centipede.id}
          position={centipede.position}
          isInvincible={true}
        />
      ))}
    </group>
  );
}
