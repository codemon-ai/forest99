# Phase 10: 이벤트 시스템 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 광신도 습격, 불개미 대습격, 번개 이벤트 구현

**Architecture:** EventSystem 매니저 + 개별 이벤트 컴포넌트

**Tech Stack:** React Three Fiber, Zustand

---

## Task 1: 이벤트 시스템

**Files:**
- Create: `src/systems/EventSystem.js`

**Step 1: EventSystem.js 생성**

```javascript
import { create } from 'zustand';

export const EVENT_TYPES = {
  CULTIST_RAID: 'cultistRaid',
  ANT_SWARM: 'antSwarm',
  LIGHTNING: 'lightning',
};

export const useEventStore = create((set, get) => ({
  activeEvent: null,
  eventQueue: [],
  lastRaidDay: 0,
  lastAntSwarmDay: 0,
  
  triggerEvent: (eventType, data = {}) => {
    set({ activeEvent: { type: eventType, data, startTime: Date.now() } });
  },
  
  clearEvent: () => set({ activeEvent: null }),
  
  setLastRaidDay: (day) => set({ lastRaidDay: day }),
  setLastAntSwarmDay: (day) => set({ lastAntSwarmDay: day }),
  
  checkRandomEvents: (day, isNight) => {
    const { lastRaidDay, lastAntSwarmDay, activeEvent, triggerEvent } = get();
    
    if (activeEvent) return;
    
    if (day - lastRaidDay >= 3 && Math.random() < 0.2) {
      triggerEvent(EVENT_TYPES.CULTIST_RAID, { count: 10 + Math.floor(Math.random() * 11) });
      set({ lastRaidDay: day });
      return;
    }
    
    if (day > 0 && day % 5 === 0 && lastAntSwarmDay !== day) {
      const intensity = Math.random() < 0.2 ? 'intense' : 'normal';
      triggerEvent(EVENT_TYPES.ANT_SWARM, { intensity });
      set({ lastAntSwarmDay: day });
      return;
    }
    
    if (Math.random() < 0.01) {
      triggerEvent(EVENT_TYPES.LIGHTNING);
    }
  },
}));
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add event system store"
```

---

## Task 2: 이벤트 알림 UI

**Files:**
- Create: `src/components/ui/EventAlert.jsx`
- Create: `src/components/ui/EventAlert.css`

**Step 1: EventAlert.jsx 생성**

```jsx
import { useEffect, useState } from 'react';
import { useEventStore, EVENT_TYPES } from '../../systems/EventSystem';
import './EventAlert.css';

const EVENT_MESSAGES = {
  [EVENT_TYPES.CULTIST_RAID]: '⚔️ 광신도가 몰려온다!',
  [EVENT_TYPES.ANT_SWARM]: '🐜 불개미 대습격!',
  [EVENT_TYPES.LIGHTNING]: '⚡ 번개가 치려 한다!',
};

export default function EventAlert() {
  const activeEvent = useEventStore((state) => state.activeEvent);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (activeEvent) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeEvent]);
  
  if (!visible || !activeEvent) return null;
  
  return (
    <div className="event-alert">
      <div className="event-message">
        {EVENT_MESSAGES[activeEvent.type]}
      </div>
    </div>
  );
}
```

**Step 2: EventAlert.css 생성**

```css
.event-alert {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.event-message {
  background: linear-gradient(135deg, #b71c1c, #f44336);
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add event alert UI"
```

---

## Task 3: 번개 이벤트

**Files:**
- Create: `src/components/game/events/Lightning.jsx`

**Step 1: Lightning.jsx 생성**

```jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlayerStore } from '../../../stores/playerStore';
import { useEventStore, EVENT_TYPES } from '../../../systems/EventSystem';

export default function Lightning() {
  const activeEvent = useEventStore((state) => state.activeEvent);
  const clearEvent = useEventStore((state) => state.clearEvent);
  const playerPosition = usePlayerStore((state) => state.position);
  const damage = usePlayerStore((state) => state.damage);
  
  const [countdown, setCountdown] = useState(3);
  const [struck, setStruck] = useState(false);
  const cloudRef = useRef();
  
  const isActive = activeEvent?.type === EVENT_TYPES.LIGHTNING;
  
  useEffect(() => {
    if (!isActive) {
      setCountdown(3);
      setStruck(false);
      return;
    }
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStruck(true);
          
          const distFromBase = Math.sqrt(
            playerPosition[0] ** 2 + playerPosition[2] ** 2
          );
          
          if (distFromBase > 5) {
            damage(50);
          }
          
          setTimeout(() => {
            clearEvent();
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, playerPosition, damage, clearEvent]);
  
  useFrame(() => {
    if (cloudRef.current && isActive) {
      cloudRef.current.position.x = playerPosition[0];
      cloudRef.current.position.z = playerPosition[2];
    }
  });
  
  if (!isActive) return null;
  
  return (
    <group>
      <group ref={cloudRef} position={[playerPosition[0], 20, playerPosition[2]]}>
        <mesh>
          <sphereGeometry args={[5, 8, 6]} />
          <meshBasicMaterial color="#333" transparent opacity={0.8} />
        </mesh>
        <mesh position={[3, -1, 0]}>
          <sphereGeometry args={[3, 8, 6]} />
          <meshBasicMaterial color="#444" transparent opacity={0.7} />
        </mesh>
      </group>
      
      {struck && (
        <mesh position={[playerPosition[0], 10, playerPosition[2]]}>
          <cylinderGeometry args={[0.1, 0.3, 20, 4]} />
          <meshBasicMaterial color="#ffeb3b" />
        </mesh>
      )}
      
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '100px',
          color: '#ffeb3b',
          textShadow: '0 0 20px #ffeb3b',
          zIndex: 500,
          pointerEvents: 'none',
        }}
      >
        {countdown > 0 && countdown}
      </div>
      
      {struck && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 400,
            pointerEvents: 'none',
            animation: 'flash 0.2s ease-out',
          }}
        />
      )}
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add lightning event"
```

---

## Task 4: 광신도 습격 이벤트

**Files:**
- Create: `src/components/game/events/CultistRaid.jsx`

**Step 1: CultistRaid.jsx 생성**

```jsx
import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Cultist from '../monsters/Cultist';
import { useEventStore, EVENT_TYPES } from '../../../systems/EventSystem';
import { getTerrainHeight } from '../../../utils/noise';
import { GAME_CONFIG } from '../../../data/config';

export default function CultistRaid() {
  const activeEvent = useEventStore((state) => state.activeEvent);
  const clearEvent = useEventStore((state) => state.clearEvent);
  const [cultists, setCultists] = useState([]);
  
  const isActive = activeEvent?.type === EVENT_TYPES.CULTIST_RAID;
  
  useEffect(() => {
    if (!isActive) {
      setCultists([]);
      return;
    }
    
    const count = activeEvent.data?.count || 15;
    const newCultists = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = GAME_CONFIG.worldSize / 2 - 5;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = getTerrainHeight(x, z);
      
      newCultists.push({
        id: Date.now() + i,
        position: [x, y, z],
        targetPosition: [0, 0, 0],
        hp: 80,
      });
    }
    
    setCultists(newCultists);
    
    const timeout = setTimeout(() => {
      clearEvent();
    }, 60000);
    
    return () => clearTimeout(timeout);
  }, [isActive, activeEvent, clearEvent]);
  
  useFrame((_, delta) => {
    if (!isActive) return;
    
    setCultists((prev) =>
      prev.map((cultist) => {
        const [x, y, z] = cultist.position;
        const [tx, ty, tz] = cultist.targetPosition;
        
        const dx = tx - x;
        const dz = tz - z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (dist > 2) {
          const speed = 3;
          const newY = getTerrainHeight(
            x + (dx / dist) * speed * delta,
            z + (dz / dist) * speed * delta
          );
          
          return {
            ...cultist,
            position: [
              x + (dx / dist) * speed * delta,
              newY,
              z + (dz / dist) * speed * delta,
            ],
          };
        }
        
        return cultist;
      })
    );
  });
  
  if (!isActive) return null;
  
  return (
    <group>
      {cultists.map((cultist) => (
        <Cultist key={cultist.id} position={cultist.position} />
      ))}
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add cultist raid event"
```

