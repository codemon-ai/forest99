# Phase 2: 로우폴리 월드 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Perlin noise 지형, 로우폴리 나무/돌, 기지, 불개미집이 있는 숲 월드 구현

**Architecture:** 개별 컴포넌트로 분리하여 재사용성 확보, Perlin noise로 자연스러운 배치

**Tech Stack:** @react-three/fiber, @react-three/drei, simplex-noise

---

## Task 1: Perlin Noise 지형 생성

**Files:**
- Create: `src/utils/noise.js`
- Create: `src/components/game/Terrain.jsx`
- Modify: `src/components/game/World.jsx`

**Step 1: simplex-noise 패키지 설치**

```bash
npm install simplex-noise
```

**Step 2: noise.js 유틸리티 생성**

```javascript
// src/utils/noise.js
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

export function getTerrainHeight(x, z, scale = 0.05, amplitude = 2) {
  return noise2D(x * scale, z * scale) * amplitude;
}

export function getRandomPosition(mapSize, margin = 5) {
  const halfSize = mapSize / 2 - margin;
  return [
    (Math.random() - 0.5) * 2 * halfSize,
    0,
    (Math.random() - 0.5) * 2 * halfSize,
  ];
}
```

**Step 3: Terrain.jsx 생성**

```jsx
// src/components/game/Terrain.jsx
import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS, GAME_CONFIG } from '../../data/config';
import { getTerrainHeight } from '../../utils/noise';

export default function Terrain() {
  const geometry = useMemo(() => {
    const size = GAME_CONFIG.worldSize;
    const segments = 50;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const height = getTerrainHeight(x, y);
      positions.setZ(i, height);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial color={COLORS.grass} flatShading />
    </mesh>
  );
}
```

**Step 4: World.jsx에서 Ground를 Terrain으로 교체**

```jsx
// src/components/game/World.jsx
import Terrain from './Terrain';
// Ground 컴포넌트 삭제하고 <Terrain /> 사용
```

**Step 5: 개발 서버에서 확인**

Expected: 지형에 약간의 굴곡이 있음

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add procedural terrain with Perlin noise"
```

---

## Task 2: 로우폴리 나무 컴포넌트

**Files:**
- Create: `src/components/lowpoly/LowPolyTree.jsx`
- Create: `src/components/game/Forest.jsx`
- Modify: `src/components/game/World.jsx`

**Step 1: LowPolyTree.jsx 생성**

```jsx
// src/components/lowpoly/LowPolyTree.jsx
import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../data/config';

export default function LowPolyTree({ position = [0, 0, 0], scale = 1 }) {
  const rotation = useMemo(() => [0, Math.random() * Math.PI * 2, 0], []);
  
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* 나무 줄기 - 6각형 기둥 */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      
      {/* 나뭇잎 - 6각형 콘 (3단) */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 6]} />
        <meshStandardMaterial color={COLORS.tree_leaves} flatShading />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 6]} />
        <meshStandardMaterial color={COLORS.tree_leaves} flatShading />
      </mesh>
      <mesh position={[0, 4.3, 0]} castShadow>
        <coneGeometry args={[0.6, 1, 6]} />
        <meshStandardMaterial color={COLORS.tree_leaves} flatShading />
      </mesh>
    </group>
  );
}
```

**Step 2: Forest.jsx 생성 (나무 100개 배치)**

```jsx
// src/components/game/Forest.jsx
import { useMemo } from 'react';
import LowPolyTree from '../lowpoly/LowPolyTree';
import { GAME_CONFIG } from '../../data/config';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';

const TREE_COUNT = 100;
const BASE_RADIUS = 10; // 기지 주변 나무 없는 반경

