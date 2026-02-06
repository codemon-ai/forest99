# Phase 1: 프로젝트 설정 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Vite + React + React Three Fiber 프로젝트 초기 설정 및 기본 3D 씬 구성

**Architecture:** React SPA with R3F Canvas, basic lighting, ground plane, test cube

**Tech Stack:** Vite, React 18+, @react-three/fiber, @react-three/drei, zustand, three

---

## Task 1: Vite + React 프로젝트 생성

**Files:**
- Create: 전체 프로젝트 구조

**Step 1: Vite React 프로젝트 생성**

```bash
npm create vite@latest . -- --template react
```

**Step 2: 의존성 설치**

```bash
npm install
npm install three @react-three/fiber @react-three/drei zustand
```

**Step 3: 개발 서버 실행 테스트**

Run: `npm run dev`
Expected: Vite 개발 서버 실행, 기본 React 페이지 표시

**Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: initialize Vite React project with R3F dependencies"
```

---

## Task 2: 기본 폴더 구조 생성

**Files:**
- Create: `src/components/game/World.jsx`
- Create: `src/components/ui/` (빈 폴더)
- Create: `src/components/lowpoly/` (빈 폴더)
- Create: `src/hooks/` (빈 폴더)
- Create: `src/stores/` (빈 폴더)
- Create: `src/systems/` (빈 폴더)
- Create: `src/data/config.js`
- Create: `src/utils/` (빈 폴더)

**Step 1: 디렉토리 구조 생성**

```bash
mkdir -p src/components/game src/components/ui src/components/lowpoly
mkdir -p src/hooks src/stores src/systems src/data src/utils
```

**Step 2: config.js 생성**

```javascript
// src/data/config.js
export const COLORS = {
  // 자연
  grass: '#4a7c23',
  dirt: '#8b6914',
  tree_trunk: '#5d4037',
  tree_leaves: '#2e7d32',
  rock: '#757575',
  water: '#1976d2',
  
  // 하늘
  sky_day: '#87ceeb',
  sky_night: '#1a1a2e',
  
  // 몬스터
  snake: '#6b8e23',
  monkey: '#a1887f',
  bear: '#5d4037',
  ant: '#b71c1c',
  centipede: '#4a148c',
  cultist: '#212121',
  
  // UI
  health: '#e53935',
  hunger: '#ff9800',
  sanity: '#7b1fa2',
};

export const GAME_CONFIG = {
  worldSize: 100,
  dayDuration: 240,  // 낮 4분 (초)
  nightDuration: 180, // 밤 3분 (초)
};
```

**Step 3: Commit**

```bash
git add .
git commit -m "chore: add folder structure and config"
```

---

## Task 3: World 컴포넌트 생성 (기본 3D 씬)

**Files:**
- Create: `src/components/game/World.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Step 1: World.jsx 생성**

```jsx
// src/components/game/World.jsx
import { OrbitControls } from '@react-three/drei';
import { COLORS } from '../../data/config';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={COLORS.grass} flatShading />
    </mesh>
  );
}

function TestCube() {
  return (
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={COLORS.tree_leaves} flatShading />
    </mesh>
  );
}

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
      
      {/* 오브젝트 */}
      <Ground />
      <TestCube />
      
      {/* 카메라 컨트롤 */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}
```

**Step 2: App.jsx 수정**

```jsx
// src/App.jsx
import { Canvas } from '@react-three/fiber';
import World from './components/game/World';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 60 }}
      >
        <World />
      </Canvas>
    </div>
  );
}

export default App;
```

**Step 3: index.css 수정**

```css
/* src/index.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

**Step 4: 개발 서버 실행 테스트**

Run: `npm run dev`
Expected: 
- 하늘색 배경
- 초록색 바닥
- 초록색 테스트 큐브
- 마우스로 카메라 조작 가능

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add basic 3D scene with World component"
```

---

## Task 4: 안개 효과 추가

**Files:**
- Modify: `src/components/game/World.jsx`

**Step 1: World.jsx에 안개 추가**

```jsx
// World.jsx의 return 안에 추가
<fog attach="fog" args={[COLORS.sky_day, 30, 100]} />
```

**Step 2: 개발 서버에서 확인**

Expected: 멀리 있는 오브젝트가 안개에 가려짐

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add fog effect to World"
```

---

## Phase 1 완료 체크리스트

- [ ] 프로젝트 실행 (`npm run dev`)
- [ ] 3D 씬 렌더링 확인
- [ ] 마우스로 카메라 조작 가능
- [ ] 로우폴리 스타일 (flatShading) 적용 확인
- [ ] 안개 효과 확인

---

## 다음 Phase

Phase 1 완료 후 → `2026-02-06-phase02-lowpoly-world.md` 진행
