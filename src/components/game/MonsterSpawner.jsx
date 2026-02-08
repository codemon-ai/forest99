import { useState, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import Snake from './monsters/Snake';
import Monkey from './monsters/Monkey';
import Bear from './monsters/Bear';
import FireAnt from './monsters/FireAnt';
import MonsterWrapper from './MonsterWrapper';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { MONSTER_TYPES, MONSTER_STATS } from '../../data/monsters';
import { updateMonsterAI, AI_STATES } from '../../systems/AISystem';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';
import { GAME_CONFIG } from '../../data/config';

const MAX_MONSTERS = 25;
const SPAWN_INTERVAL = 6;
const BASE_RADIUS = 10;
const INITIAL_SPAWN_COUNT = 15;
const SPAWN_RANGE = 50;

const DAY_MONSTERS = [
  MONSTER_TYPES.SNAKE,
  MONSTER_TYPES.MONKEY,
  MONSTER_TYPES.BEAR,
  MONSTER_TYPES.FIRE_ANT,
];

const NIGHT_MONSTERS = [
  MONSTER_TYPES.SNAKE,
  MONSTER_TYPES.MONKEY,
  MONSTER_TYPES.BEAR,
];

const MONSTER_COMPONENTS = {
  [MONSTER_TYPES.SNAKE]: { component: Snake, healthBarHeight: 1.5 },
  [MONSTER_TYPES.MONKEY]: { component: Monkey, healthBarHeight: 2 },
  [MONSTER_TYPES.BEAR]: { component: Bear, healthBarHeight: 3 },
  [MONSTER_TYPES.FIRE_ANT]: { component: FireAnt, healthBarHeight: 0.8 },
};

export default function MonsterSpawner() {
  const [monsters, setMonsters] = useState([]);
  const isNight = useGameStore((state) => state.isNight);
  const playerPosition = usePlayerStore((state) => state.position);
  const spawnTimer = useRef(0);
  const initialSpawnDone = useRef(false);
  
  const createMonster = useCallback((type) => {
    let position;
    let attempts = 0;
    
    do {
      position = getRandomPosition(SPAWN_RANGE, 5);
      const distFromBase = Math.sqrt(position[0] ** 2 + position[2] ** 2);
      attempts++;
      if (distFromBase >= BASE_RADIUS) break;
    } while (attempts < 20);
    
    const height = getTerrainHeight(position[0], position[2]);
    position[1] = height;
    
    return {
      id: `monster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position,
      stats: MONSTER_STATS[type],
      hp: MONSTER_STATS[type].hp,
      state: AI_STATES.WANDER,
      wanderTarget: null,
    };
  }, []);
  
  const handleMonsterDeath = useCallback((id) => {
    setMonsters((prev) => prev.filter((m) => m.id !== id));
  }, []);
  
  useFrame((_, delta) => {
    if (!initialSpawnDone.current) {
      initialSpawnDone.current = true;
      const initialMonsters = [];
      for (let i = 0; i < INITIAL_SPAWN_COUNT; i++) {
        const type = DAY_MONSTERS[Math.floor(Math.random() * DAY_MONSTERS.length)];
        initialMonsters.push(createMonster(type));
      }
      setMonsters(initialMonsters);
      return;
    }
    
    spawnTimer.current += delta;
    
    if (spawnTimer.current >= SPAWN_INTERVAL) {
      spawnTimer.current = 0;
      
      if (monsters.length < MAX_MONSTERS) {
        const types = isNight ? NIGHT_MONSTERS : DAY_MONSTERS;
        const type = types[Math.floor(Math.random() * types.length)];
        setMonsters((prev) => [...prev, createMonster(type)]);
      }
    }
    
    setMonsters((prev) =>
      prev.map((monster) => updateMonsterAI(monster, playerPosition, delta))
    );
  });
  
  return (
    <group>
      {monsters.map((monster) => {
        const config = MONSTER_COMPONENTS[monster.type];
        if (!config) return null;
        
        const Component = config.component;
        
        return (
          <MonsterWrapper
            key={monster.id}
            id={monster.id}
            type={monster.type}
            position={monster.position}
            onDeath={handleMonsterDeath}
            healthBarHeight={config.healthBarHeight}
          >
            <Component position={[0, 0, 0]} />
          </MonsterWrapper>
        );
      })}
    </group>
  );
}