export default function Forest() {
  const trees = useMemo(() => {
    const result = [];
    const mapSize = GAME_CONFIG.worldSize;
    
    for (let i = 0; i < TREE_COUNT; i++) {
      let position;
      let attempts = 0;
      
      // 기지 근처(맵 중앙)에는 나무 배치 안 함
      do {
        position = getRandomPosition(mapSize);
        attempts++;
      } while (
        Math.sqrt(position[0] ** 2 + position[2] ** 2) < BASE_RADIUS &&
        attempts < 10
      );
      
      // 지형 높이에 맞춤
      const height = getTerrainHeight(position[0], position[2]);
      position[1] = height;
      
      const scale = 0.8 + Math.random() * 0.6; // 0.8 ~ 1.4
      
      result.push({ position, scale, key: i });
    }
    
    return result;
  }, []);

  return (
    <group>
      {trees.map(({ position, scale, key }) => (
        <LowPolyTree key={key} position={position} scale={scale} />
      ))}
    </group>
  );
}
```

**Step 3: World.jsx에 Forest 추가**

```jsx
import Forest from './Forest';
// return 안에 <Forest /> 추가
```

**Step 4: 개발 서버에서 확인**

Expected: 맵에 100개의 나무가 자연스럽게 배치됨, 중앙 근처에는 나무 없음

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add low-poly trees with random placement"
```

---

## Task 3: 로우폴리 돌 컴포넌트

**Files:**
- Create: `src/components/lowpoly/LowPolyRock.jsx`
- Create: `src/components/game/Rocks.jsx`
- Modify: `src/components/game/World.jsx`

**Step 1: LowPolyRock.jsx 생성**

```jsx
// src/components/lowpoly/LowPolyRock.jsx
import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../data/config';

export default function LowPolyRock({ position = [0, 0, 0], scale = 1 }) {
  const rotation = useMemo(() => [
    Math.random() * 0.3,
    Math.random() * Math.PI * 2,
    Math.random() * 0.3,
  ], []);

  // 약간 변형된 정이십면체로 자연스러운 돌 표현
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.5, 0);
    const positions = geo.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // 각 정점을 약간 랜덤하게 변형
      const noise = 0.9 + Math.random() * 0.2;
      positions.setXYZ(i, x * noise, y * noise * 0.7, z * noise);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      position={position}
      scale={scale}
      rotation={rotation}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={COLORS.rock} flatShading />
    </mesh>
  );
}
```

**Step 2: Rocks.jsx 생성 (돌 30개 배치)**

```jsx
// src/components/game/Rocks.jsx
import { useMemo } from 'react';
import LowPolyRock from '../lowpoly/LowPolyRock';
import { GAME_CONFIG } from '../../data/config';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';

const ROCK_COUNT = 30;

export default function Rocks() {
  const rocks = useMemo(() => {
    const result = [];
    const mapSize = GAME_CONFIG.worldSize;
    
    for (let i = 0; i < ROCK_COUNT; i++) {
      const position = getRandomPosition(mapSize);
      const height = getTerrainHeight(position[0], position[2]);
      position[1] = height + 0.2; // 땅 위로 약간 올림
      
      const scale = 0.5 + Math.random() * 1.5; // 0.5 ~ 2.0
      
      result.push({ position, scale, key: i });
    }
    
    return result;
  }, []);

  return (
    <group>
      {rocks.map(({ position, scale, key }) => (
        <LowPolyRock key={key} position={position} scale={scale} />
      ))}
    </group>
  );
}
```

**Step 3: World.jsx에 Rocks 추가**

```jsx
import Rocks from './Rocks';
// return 안에 <Rocks /> 추가
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add low-poly rocks with random placement"
```

---

## Task 4: 기지 (Base) 컴포넌트

**Files:**
- Create: `src/components/game/Base.jsx`
- Modify: `src/components/game/World.jsx`

**Step 1: Base.jsx 생성**

