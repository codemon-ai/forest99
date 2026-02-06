import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Snake from './monsters/Snake';
import Monkey from './monsters/Monkey';
import Bear from './monsters/Bear';
import FireAnt from './monsters/FireAnt';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { MONSTER_TYPES, MONSTER_STATS } from '../../data/monsters';
import { updateMonsterAI, AI_STATES } from '../../systems/AISystem';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';
import { GAME_CONFIG } from '../../data/config';

const MAX_MONSTERS = 20;
const SPAWN_INTERVAL = 10;
const BASE_RADIUS = 15;

const MONSTER_COMPONENTS = {
  [MONSTER_TYPES.SNAKE]: Snake,
  [MONSTER_TYPES.MONKEY]: Monkey,
  [MONSTER_TYPES.BEAR]: Bear,
  [MONSTER_TYPES.FIRE_ANT]: FireAnt,
};

export default function MonsterSpawner() {
  const [monsters, setMonsters] = useState([]);
  const isNight = useGameStore((state) => state.isNight);
  const playerPosition = usePlayerStore((state) => state.position);
  const spawnTimer = useRef(0);
  
  useFrame((_, delta) => {
    spawnTimer.current += delta;
    
    if (spawnTimer.current >= SPAWN_INTERVAL) {
      spawnTimer.current = 0;
      
      if (monsters.length < MAX_MONSTERS && !isNight) {
        const types = [
          MONSTER_TYPES.SNAKE,
          MONSTER_TYPES.MONKEY,
          MONSTER_TYPES.BEAR,
          MONSTER_TYPES.FIRE_ANT,
        ];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let position;
        let attempts = 0;
        
        do {
          position = getRandomPosition(GAME_CONFIG.worldSize, 10);
          const distFromBase = Math.sqrt(position[0] ** 2 + position[2] ** 2);
          attempts++;
          if (distFromBase >= BASE_RADIUS) break;
        } while (attempts < 20);
        
        const height = getTerrainHeight(position[0], position[2]);
        position[1] = height;
        
        const newMonster = {
          id: Date.now() + Math.random(),
          type,
          position,
          stats: MONSTER_STATS[type],
          hp: MONSTER_STATS[type].hp,
          state: AI_STATES.WANDER,
          wanderTarget: null,
        };
        
        setMonsters((prev) => [...prev, newMonster]);
      }
    }
    
    setMonsters((prev) =>
      prev.map((monster) => updateMonsterAI(monster, playerPosition, delta))
    );
  });
  
  return (
    <group>
      {monsters.map((monster) => {
        const Component = MONSTER_COMPONENTS[monster.type];
        if (!Component) return null;
        
        return (
          <Component
            key={monster.id}
            position={monster.position}
          />
        );
      })}
    </group>
  );
}