---

## Task 5: 불개미 대습격 이벤트

**Files:**
- Create: `src/components/game/events/AntSwarm.jsx`

**Step 1: AntSwarm.jsx 생성**

```jsx
import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import FireAnt from '../monsters/FireAnt';
import { useEventStore, EVENT_TYPES } from '../../../systems/EventSystem';
import { usePlayerStore } from '../../../stores/playerStore';
import { getTerrainHeight, getRandomPosition } from '../../../utils/noise';
import { GAME_CONFIG } from '../../../data/config';

const ANT_COUNT_NORMAL = 50;
const ANT_COUNT_INTENSE = 100;

export default function AntSwarm() {
  const activeEvent = useEventStore((state) => state.activeEvent);
  const clearEvent = useEventStore((state) => state.clearEvent);
  const playerPosition = usePlayerStore((state) => state.position);
  const [ants, setAnts] = useState([]);
  
  const isActive = activeEvent?.type === EVENT_TYPES.ANT_SWARM;
  
  useEffect(() => {
    if (!isActive) {
      setAnts([]);
      return;
    }
    
    const isIntense = activeEvent.data?.intensity === 'intense';
    const count = isIntense ? ANT_COUNT_INTENSE : ANT_COUNT_NORMAL;
    const newAnts = [];
    
    for (let i = 0; i < count; i++) {
      const pos = getRandomPosition(GAME_CONFIG.worldSize, 20);
      const y = getTerrainHeight(pos[0], pos[2]);
      
      newAnts.push({
        id: Date.now() + i,
        position: [pos[0], y, pos[2]],
        hp: 10,
      });
    }
    
    setAnts(newAnts);
    
    const timeout = setTimeout(() => {
      clearEvent();
    }, 45000);
    
    return () => clearTimeout(timeout);
  }, [isActive, activeEvent, clearEvent]);
  
  useFrame((_, delta) => {
    if (!isActive) return;
    
    setAnts((prev) =>
      prev.map((ant) => {
        const [x, y, z] = ant.position;
        const [px, py, pz] = playerPosition;
        
        const dx = px - x;
        const dz = pz - z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (dist > 1 && dist < 30) {
          const speed = 4;
          const newY = getTerrainHeight(
            x + (dx / dist) * speed * delta,
            z + (dz / dist) * speed * delta
          );
          
          return {
            ...ant,
            position: [
              x + (dx / dist) * speed * delta,
              newY,
              z + (dz / dist) * speed * delta,
            ],
          };
        }
        
        return ant;
      })
    );
  });
  
  if (!isActive) return null;
  
  return (
    <group>
      {ants.map((ant) => (
        <FireAnt key={ant.id} position={ant.position} />
      ))}
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add ant swarm event"
```

---

## Phase 10 완료 체크리스트

- [ ] 광신도 습격: 3~6일마다 랜덤
- [ ] 광신도 습격: 10~20명 기지로 이동
- [ ] 불개미 대습격: 5일마다
- [ ] 불개미 대습격: 50마리 (20% 확률로 더 많이)
- [ ] 번개: 랜덤 발생
- [ ] 번개: 3초 카운트다운
- [ ] 번개: 피격 시 50% 체력
- [ ] 번개: 건물 안에서 회피
- [ ] 이벤트 경고 UI 표시

---

## 다음 Phase

Phase 10 완료 후 → Phase 11 (보스 & 엔딩) 진행
