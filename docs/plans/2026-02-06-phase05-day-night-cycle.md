# Phase 5: 낮/밤 사이클 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 7분 주기 낮/밤 사이클, 조명/하늘/안개 변화, 일수 카운터

**Architecture:** useFrame 기반 시간 업데이트, lerp로 부드러운 조명 전환

**Tech Stack:** React Three Fiber, drei

---

## Task 1: DayNight 컴포넌트 생성

**Files:**
- Create: `src/components/game/DayNight.jsx`

**Step 1: DayNight.jsx 생성**

```jsx
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';
import { COLORS, GAME_CONFIG } from '../../data/config';

const DAY_DURATION = GAME_CONFIG.dayDuration;
const NIGHT_DURATION = GAME_CONFIG.nightDuration;
const TOTAL_CYCLE = DAY_DURATION + NIGHT_DURATION;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(colorA, colorB, t) {
  const a = new THREE.Color(colorA);
  const b = new THREE.Color(colorB);
  return a.lerp(b, t);
}

export default function DayNight() {
  const directionalRef = useRef();
  const { scene } = useThree();
  
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const setTimeOfDay = useGameStore((state) => state.setTimeOfDay);
  const setIsNight = useGameStore((state) => state.setIsNight);
  const incrementDay = useGameStore((state) => state.incrementDay);
  const isNight = useGameStore((state) => state.isNight);
  
  const wasNight = useRef(false);
  
  useFrame((_, delta) => {
    const newTime = (timeOfDay + delta) % TOTAL_CYCLE;
    setTimeOfDay(newTime);
    
    const currentIsNight = newTime >= DAY_DURATION;
    setIsNight(currentIsNight);
    
    if (wasNight.current && !currentIsNight) {
      incrementDay();
    }
    wasNight.current = currentIsNight;
    
    let lightIntensity, lightColor, skyColor, fogNear, fogFar;
    
    if (!currentIsNight) {
      const dayProgress = newTime / DAY_DURATION;
      
      if (dayProgress < 0.1) {
        const t = dayProgress / 0.1;
        lightIntensity = lerp(0.2, 1, t);
        lightColor = lerpColor('#ff9966', '#ffffff', t);
        skyColor = lerpColor('#1a1a2e', COLORS.sky_day, t);
      } else if (dayProgress > 0.9) {
        const t = (dayProgress - 0.9) / 0.1;
        lightIntensity = lerp(1, 0.3, t);
        lightColor = lerpColor('#ffffff', '#ff6633', t);
        skyColor = lerpColor(COLORS.sky_day, '#ff9966', t);
      } else {
        lightIntensity = 1;
        lightColor = new THREE.Color('#ffffff');
        skyColor = new THREE.Color(COLORS.sky_day);
      }
      
      fogNear = 30;
      fogFar = 100;
    } else {
      const nightProgress = (newTime - DAY_DURATION) / NIGHT_DURATION;
      
      lightIntensity = 0.2;
      lightColor = new THREE.Color('#6666ff');
      skyColor = new THREE.Color(COLORS.sky_night);
      
      fogNear = lerp(30, 15, 0.5);
      fogFar = lerp(100, 50, 0.5);
    }
    
    if (directionalRef.current) {
      directionalRef.current.intensity = lightIntensity;
      directionalRef.current.color = lightColor;
    }
    
    scene.background = skyColor;
    
    if (scene.fog) {
      scene.fog.near = fogNear;
      scene.fog.far = fogFar;
      scene.fog.color = skyColor;
    }
  });
  
  return (
    <>
      <ambientLight intensity={isNight ? 0.1 : 0.5} />
      <directionalLight
        ref={directionalRef}
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add day/night cycle component"
```

---

## Task 2: World.jsx에 통합

**Files:**
- Modify: `src/components/game/World.jsx`

**Step 1: World.jsx 수정**

조명 관련 코드를 DayNight으로 이동:

```jsx
import { COLORS } from '../../data/config';
import Terrain from './Terrain';
import Forest from './Forest';
import Rocks from './Rocks';
import Base from './Base';
import AntNest from './AntNest';
import Player from './Player';
import DayNight from './DayNight';

export default function World() {
  return (
    <>
      <DayNight />
      
      <color attach="background" args={[COLORS.sky_day]} />
      <fog attach="fog" args={[COLORS.sky_day, 30, 100]} />
      
      <Terrain />
      <Forest />
      <Rocks />
      <Base />
      <AntNest />
      <Player />
    </>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: integrate day/night cycle into World"
```

---

## Task 3: config.js 업데이트

**Files:**
- Modify: `src/data/config.js`

**Step 1: 시간 설정 확인/추가**

```javascript
export const GAME_CONFIG = {
  worldSize: 100,
  dayDuration: 240,
  nightDuration: 180,
};
```

**Step 2: Commit**

```bash
git add .
git commit -m "chore: ensure day/night duration in config"
```

---

## Phase 5 완료 체크리스트

- [ ] 7분 주기로 하루 순환 (낮 4분 + 밤 3분)
- [ ] 낮: 밝은 조명, 하늘색 배경
- [ ] 저녁: 주황빛 전환
- [ ] 밤: 어두운 파란빛, 남색 배경
- [ ] 부드러운 조명 전환 (lerp)
- [ ] HUD에 일수 표시
- [ ] 밤에 안개 더 짙어짐
- [ ] 밤→낮 전환 시 일수 +1

---

## 다음 Phase

Phase 5 완료 후 → Phase 6 (몬스터 기본) 진행
