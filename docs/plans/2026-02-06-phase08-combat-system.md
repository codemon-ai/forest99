# Phase 8: 전투 시스템 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 무기 3종 (칼, 활, 총), 공격/피격 시스템, 몬스터 처치 및 드롭

**Architecture:** 무기 컴포넌트 + 투사체 + 전투 시스템

**Tech Stack:** React Three Fiber, Zustand

---

## Task 1: 무기 데이터 정의

**Files:**
- Create: `src/data/weapons.js`

**Step 1: weapons.js 생성**

```javascript
export const WEAPON_TYPES = {
  KNIFE: 'knife',
  BOW: 'bow',
  GUN: 'gun',
};

export const WEAPON_STATS = {
  [WEAPON_TYPES.KNIFE]: {
    name: 'Knife',
    damage: 25,
    range: 2,
    attackSpeed: 0.3,
    isRanged: false,
  },
  [WEAPON_TYPES.BOW]: {
    name: 'Bow',
    damage: 20,
    range: 30,
    attackSpeed: 0.8,
    isRanged: true,
    projectileSpeed: 25,
  },
  [WEAPON_TYPES.GUN]: {
    name: 'Gun',
    damage: 40,
    range: 50,
    attackSpeed: 0.5,
    isRanged: true,
    projectileSpeed: 50,
  },
};
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add weapon data definitions"
```

---

## Task 2: 전투 시스템

**Files:**
- Create: `src/systems/CombatSystem.js`

**Step 1: CombatSystem.js 생성**

```javascript
import { usePlayerStore } from '../stores/playerStore';
import { WEAPON_STATS } from '../data/weapons';

export function calculateDamage(weaponType, isCritical = false) {
  const stats = WEAPON_STATS[weaponType];
  let damage = stats.damage;
  
  if (isCritical) {
    damage *= 2;
  }
  
  return damage;
}

export function applyDamageToPlayer(amount) {
  const { damage } = usePlayerStore.getState();
  damage(amount);
}

export function checkMeleeHit(playerPos, playerRotation, targetPos, range) {
  const dx = targetPos[0] - playerPos[0];
  const dz = targetPos[2] - playerPos[2];
  const distance = Math.sqrt(dx * dx + dz * dz);
  
  if (distance > range) return false;
  
  const angleToTarget = Math.atan2(dx, dz);
  const angleDiff = Math.abs(angleToTarget - playerRotation);
  const normalizedDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
  
  return normalizedDiff < Math.PI / 3;
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add combat system for damage calculation"
```

---

## Task 3: 무기 컴포넌트

**Files:**
- Create: `src/components/game/Weapon.jsx`

**Step 1: Weapon.jsx 생성**

```jsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { WEAPON_TYPES } from '../../data/weapons';

function Knife({ isAttacking }) {
  const ref = useRef();
  
  useFrame(() => {
    if (ref.current && isAttacking) {
      ref.current.rotation.x = Math.sin(Date.now() * 0.02) * 0.5;
    }
  });
  
  return (
    <group ref={ref} position={[0.3, 0.8, 0.3]}>
      <mesh castShadow>
        <boxGeometry args={[0.05, 0.3, 0.02]} />
        <meshStandardMaterial color="#888" flatShading />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.03]} />
        <meshStandardMaterial color="#5d4037" flatShading />
      </mesh>
    </group>
  );
}

function Bow({ isAttacking }) {
  return (
    <group position={[0.4, 0.9, 0]} rotation={[0, 0, -Math.PI / 6]}>
      <mesh castShadow>
        <torusGeometry args={[0.3, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#5d4037" flatShading />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.6, 4]} />
        <meshStandardMaterial color="#fff" flatShading />
      </mesh>
    </group>
  );
}

function Gun({ isAttacking }) {
  return (
    <group position={[0.35, 0.85, 0.2]}>
      <mesh castShadow>
        <boxGeometry args={[0.06, 0.08, 0.25]} />
        <meshStandardMaterial color="#333" flatShading />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.15]} />
        <meshStandardMaterial color="#444" flatShading />
      </mesh>
    </group>
  );
}

export default function Weapon({ type, isAttacking }) {
  switch (type) {
    case WEAPON_TYPES.KNIFE:
      return <Knife isAttacking={isAttacking} />;
    case WEAPON_TYPES.BOW:
      return <Bow isAttacking={isAttacking} />;
    case WEAPON_TYPES.GUN:
      return <Gun isAttacking={isAttacking} />;
    default:
      return null;
  }
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add weapon visual components"
```

