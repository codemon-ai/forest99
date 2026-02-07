import { useState, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import GiantCentipede from './monsters/GiantCentipede';
import MonsterWrapper from './MonsterWrapper';
import { useGameStore } from '../../stores/gameStore';
import { MONSTER_TYPES } from '../../data/monsters';
import { updateCentipedeAI } from '../../systems/AISystem';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';
import { GAME_CONFIG } from '../../data/config';

const MAX_CENTIPEDES = 3;

export default function NightSpawner() {
  const [centipedes, setCentipedes] = useState([]);
  const isNight = useGameStore((state) => state.isNight);
  const spawnedThisNight = useRef(false);
  
  const handleCentipedeDeath = useCallback((id) => {
    setCentipedes((prev) => prev.filter((c) => c.id !== id));
  }, []);
  
  useEffect(() => {
    if (isNight && !spawnedThisNight.current) {
      spawnedThisNight.current = true;
      
      const newCentipedes = [];
      for (let i = 0; i < MAX_CENTIPEDES; i++) {
        const pos = getRandomPosition(GAME_CONFIG.worldSize, 20);
        const height = getTerrainHeight(pos[0], pos[2]);
        
        newCentipedes.push({
          id: `centipede-${Date.now()}-${i}`,
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
        <MonsterWrapper
          key={centipede.id}
          id={centipede.id}
          type={MONSTER_TYPES.GIANT_CENTIPEDE}
          position={centipede.position}
          onDeath={handleCentipedeDeath}
          healthBarHeight={2.5}
        >
          <GiantCentipede position={[0, 0, 0]} />
        </MonsterWrapper>
      ))}
    </group>
  );
}