```jsx
// src/components/game/Base.jsx
import { COLORS } from '../../data/config';

export default function Base() {
  return (
    <group position={[0, 0, 0]}>
      {/* 바닥 */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[6, 0.1, 6]} />
        <meshStandardMaterial color={COLORS.dirt} flatShading />
      </mesh>
      
      {/* 벽 - 앞 (문 있음) */}
      <mesh position={[0, 1.5, 3]} castShadow>
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      {/* 문 구멍 */}
      <mesh position={[0, 1, 3.05]}>
        <boxGeometry args={[1.2, 2, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* 벽 - 뒤 */}
      <mesh position={[0, 1.5, -3]} castShadow>
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      
      {/* 벽 - 왼쪽 */}
      <mesh position={[-3, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      {/* 창문 */}
      <mesh position={[-3.05, 1.5, 0]}>
        <boxGeometry args={[0.3, 1, 1]} />
        <meshStandardMaterial color="#4fc3f7" flatShading />
      </mesh>
      
      {/* 벽 - 오른쪽 */}
      <mesh position={[3, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color={COLORS.tree_trunk} flatShading />
      </mesh>
      {/* 창문 */}
      <mesh position={[3.05, 1.5, 0]}>
        <boxGeometry args={[0.3, 1, 1]} />
        <meshStandardMaterial color="#4fc3f7" flatShading />
      </mesh>
      
      {/* 지붕 */}
      <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[5, 2, 4]} />
        <meshStandardMaterial color="#8d6e63" flatShading />
      </mesh>
    </group>
  );
}
```

**Step 2: World.jsx에 Base 추가**

```jsx
import Base from './Base';
// return 안에 <Base /> 추가 (TestCube 삭제)
```

**Step 3: 개발 서버에서 확인**

Expected: 맵 중앙에 문과 창문이 있는 오두막

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add base building at map center"
```

---

## Task 5: 불개미집 (AntNest) 컴포넌트

**Files:**
- Create: `src/components/game/AntNest.jsx`
- Modify: `src/components/game/World.jsx`

**Step 1: AntNest.jsx 생성**

```jsx
// src/components/game/AntNest.jsx
import { useMemo } from 'react';
import { COLORS, GAME_CONFIG } from '../../data/config';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';

const NEST_COUNT = 10;
const MIN_DISTANCE_FROM_BASE = 20;
const MIN_DISTANCE_BETWEEN_NESTS = 15;

function SingleNest({ position }) {
  return (
    <group position={position}>
      {/* 메인 언덕 */}
      <mesh castShadow>
        <sphereGeometry args={[1.5, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.dirt} flatShading />
      </mesh>
      
      {/* 작은 언덕들 */}
      <mesh position={[1, 0, 0.5]} castShadow>
        <sphereGeometry args={[0.6, 5, 3, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.dirt} flatShading />
      </mesh>
      <mesh position={[-0.8, 0, 0.8]} castShadow>
        <sphereGeometry args={[0.5, 5, 3, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.dirt} flatShading />
      </mesh>
      
      {/* 입구 (어두운 구멍) */}
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
        
        // 기지에서 충분히 멀리
        if (distFromBase < MIN_DISTANCE_FROM_BASE) {
          attempts++;
          continue;
        }
        
        // 다른 둥지와 충분히 멀리
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
```

**Step 2: World.jsx에 AntNest 추가**

```jsx
import AntNest from './AntNest';
// return 안에 <AntNest /> 추가
```

**Step 3: 개발 서버에서 확인**

Expected: 맵에 10개의 불개미집이 분산 배치됨

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add ant nest spawning system"
```

---

## Phase 2 완료 체크리스트

- [ ] 지형에 Perlin noise 굴곡 있음
- [ ] 나무 100개가 자연스럽게 배치됨
- [ ] 돌 30개가 배치됨
- [ ] 맵 중앙에 기지(오두막) 있음
- [ ] 불개미집 10개가 분산 배치됨
- [ ] 안개 효과로 깊이감 있음
- [ ] 모든 오브젝트가 flatShading으로 로우폴리 스타일

---

## 다음 Phase

Phase 2 완료 후 → `2026-02-06-phase03-player-character.md` 진행
