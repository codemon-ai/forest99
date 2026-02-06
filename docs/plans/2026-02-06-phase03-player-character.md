# Phase 3: 플레이어 캐릭터 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** WASD 이동, 점프, 3인칭 카메라가 있는 로우폴리 플레이어 캐릭터 구현

**Architecture:** 키보드/마우스 입력 훅, 플레이어 컴포넌트, 3인칭 카메라 팔로우

**Tech Stack:** @react-three/fiber (useFrame), @react-three/drei (PointerLockControls)

---

## Task 1: 플레이어 상태 스토어 생성

**Files:**
- Create: `src/stores/playerStore.js`

**Step 1: Zustand 스토어 생성**

```javascript
// src/stores/playerStore.js
import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  // 위치
  position: [0, 0, 5], // 기지 앞에서 시작
  rotation: 0, // Y축 회전 (라디안)
  
  // 상태
  isMoving: false,
  isRunning: false,
  isJumping: false,
  velocity: [0, 0, 0],
  
  // 스탯
  health: 100,
  hunger: 100,
  sanity: 100,
  
  // 액션
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setIsMoving: (isMoving) => set({ isMoving }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsJumping: (isJumping) => set({ isJumping }),
  setVelocity: (velocity) => set({ velocity }),
  
  // 스탯 변경
  damage: (amount) => set((state) => ({ 
    health: Math.max(0, state.health - amount) 
  })),
  heal: (amount) => set((state) => ({ 
    health: Math.min(100, state.health + amount) 
  })),
  eat: (amount) => set((state) => ({ 
    hunger: Math.min(100, state.hunger + amount) 
  })),
  decreaseHunger: (amount) => set((state) => ({ 
    hunger: Math.max(0, state.hunger - amount) 
  })),
  decreaseSanity: (amount) => set((state) => ({ 
    sanity: Math.max(0, state.sanity - amount) 
  })),
  restoreSanity: (amount) => set((state) => ({ 
    sanity: Math.min(100, state.sanity + amount) 
  })),
}));
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add player state store with Zustand"
```

---

## Task 2: 키보드 입력 훅 생성

**Files:**
- Create: `src/hooks/useControls.js`

**Step 1: useControls 훅 생성**

```javascript
// src/hooks/useControls.js
import { useEffect, useRef } from 'react';

export function useControls() {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
        case 'Space':
          keys.current.jump = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.run = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'Space':
          keys.current.jump = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.run = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add keyboard controls hook"
```

---

## Task 3: 로우폴리 캐릭터 모델

**Files:**
- Create: `src/components/lowpoly/LowPolyCharacter.jsx`

**Step 1: LowPolyCharacter.jsx 생성**

```jsx
// src/components/lowpoly/LowPolyCharacter.jsx
import { forwardRef } from 'react';

const GUARD_COLORS = {
  body: '#1a237e',      // 진한 남색 (유니폼)
  limbs: '#1a237e',     // 팔다리도 같은 색
  skin: '#ffccbc',      // 피부색
  boots: '#212121',     // 검정 부츠
  belt: '#5d4037',      // 갈색 벨트
};

const LowPolyCharacter = forwardRef(({ isMoving = false, isRunning = false }, ref) => {
  return (
    <group ref={ref}>
      {/* 머리 */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 6, 4]} />
        <meshStandardMaterial color={GUARD_COLORS.skin} flatShading />
      </mesh>
      
      {/* 몸통 */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color={GUARD_COLORS.body} flatShading />
      </mesh>
      
      {/* 벨트 */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.52, 0.1, 0.32]} />
        <meshStandardMaterial color={GUARD_COLORS.belt} flatShading />
      </mesh>
      
      {/* 왼팔 */}
      <mesh position={[-0.35, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
      </mesh>
      
      {/* 오른팔 */}
      <mesh position={[0.35, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
      </mesh>
      
      {/* 왼다리 */}
      <mesh position={[-0.12, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.6, 0.18]} />
        <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
      </mesh>
      
      {/* 오른다리 */}
      <mesh position={[0.12, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.6, 0.18]} />
        <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
      </mesh>
      
      {/* 왼쪽 부츠 */}
      <mesh position={[-0.12, 0.1, 0.02]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.25]} />
        <meshStandardMaterial color={GUARD_COLORS.boots} flatShading />
      </mesh>
      
      {/* 오른쪽 부츠 */}
      <mesh position={[0.12, 0.1, 0.02]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.25]} />
        <meshStandardMaterial color={GUARD_COLORS.boots} flatShading />
      </mesh>
    </group>
  );
});

LowPolyCharacter.displayName = 'LowPolyCharacter';

export default LowPolyCharacter;
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add low-poly character model"
```

