# Phase 11: 보스 & 엔딩 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 거대 불개미 보스, 3가지 엔딩 (보스, TV 히든, 99일 생존)

**Architecture:** 보스 AI + 엔딩 컨디션 체크 + 엔딩 화면

**Tech Stack:** React Three Fiber, Zustand

---

## Task 1: 보스 데이터

**Files:**
- Modify: `src/data/monsters.js`

**Step 1: 보스 스탯 추가**

```javascript
[MONSTER_TYPES.BOSS_ANT]: {
  name: 'Giant Fire Ant Queen',
  hp: 1000,
  attack: 50,
  speed: 3,
  detectionRange: 50,
  attackRange: 5,
  color: '#d32f2f',
},
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add boss ant stats"
```

---

## Task 2: 보스 컴포넌트

**Files:**
- Create: `src/components/game/monsters/BossAnt.jsx`

**Step 1: BossAnt.jsx 생성**

```jsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MONSTER_STATS, MONSTER_TYPES } from '../../../data/monsters';

const BOSS_SCALE = 5;

export default function BossAnt({ 
  position, 
  hp, 
  onDeath, 
  onAttack 
}) {
  const groupRef = useRef();
  const stats = MONSTER_STATS[MONSTER_TYPES.BOSS_ANT];
  const [currentPhase, setCurrentPhase] = useState(0);
  const attackTimer = useRef(0);
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.rotation.y += delta * 0.2;
    
    const hpPercent = hp / stats.hp;
    if (hpPercent < 0.3) setCurrentPhase(2);
    else if (hpPercent < 0.6) setCurrentPhase(1);
    
    attackTimer.current += delta;
    if (attackTimer.current > 3) {
      attackTimer.current = 0;
      const patterns = ['charge', 'summon', 'acid'];
      onAttack?.(patterns[Math.floor(Math.random() * patterns.length)]);
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={BOSS_SCALE}>
      <mesh position={[0, 0.5, 0.8]} castShadow>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.7, 8, 6]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[0, 0.7, -1]} castShadow>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshStandardMaterial color={stats.color} flatShading />
      </mesh>
      
      <mesh position={[-0.5, 0.3, 0.5]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
      <mesh position={[0.5, 0.3, 0.5]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
      
      <mesh position={[0.3, 0.8, 0.9]} castShadow>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-0.3, 0.8, 0.9]} castShadow>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      
      <mesh position={[0.25, 1.1, 0.7]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <coneGeometry args={[0.05, 0.3, 4]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
      <mesh position={[-0.25, 1.1, 0.7]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <coneGeometry args={[0.05, 0.3, 4]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add BossAnt component"
```

---

## Task 3: 제단 컴포넌트

**Files:**
- Create: `src/components/game/Altar.jsx`

**Step 1: Altar.jsx 생성**

```jsx
import { useState } from 'react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { ITEM_TYPES } from '../../data/items';

const KEYS_REQUIRED = 10;

export default function Altar({ position, onActivate }) {
  const [isActivated, setIsActivated] = useState(false);
  const keyCount = useInventoryStore((state) => state.getItemCount(ITEM_TYPES.KEY));
  const removeItem = useInventoryStore((state) => state.removeItem);
  
  const canActivate = keyCount >= KEYS_REQUIRED && !isActivated;
  
  const handleActivate = () => {
    if (!canActivate) return;
    
    removeItem(ITEM_TYPES.KEY, KEYS_REQUIRED);
    setIsActivated(true);
    onActivate?.();
  };
  
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[2, 2.5, 1, 6]} />
        <meshStandardMaterial color="#5d4037" flatShading />
      </mesh>
      
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 6]} />
        <meshStandardMaterial color="#4a4a4a" flatShading />
      </mesh>
      
      {!isActivated && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshBasicMaterial color={canActivate ? '#ffd700' : '#666'} />
        </mesh>
      )}
      
      {canActivate && (
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '16px',
            textShadow: '2px 2px 4px black',
            pointerEvents: 'none',
          }}
        >
          Press E to summon boss ({keyCount}/{KEYS_REQUIRED} keys)
        </div>
      )}
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Altar component for boss summoning"
```

---

## Task 4: 동굴 & TV (히든 엔딩)

**Files:**
- Create: `src/components/game/Cave.jsx`

**Step 1: Cave.jsx 생성**

