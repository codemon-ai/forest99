# Phase 4: 생존 시스템 & HUD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** HUD로 체력/배고픔/정신력 표시, 시간에 따른 스탯 변화, 정신력 저하 시각 효과

**Architecture:** Zustand 게임 스토어 + HTML 오버레이 HUD + useFrame 기반 스탯 업데이트

**Tech Stack:** React, Zustand, CSS

---

## Task 1: 게임 스토어 생성

**Files:**
- Create: `src/stores/gameStore.js`

**Step 1: gameStore.js 생성**

```javascript
import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  day: 1,
  timeOfDay: 0,
  isNight: false,
  isPaused: false,
  
  incrementDay: () => set((state) => ({ day: state.day + 1 })),
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setIsNight: (isNight) => set({ isNight }),
  setPaused: (isPaused) => set({ isPaused }),
  
  reset: () => set({
    day: 1,
    timeOfDay: 0,
    isNight: false,
    isPaused: false,
  }),
}));
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add game store for day/time tracking"
```

---

## Task 2: HUD 컴포넌트 생성

**Files:**
- Create: `src/components/ui/HUD.jsx`
- Create: `src/components/ui/HUD.css`

**Step 1: HUD.jsx 생성**

```jsx
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import './HUD.css';

function StatBar({ value, maxValue, color, label }) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="stat-bar">
      <div className="stat-label">{label}</div>
      <div className="stat-bar-bg">
        <div 
          className="stat-bar-fill" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="stat-value">{Math.floor(value)}</div>
    </div>
  );
}

export default function HUD() {
  const health = usePlayerStore((state) => state.health);
  const hunger = usePlayerStore((state) => state.hunger);
  const sanity = usePlayerStore((state) => state.sanity);
  const day = useGameStore((state) => state.day);
  const isNight = useGameStore((state) => state.isNight);
  
  return (
    <div className="hud">
      <div className="hud-top-left">
        <div className="day-counter">
          Day {day} {isNight ? '🌙' : '☀️'}
        </div>
        <StatBar value={health} maxValue={100} color="#e53935" label="HP" />
        <StatBar value={hunger} maxValue={100} color="#ff9800" label="Hunger" />
        <StatBar value={sanity} maxValue={100} color="#7b1fa2" label="Sanity" />
      </div>
    </div>
  );
}
```

**Step 2: HUD.css 생성**

```css
.hud {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  font-family: 'Segoe UI', sans-serif;
}

.hud-top-left {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-counter {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  margin-bottom: 8px;
}

.stat-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  width: 50px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.stat-bar-bg {
  width: 150px;
  height: 16px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 4px;
}

.stat-value {
  width: 30px;
  font-size: 14px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add HUD component with stat bars"
```

---

## Task 3: 생존 시스템 생성

**Files:**
- Create: `src/systems/SurvivalSystem.js`

**Step 1: SurvivalSystem.js 생성**

```javascript
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

const HUNGER_DECREASE_INTERVAL = 60;
const HUNGER_DECREASE_AMOUNT = 5;
const STARVATION_DAMAGE = 2;
const SANITY_DECREASE_RATE = 1;
const BASE_RADIUS = 10;

let lastHungerTime = 0;

export function updateSurvival(delta, playerPosition) {
  const { 
    hunger, 
    health,
    decreaseHunger, 
    damage,
    decreaseSanity 
  } = usePlayerStore.getState();
  
  const { isNight } = useGameStore.getState();
  
  lastHungerTime += delta;
  
  if (lastHungerTime >= HUNGER_DECREASE_INTERVAL) {
    lastHungerTime = 0;
    decreaseHunger(HUNGER_DECREASE_AMOUNT);
  }
  
  if (hunger <= 0) {
    damage(STARVATION_DAMAGE * delta);
  }
  
  if (isNight) {
    const distFromBase = Math.sqrt(
      playerPosition[0] ** 2 + playerPosition[2] ** 2
    );
    
    if (distFromBase > BASE_RADIUS) {
      decreaseSanity(SANITY_DECREASE_RATE * delta);
    }
  }
}

export function resetSurvivalTimer() {
  lastHungerTime = 0;
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add survival system for hunger and sanity"
```

---

## Task 4: 정신력 저하 시각 효과

**Files:**
- Create: `src/components/ui/SanityEffect.jsx`

**Step 1: SanityEffect.jsx 생성**

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlayerStore } from '../../stores/playerStore';

export default function SanityEffect() {
  const overlayRef = useRef();
  const sanity = usePlayerStore((state) => state.sanity);
  
  useFrame(({ camera }) => {
    if (sanity <= 25) {
      const shake = (25 - sanity) / 25 * 0.05;
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
    }
  });
  
  const vignette = sanity <= 50 ? (50 - sanity) / 50 : 0;
  
  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99,
        background: `radial-gradient(ellipse at center, transparent 0%, transparent ${60 - vignette * 40}%, rgba(0,0,0,${vignette * 0.8}) 100%)`,
      }}
    />
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add sanity visual effects (vignette, shake)"
```

---

## Task 5: App.jsx에 통합

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/game/Player.jsx`

**Step 1: App.jsx 수정**

```jsx
import { Canvas } from '@react-three/fiber';
import World from './components/game/World';
import HUD from './components/ui/HUD';
import SanityEffect from './components/ui/SanityEffect';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 60 }}
      >
        <World />
      </Canvas>
      <HUD />
      <SanityEffect />
    </div>
  );
}

export default App;
```

**Step 2: Player.jsx에 생존 시스템 연동**

Player.jsx의 useFrame 안에 추가:

```jsx
import { updateSurvival } from '../../systems/SurvivalSystem';

// useFrame 안에 추가
updateSurvival(delta, [currentPos.x, currentPos.y, currentPos.z]);
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: integrate HUD and survival system into game"
```

---

## Phase 4 완료 체크리스트

- [ ] HUD에 체력/배고픔/정신력 게이지 표시
- [ ] 일수(Day) 표시
- [ ] 배고픔 1분마다 -5 자동 감소
- [ ] 배고픔 0일 때 체력 감소
- [ ] 밤에 기지 밖에서 정신력 감소
- [ ] 정신력 50% 이하: 화면 가장자리 어두워짐
- [ ] 정신력 25% 이하: 화면 흔들림

---

## 다음 Phase

Phase 4 완료 후 → Phase 5 (낮/밤 사이클) 진행
