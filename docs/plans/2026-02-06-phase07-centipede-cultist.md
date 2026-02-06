# Phase 7: 거대 지네 & 광신도 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 밤 전용 거대 지네 (처치 불가, 기지 근처 도망) + 광신도 (습격 이벤트용)

**Architecture:** 특수 AI 로직 + 밤 전용 스폰 시스템

**Tech Stack:** React Three Fiber

---

## Task 1: 거대 지네 컴포넌트

**Files:**
- Create: `src/components/game/monsters/GiantCentipede.jsx`

**Step 1: GiantCentipede.jsx 생성**

```jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '../../../data/config';

const SEGMENT_COUNT = 20;
const LEG_PAIRS = 10;

export default function GiantCentipede({ position, isInvincible = true }) {
  const groupRef = useRef();
  const time = useRef(0);
  
  useFrame((_, delta) => {
    time.current += delta * 2;
    
    if (groupRef.current) {
      const segments = groupRef.current.children;
      for (let i = 0; i < segments.length; i++) {
        if (segments[i].userData.isSegment) {
          const offset = Math.sin(time.current + i * 0.3) * 0.5;
          segments[i].position.x = offset;
        }
      }
    }
  });
  
  const segments = useMemo(() => {
    return Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
      key: `seg-${i}`,
      size: 0.4 - i * 0.01,
      y: 0.3,
      z: -i * 0.5,
      hasLegs: i < LEG_PAIRS * 2 && i % 2 === 0,
    }));
  }, []);
  
  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {segments.map(({ key, size, y, z, hasLegs }) => (
        <group key={key} position={[0, y, z]} userData={{ isSegment: true }}>
          <mesh castShadow>
            <sphereGeometry args={[size, 6, 4]} />
            <meshStandardMaterial color={COLORS.centipede} flatShading />
          </mesh>
          
          {hasLegs && (
            <>
              <mesh position={[-size - 0.1, -0.15, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <boxGeometry args={[0.05, 0.3, 0.05]} />
                <meshStandardMaterial color="#333" flatShading />
              </mesh>
              <mesh position={[size + 0.1, -0.15, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                <boxGeometry args={[0.05, 0.3, 0.05]} />
                <meshStandardMaterial color="#333" flatShading />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add GiantCentipede monster component"
```

---

## Task 2: 광신도 컴포넌트

**Files:**
- Create: `src/components/game/monsters/Cultist.jsx`

**Step 1: Cultist.jsx 생성**

```jsx
import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

export default function Cultist({ position }) {
  const stats = MONSTER_STATS[MONSTER_TYPES.CULTIST];
  
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 6, 4]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
      
      <mesh position={[0, 1.65, 0.05]} castShadow>
        <coneGeometry args={[0.25, 0.3, 4]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[0.5, 1.5, 6]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.4, 1.1, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      <mesh position={[0.4, 1.1, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.12, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
      <mesh position={[0.12, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Cultist monster component"
```

---

## Task 3: 거대 지네 AI 로직

**Files:**
- Modify: `src/systems/AISystem.js`

**Step 1: 지네 전용 AI 추가**

```javascript
export function updateCentipedeAI(centipede, playerPos, delta) {
  const { position, speed } = centipede;
  const BASE_RADIUS = 15;
  
  const distFromBase = Math.sqrt(position[0] ** 2 + position[2] ** 2);
  
  if (distFromBase < BASE_RADIUS) {
    const fleeDir = [
      position[0] / distFromBase,
      position[2] / distFromBase,
    ];
    return {
      ...centipede,
      position: [
        position[0] + fleeDir[0] * speed * delta,
        position[1],
        position[2] + fleeDir[1] * speed * delta,
      ],
      state: AI_STATES.FLEE,
    };
  }
  
  if (!centipede.wanderTarget || Math.random() < 0.005) {
    centipede.wanderTarget = [
      position[0] + (Math.random() - 0.5) * 30,
      position[2] + (Math.random() - 0.5) * 30,
    ];
  }
  
  const [dx, dz] = [
    centipede.wanderTarget[0] - position[0],
    centipede.wanderTarget[1] - position[2],
  ];
  const dist = Math.sqrt(dx * dx + dz * dz);
  
  if (dist > 1) {
    return {
      ...centipede,
      position: [
        position[0] + (dx / dist) * speed * delta,
        position[1],
        position[2] + (dz / dist) * speed * delta,
      ],
      state: AI_STATES.WANDER,
    };
  }
  
  return centipede;
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add centipede AI with base flee behavior"
```

---

## Task 4: 밤 전용 스포너

**Files:**
- Create: `src/components/game/NightSpawner.jsx`

**Step 1: NightSpawner.jsx 생성**

```jsx
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
```

**Step 2: World.jsx에 추가**

```jsx
import NightSpawner from './NightSpawner';

// return 안에 추가
<NightSpawner />
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add night spawner for giant centipedes"
```

---

## Phase 7 완료 체크리스트

- [ ] 거대 지네: 구체 20개 연결
- [ ] 거대 지네: 각 세그먼트에 다리
- [ ] 거대 지네: 보라색
- [ ] 거대 지네: 밤에만 출현
- [ ] 거대 지네: 기지 근처 가면 도망
- [ ] 거대 지네: 처치 불가능
- [ ] 광신도: 사람 형태, 검은 로브
- [ ] 광신도: 두건으로 얼굴 가림

---

## 다음 Phase

Phase 7 완료 후 → Phase 8 (전투 시스템) 진행