---

## Task 4: 플레이어 컴포넌트 (이동 로직)

**Files:**
- Create: `src/components/game/Player.jsx`
- Modify: `src/components/game/World.jsx`

**Step 1: Player.jsx 생성**

```jsx
// src/components/game/Player.jsx
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import LowPolyCharacter from '../lowpoly/LowPolyCharacter';
import { usePlayerStore } from '../../stores/playerStore';
import { useControls } from '../../hooks/useControls';
import { getTerrainHeight } from '../../utils/noise';
import { GAME_CONFIG } from '../../data/config';

const MOVE_SPEED = 5;
const RUN_MULTIPLIER = 1.8;
const JUMP_FORCE = 8;
const GRAVITY = 20;
const ROTATION_SPEED = 3;

export default function Player() {
  const groupRef = useRef();
  const characterRef = useRef();
  const velocityY = useRef(0);
  const keys = useControls();
  const { camera } = useThree();
  
  const position = usePlayerStore((state) => state.position);
  const setPosition = usePlayerStore((state) => state.setPosition);
  const setIsMoving = usePlayerStore((state) => state.setIsMoving);
  const setIsRunning = usePlayerStore((state) => state.setIsRunning);

  // 마우스로 카메라 회전
  const cameraAngle = useRef(0);
  const cameraPitch = useRef(0.5);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (document.pointerLockElement) {
        cameraAngle.current -= e.movementX * 0.002;
        cameraPitch.current = Math.max(0.1, Math.min(1.2, 
          cameraPitch.current - e.movementY * 0.002
        ));
      }
    };
    
    const handleClick = () => {
      document.body.requestPointerLock();
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const currentPos = groupRef.current.position;
    const moveDirection = new THREE.Vector3();
    
    // WASD 입력 처리
    if (keys.current.forward) moveDirection.z -= 1;
    if (keys.current.backward) moveDirection.z += 1;
    if (keys.current.left) moveDirection.x -= 1;
    if (keys.current.right) moveDirection.x += 1;
    
    const isMoving = moveDirection.length() > 0;
    const isRunning = keys.current.run && isMoving;
    setIsMoving(isMoving);
    setIsRunning(isRunning);
    
    if (isMoving) {
      moveDirection.normalize();
      
      // 카메라 방향에 맞게 이동 방향 회전
      moveDirection.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        cameraAngle.current
      );
      
      const speed = MOVE_SPEED * (isRunning ? RUN_MULTIPLIER : 1);
      
      // 새 위치 계산
      let newX = currentPos.x + moveDirection.x * speed * delta;
      let newZ = currentPos.z + moveDirection.z * speed * delta;
      
      // 맵 경계 제한
      const halfSize = GAME_CONFIG.worldSize / 2 - 2;
      newX = Math.max(-halfSize, Math.min(halfSize, newX));
      newZ = Math.max(-halfSize, Math.min(halfSize, newZ));
      
      currentPos.x = newX;
      currentPos.z = newZ;
      
      // 캐릭터 회전 (이동 방향 바라보기)
      const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
      if (characterRef.current) {
        const currentRot = characterRef.current.rotation.y;
        const diff = targetRotation - currentRot;
        const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
        characterRef.current.rotation.y += normalizedDiff * ROTATION_SPEED * delta;
      }
    }
    
    // 점프 & 중력
    const terrainHeight = getTerrainHeight(currentPos.x, currentPos.z);
    const groundLevel = terrainHeight + 0.1;
    
    if (keys.current.jump && currentPos.y <= groundLevel + 0.1) {
      velocityY.current = JUMP_FORCE;
    }
    
    velocityY.current -= GRAVITY * delta;
    currentPos.y += velocityY.current * delta;
    
    // 지면 충돌
    if (currentPos.y < groundLevel) {
      currentPos.y = groundLevel;
      velocityY.current = 0;
    }
    
    // 상태 업데이트
    setPosition([currentPos.x, currentPos.y, currentPos.z]);
    
    // 3인칭 카메라 업데이트
    const cameraDistance = 8;
    const cameraHeight = 3 + cameraPitch.current * 3;
    
    camera.position.x = currentPos.x + Math.sin(cameraAngle.current) * cameraDistance;
    camera.position.z = currentPos.z + Math.cos(cameraAngle.current) * cameraDistance;
    camera.position.y = currentPos.y + cameraHeight;
    
    camera.lookAt(currentPos.x, currentPos.y + 1, currentPos.z);
  });

  return (
    <group ref={groupRef} position={position}>
      <LowPolyCharacter ref={characterRef} />
    </group>
  );
}
```