---

## Task 4: 투사체 컴포넌트

**Files:**
- Create: `src/components/game/Projectile.jsx`

**Step 1: Projectile.jsx 생성**

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Projectile({ 
  startPosition, 
  direction, 
  speed, 
  type,
  onHit,
  onExpire 
}) {
  const ref = useRef();
  const traveled = useRef(0);
  const maxDistance = 50;
  
  useFrame((_, delta) => {
    if (!ref.current) return;
    
    ref.current.position.x += direction[0] * speed * delta;
    ref.current.position.z += direction[1] * speed * delta;
    
    traveled.current += speed * delta;
    
    if (traveled.current >= maxDistance) {
      onExpire?.();
    }
  });
  
  const color = type === 'arrow' ? '#8b4513' : '#ffeb3b';
  const size = type === 'arrow' ? [0.02, 0.3, 0.02] : [0.05, 0.05, 0.15];
  
  return (
    <mesh ref={ref} position={startPosition}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add projectile component for ranged weapons"
```

---

## Task 5: 플레이어에 무기 통합

**Files:**
- Modify: `src/stores/playerStore.js`
- Modify: `src/components/game/Player.jsx`

**Step 1: playerStore.js에 무기 상태 추가**

```javascript
import { WEAPON_TYPES } from '../data/weapons';

// 스토어에 추가
currentWeapon: WEAPON_TYPES.KNIFE,
isAttacking: false,

setWeapon: (weapon) => set({ currentWeapon: weapon }),
setAttacking: (isAttacking) => set({ isAttacking }),

cycleWeapon: () => set((state) => {
  const weapons = Object.values(WEAPON_TYPES);
  const currentIndex = weapons.indexOf(state.currentWeapon);
  const nextIndex = (currentIndex + 1) % weapons.length;
  return { currentWeapon: weapons[nextIndex] };
}),
```

**Step 2: Player.jsx에 무기 및 공격 추가**

```jsx
import Weapon from './Weapon';
import { WEAPON_TYPES, WEAPON_STATS } from '../../data/weapons';

// Player 컴포넌트 안에
const currentWeapon = usePlayerStore((state) => state.currentWeapon);
const isAttacking = usePlayerStore((state) => state.isAttacking);
const setAttacking = usePlayerStore((state) => state.setAttacking);
const cycleWeapon = usePlayerStore((state) => state.cycleWeapon);

// useEffect에서 마우스 클릭 처리
const handleMouseDown = () => {
  if (!document.pointerLockElement) return;
  setAttacking(true);
  setTimeout(() => setAttacking(false), 200);
};

const handleKeyDown = (e) => {
  if (e.code === 'KeyQ') {
    cycleWeapon();
  }
};

// LowPolyCharacter 옆에 Weapon 추가
<Weapon type={currentWeapon} isAttacking={isAttacking} />
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: integrate weapons into player with attack system"
```

---

## Task 6: 피격 효과

**Files:**
- Create: `src/components/ui/DamageOverlay.jsx`

**Step 1: DamageOverlay.jsx 생성**

```jsx
import { useState, useEffect } from 'react';
import { usePlayerStore } from '../../stores/playerStore';

export default function DamageOverlay() {
  const [showDamage, setShowDamage] = useState(false);
  const health = usePlayerStore((state) => state.health);
  const prevHealth = useRef(health);
  
  useEffect(() => {
    if (health < prevHealth.current) {
      setShowDamage(true);
      setTimeout(() => setShowDamage(false), 200);
    }
    prevHealth.current = health;
  }, [health]);
  
  if (!showDamage) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        pointerEvents: 'none',
        zIndex: 98,
      }}
    />
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add damage overlay effect"
```

---

## Phase 8 완료 체크리스트

- [ ] 칼: 근접, 빠른 공격
- [ ] 활: 원거리, 화살 발사
- [ ] 총: 원거리, 강력함
- [ ] Q키로 무기 전환
- [ ] 마우스 좌클릭: 공격
- [ ] 몬스터 피격 시 체력 감소
- [ ] 피격 효과 (색 깜빡임)
- [ ] 플레이어 피격 시 화면 빨갛게
- [ ] 몬스터 사망 시 사라짐

---

## 다음 Phase

Phase 8 완료 후 → Phase 9 (인벤토리 & 제작) 진행
