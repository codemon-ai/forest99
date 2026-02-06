# Phase 6: 몬스터 기본 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 4종 몬스터 (뱀, 원숭이, 곰, 불개미) 모델 및 AI 구현

**Architecture:** 공통 Monster 베이스 + 개별 몬스터 컴포넌트, 상태 기반 AI

**Tech Stack:** React Three Fiber, Zustand

---

## Task 1: 몬스터 데이터 정의

**Files:**
- Create: `src/data/monsters.js`

**Step 1: monsters.js 생성**

```javascript
export const MONSTER_TYPES = {
  SNAKE: 'snake',
  MONKEY: 'monkey',
  BEAR: 'bear',
  FIRE_ANT: 'fireAnt',
  CULTIST: 'cultist',
  GIANT_CENTIPEDE: 'giantCentipede',
  BOSS_ANT: 'bossAnt',
};

export const MONSTER_STATS = {
  [MONSTER_TYPES.SNAKE]: {
    name: 'Snake',
    hp: 30,
    attack: 10,
    speed: 3,
    detectionRange: 10,
    attackRange: 1.5,
    color: '#6b8e23',
  },
  [MONSTER_TYPES.MONKEY]: {
    name: 'Monkey',
    hp: 50,
    attack: 15,
    speed: 5,
    detectionRange: 15,
    attackRange: 2,
    color: '#a1887f',
  },
  [MONSTER_TYPES.BEAR]: {
    name: 'Bear',
    hp: 150,
    attack: 30,
    speed: 2,
    detectionRange: 12,
    attackRange: 2.5,
    color: '#5d4037',
  },
  [MONSTER_TYPES.FIRE_ANT]: {
    name: 'Fire Ant',
    hp: 10,
    attack: 5,
    speed: 4,
    detectionRange: 8,
    attackRange: 1,
    color: '#b71c1c',
  },
  [MONSTER_TYPES.CULTIST]: {
    name: 'Cultist',
    hp: 80,
    attack: 20,
    speed: 3,
    detectionRange: 20,
    attackRange: 2,
    color: '#212121',
  },
};
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add monster data definitions"
```

---

## Task 2: AI 시스템 생성

**Files:**
- Create: `src/systems/AISystem.js`

**Step 1: AISystem.js 생성**

```javascript
import * as THREE from 'three';

export const AI_STATES = {
  IDLE: 'idle',
  WANDER: 'wander',
  CHASE: 'chase',
  ATTACK: 'attack',
  FLEE: 'flee',
};

export function getDistanceToPlayer(monsterPos, playerPos) {
  const dx = monsterPos[0] - playerPos[0];
  const dz = monsterPos[2] - playerPos[2];
  return Math.sqrt(dx * dx + dz * dz);
}

export function getDirectionToPlayer(monsterPos, playerPos) {
  const dx = playerPos[0] - monsterPos[0];
  const dz = playerPos[2] - monsterPos[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  if (length === 0) return [0, 0];
  return [dx / length, dz / length];
}

export function updateMonsterAI(monster, playerPos, delta) {
  const { position, stats, state, wanderTarget, lastStateChange } = monster;
  const distance = getDistanceToPlayer(position, playerPos);
  
  let newState = state;
  let newPosition = [...position];
  let newWanderTarget = wanderTarget;
  
  if (distance <= stats.attackRange) {
    newState = AI_STATES.ATTACK;
  } else if (distance <= stats.detectionRange) {
    newState = AI_STATES.CHASE;
  } else if (state === AI_STATES.CHASE) {
    newState = AI_STATES.WANDER;
  }
  
  switch (newState) {
    case AI_STATES.WANDER: {
      if (!newWanderTarget || Math.random() < 0.01) {
        newWanderTarget = [
          position[0] + (Math.random() - 0.5) * 20,
          position[2] + (Math.random() - 0.5) * 20,
        ];
      }
      
      const [dx, dz] = [
        newWanderTarget[0] - position[0],
        newWanderTarget[1] - position[2],
      ];
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist > 1) {
        newPosition[0] += (dx / dist) * stats.speed * 0.5 * delta;
        newPosition[2] += (dz / dist) * stats.speed * 0.5 * delta;
      }
      break;
    }
    
    case AI_STATES.CHASE: {
      const [dx, dz] = getDirectionToPlayer(position, playerPos);
      newPosition[0] += dx * stats.speed * delta;
      newPosition[2] += dz * stats.speed * delta;
      break;
    }
    
    case AI_STATES.ATTACK: {
      break;
    }
  }
  
  return {
    ...monster,
    position: newPosition,
    state: newState,
    wanderTarget: newWanderTarget,
  };
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add AI system for monster behavior"
```

---

## Task 3: 뱀 컴포넌트

**Files:**
- Create: `src/components/game/monsters/Snake.jsx`

**Step 1: Snake.jsx 생성**

```jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

const SEGMENT_COUNT = 8;

export default function Snake({ position, onUpdate }) {
  const groupRef = useRef();
  const stats = MONSTER_STATS[MONSTER_TYPES.SNAKE];
  const time = useRef(0);
  
  useFrame((_, delta) => {
    time.current += delta * 3;
    
    if (groupRef.current) {
      const children = groupRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const offset = Math.sin(time.current + i * 0.5) * 0.3;
        children[i].position.x = offset;
      }
    }
  });
  
  const segments = useMemo(() => {
    return Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
      key: i,
      size: 0.3 - i * 0.02,
      y: 0.2,
      z: -i * 0.35,
    }));
  }, []);
  
  return (
    <group ref={groupRef} position={position}>
      {segments.map(({ key, size, y, z }) => (
        <mesh key={key} position={[0, y, z]} castShadow>
          <sphereGeometry args={[size, 6, 4]} />
          <meshStandardMaterial color={stats.color} flatShading />
        </mesh>
      ))}
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Snake monster component"
```

---

## Task 4: 원숭이 컴포넌트

**Files:**
- Create: `src/components/game/monsters/Monkey.jsx`

**Step 1: Monkey.jsx 생성**

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

export default function Monkey({ position }) {
  const groupRef = useRef();
  const stats = MONSTER_STATS[MONSTER_TYPES.MONKEY];
  const jumpPhase = useRef(0);
  
  useFrame((_, delta) => {
    jumpPhase.current += delta * 5;
    if (groupRef.current) {
      groupRef.current.position.y = Math.abs(Math.sin(jumpPhase.current)) * 0.5;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.3, 6, 4]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.3]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.25, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.25, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.3, 0.12]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.3, 0.12]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Monkey monster component"
```

---

## Task 5: 곰 컴포넌트

**Files:**
- Create: `src/components/game/monsters/Bear.jsx`

**Step 1: Bear.jsx 생성**

```jsx
import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

export default function Bear({ position }) {
  const stats = MONSTER_STATS[MONSTER_TYPES.BEAR];
  
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0.5]} castShadow>
        <sphereGeometry args={[0.45, 6, 4]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 0.8, 1.2]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.35, 0.2, 0.35]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.35, 0.2, 0.35]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[-0.35, 0.2, -0.35]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.35, 0.2, -0.35]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Bear monster component"
```

---

## Task 6: 불개미 컴포넌트

**Files:**
- Create: `src/components/game/monsters/FireAnt.jsx`

**Step 1: FireAnt.jsx 생성**

```jsx
import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

export default function FireAnt({ position }) {
  const stats = MONSTER_STATS[MONSTER_TYPES.FIRE_ANT];
  
  return (
    <group position={position} scale={0.5}>
      <mesh position={[0, 0.15, 0.25]} castShadow>
        <sphereGeometry args={[0.15, 5, 3]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.2, 5, 3]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.2, -0.35]} castShadow>
        <sphereGeometry args={[0.25, 5, 3]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.15, 0.05, 0.1]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
      <mesh position={[0.15, 0.05, 0.1]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
      <mesh position={[-0.18, 0.05, -0.1]} rotation={[0, 0, Math.PI / 3]} castShadow>
        <boxGeometry args={[0.02, 0.18, 0.02]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
      <mesh position={[0.18, 0.05, -0.1]} rotation={[0, 0, -Math.PI / 3]} castShadow>
        <boxGeometry args={[0.02, 0.18, 0.02]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add FireAnt monster component"
```

---

## Task 7: 몬스터 스포너

**Files:**
- Create: `src/components/game/MonsterSpawner.jsx`

**Step 1: MonsterSpawner.jsx 생성**

```jsx
import { useState, useEffect } from 'react';
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
  
  const spawnMonster = () => {
    if (monsters.length >= MAX_MONSTERS) return;
    if (isNight) return;
    
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
  };
  
  useFrame((_, delta) => {
    spawnTimer.current += delta;
    
    if (spawnTimer.current >= SPAWN_INTERVAL) {
      spawnTimer.current = 0;
      spawnMonster();
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
```

**Step 2: World.jsx에 추가**

```jsx
import MonsterSpawner from './MonsterSpawner';

// World 컴포넌트 return 안에 추가
<MonsterSpawner />
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add monster spawner with AI"
```

---

## Phase 6 완료 체크리스트

- [ ] 뱀: 구체 8개 연결, 사인파 움직임
- [ ] 원숭이: 박스 조합, 점프 이동
- [ ] 곰: 큰 박스 조합
- [ ] 불개미: 구체 3개 + 다리
- [ ] AI: 랜덤 배회
- [ ] AI: 플레이어 발견 시 추적
- [ ] AI: 가까우면 공격 상태
- [ ] 낮에만 스폰
- [ ] 기지 근처엔 스폰 안 함

---

## 다음 Phase

Phase 6 완료 후 → Phase 7 (거대 지네 & 광신도) 진행