**Step 2: World.jsx 수정 - Player 추가, OrbitControls 제거**

```jsx
// src/components/game/World.jsx
import { COLORS } from '../../data/config';
import Terrain from './Terrain';
import Forest from './Forest';
import Rocks from './Rocks';
import Base from './Base';
import AntNest from './AntNest';
import Player from './Player';

export default function World() {
  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* 하늘 배경 */}
      <color attach="background" args={[COLORS.sky_day]} />
      
      {/* 안개 */}
      <fog attach="fog" args={[COLORS.sky_day, 30, 100]} />
      
      {/* 월드 오브젝트 */}
      <Terrain />
      <Forest />
      <Rocks />
      <Base />
      <AntNest />
      
      {/* 플레이어 */}
      <Player />
    </>
  );
}
```

**Step 3: 개발 서버에서 확인**

Run: `npm run dev`
Expected:
- 화면 클릭하면 포인터 잠금
- WASD로 캐릭터 이동
- Space로 점프
- Shift로 달리기
- 마우스로 카메라 회전

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add player character with WASD controls and 3rd person camera"
```

---

## Task 5: 간단한 충돌 시스템

**Files:**
- Create: `src/systems/CollisionSystem.js`
- Modify: `src/components/game/Player.jsx`

**Step 1: CollisionSystem.js 생성**

```javascript
// src/systems/CollisionSystem.js
import * as THREE from 'three';

// 충돌 오브젝트 저장소
const colliders = [];

export function registerCollider(position, radius, type = 'solid') {
  const id = colliders.length;
  colliders.push({ id, position, radius, type });
  return id;
}

export function unregisterCollider(id) {
  const index = colliders.findIndex(c => c.id === id);
  if (index !== -1) {
    colliders.splice(index, 1);
  }
}

export function checkCollision(position, radius = 0.3) {
  for (const collider of colliders) {
    const dx = position.x - collider.position[0];
    const dz = position.z - collider.position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < radius + collider.radius) {
      return {
        collided: true,
        collider,
        pushDirection: new THREE.Vector3(dx, 0, dz).normalize(),
        overlap: radius + collider.radius - distance,
      };
    }
  }
  
  return { collided: false };
}

export function resolveCollision(position, radius = 0.3) {
  const result = checkCollision(position, radius);
  
  if (result.collided) {
    position.x += result.pushDirection.x * result.overlap;
    position.z += result.pushDirection.z * result.overlap;
  }
  
  return result.collided;
}
```

**Step 2: Forest.jsx에서 나무 충돌 등록**

```jsx
// Forest.jsx 수정 - 컴포넌트 상단에 추가
import { useEffect } from 'react';
import { registerCollider, unregisterCollider } from '../../systems/CollisionSystem';

// useMemo 후에 추가
useEffect(() => {
  const ids = trees.map(tree => 
    registerCollider(tree.position, 0.4 * tree.scale, 'tree')
  );
  
  return () => {
    ids.forEach(unregisterCollider);
  };
}, [trees]);
```

**Step 3: Player.jsx에서 충돌 해결 사용**

```jsx
// Player.jsx의 useFrame 안, 위치 업데이트 후에 추가
import { resolveCollision } from '../../systems/CollisionSystem';

// currentPos 업데이트 후
resolveCollision(currentPos, 0.3);
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add basic collision system for trees"
```

---

## Phase 3 완료 체크리스트

- [ ] WASD로 캐릭터 이동
- [ ] Space로 점프
- [ ] Shift로 달리기 (속도 증가)
- [ ] 마우스로 카메라 회전
- [ ] 3인칭 카메라가 캐릭터 따라감
- [ ] 지형 위를 걸음 (높이 적용)
- [ ] 나무와 충돌
- [ ] 맵 경계에서 이동 제한

---

## 다음 Phase

Phase 3 완료 후 → Phase 4 (생존 시스템) 진행