```jsx
import { useState } from 'react';
import { COLORS } from '../../data/config';

export default function Cave({ position, onTVInteract }) {
  const [playerNearTV, setPlayerNearTV] = useState(false);
  
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[4, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.rock} flatShading side={2} />
      </mesh>
      
      <mesh position={[0, 0, 3.5]} castShadow>
        <boxGeometry args={[2, 3, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      <group position={[0, 0, -10]}>
        <mesh position={[0, 0, -5]}>
          <boxGeometry args={[3, 2.5, 30]} />
          <meshStandardMaterial color="#333" flatShading />
        </mesh>
        
        <group position={[0, 1, -18]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 1, 0.3]} />
            <meshStandardMaterial color="#222" flatShading />
          </mesh>
          
          <mesh position={[0, 0, -0.16]}>
            <planeGeometry args={[1.3, 0.8]} />
            <meshBasicMaterial color="#000033" />
          </mesh>
          
          <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#6666ff" />
        </group>
      </group>
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Cave with hidden TV for secret ending"
```

---

## Task 5: 엔딩 화면

**Files:**
- Create: `src/components/ui/EndingScreen.jsx`
- Create: `src/components/ui/EndingScreen.css`

**Step 1: EndingScreen.jsx 생성**

```jsx
import './EndingScreen.css';

const ENDINGS = {
  boss: {
    title: 'Victory!',
    description: 'You defeated the Giant Fire Ant Queen and escaped the forest.',
    reward: 1000,
    color: '#ffd700',
  },
  tv: {
    title: 'The Truth',
    description: 'You found the TV and discovered the dark secret of the forest...',
    reward: 2000,
    color: '#6666ff',
  },
  survival: {
    title: 'Survivor',
    description: 'You survived 99 nights in the forest. Rescue has arrived!',
    reward: 1500,
    color: '#4caf50',
  },
  death: {
    title: 'Game Over',
    description: 'You perished in the forest...',
    reward: 0,
    color: '#f44336',
  },
};

export default function EndingScreen({ endingType, onRestart }) {
  const ending = ENDINGS[endingType];
  
  if (!ending) return null;
  
  return (
    <div className="ending-overlay">
      <div className="ending-container" style={{ borderColor: ending.color }}>
        <h1 style={{ color: ending.color }}>{ending.title}</h1>
        <p className="ending-description">{ending.description}</p>
        
        {ending.reward > 0 && (
          <div className="ending-reward">
            Reward: {ending.reward} coins
          </div>
        )}
        
        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
```

**Step 2: EndingScreen.css 생성**

```css
.ending-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.ending-container {
  background: #1a1a1a;
  padding: 40px 60px;
  border-radius: 12px;
  border: 3px solid;
  text-align: center;
  color: white;
  max-width: 500px;
}

.ending-container h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.ending-description {
  font-size: 18px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.ending-reward {
  font-size: 24px;
  color: #ffd700;
  margin-bottom: 30px;
}

.restart-button {
  padding: 15px 40px;
  font-size: 18px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.restart-button:hover {
  background: #388e3c;
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add ending screen component"
```

---

## Task 6: 엔딩 조건 체크

**Files:**
- Create: `src/systems/EndingSystem.js`

**Step 1: EndingSystem.js 생성**

```javascript
import { create } from 'zustand';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

export const useEndingStore = create((set) => ({
  currentEnding: null,
  bossDefeated: false,
  tvDiscovered: false,
  
  setEnding: (ending) => set({ currentEnding: ending }),
  setBossDefeated: () => set({ bossDefeated: true }),
  setTVDiscovered: () => set({ tvDiscovered: true }),
  
  reset: () => set({
    currentEnding: null,
    bossDefeated: false,
    tvDiscovered: false,
  }),
}));

export function checkEndingConditions() {
  const { health } = usePlayerStore.getState();
  const { day } = useGameStore.getState();
  const { bossDefeated, tvDiscovered, setEnding } = useEndingStore.getState();
  
  if (health <= 0) {
    setEnding('death');
    return true;
  }
  
  if (bossDefeated) {
    setEnding('boss');
    return true;
  }
  
  if (tvDiscovered) {
    setEnding('tv');
    return true;
  }
  
  if (day >= 99) {
    setEnding('survival');
    return true;
  }
  
  return false;
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add ending condition system"
```

---

## Phase 11 완료 체크리스트

- [ ] 불개미집 파괴 시 열쇠 드롭
- [ ] HUD에 열쇠 개수 표시
- [ ] 제단에서 열쇠 10개로 보스 소환
- [ ] 거대 불개미 보스: 크기 10배
- [ ] 거대 불개미 보스: HP 1000
- [ ] 거대 불개미 보스: 3가지 패턴
- [ ] 보스 처치 → 메인 엔딩
- [ ] 동굴 → 하수구 → TV → 히든 엔딩
- [ ] 99일 도달 → 생존 엔딩
- [ ] 엔딩 화면 표시
- [ ] 다시 시작 버튼

---

## 다음 Phase

Phase 11 완료 후 → Phase 12 (UI & 폴리싱) 진행
