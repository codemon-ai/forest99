# Phase 13: Vercel 배포 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 프로덕션 빌드 최적화 및 Vercel 배포

**Architecture:** Vite 빌드 최적화 + Vercel 설정

**Tech Stack:** Vite, Vercel

---

## Task 1: vercel.json 설정

**Files:**
- Create: `vercel.json`

**Step 1: vercel.json 생성**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "chore: add vercel.json configuration"
```

---

## Task 2: 빌드 최적화

**Files:**
- Modify: `vite.config.js`

**Step 1: vite.config.js 최적화**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'game-core': [
            './src/stores/playerStore.js',
            './src/stores/gameStore.js',
            './src/stores/inventoryStore.js',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'zustand'],
  },
});
```

**Step 2: Commit**

```bash
git add .
git commit -m "chore: optimize vite build configuration"
```

---

## Task 3: 환경 변수 설정

**Files:**
- Create: `.env.example`

**Step 1: .env.example 생성**

```
# Environment variables for Forest 99 Nights
VITE_APP_TITLE=숲에서 보낸 99일 밤
VITE_DEBUG_MODE=false
```

**Step 2: .gitignore 확인**

```
# .gitignore에 추가 (이미 있을 수 있음)
.env
.env.local
.env.production
```

**Step 3: Commit**

```bash
git add .
git commit -m "chore: add environment variable example"
```

---

## Task 4: 빌드 테스트

**Files:**
- None

**Step 1: 프로덕션 빌드 실행**

```bash
npm run build
```

**Step 2: 빌드 결과 확인**

```bash
ls -la dist/
npm run preview
```

Expected: 
- dist/ 폴더 생성됨
- preview 서버에서 게임 정상 작동

**Step 3: Commit (필요시)**

```bash
git add .
git commit -m "chore: verify production build"
```

---

## Task 5: Vercel 배포

**Files:**
- None (CLI 또는 웹 인터페이스 사용)

### Option A: Vercel CLI 사용

**Step 1: Vercel CLI 설치 (글로벌)**

```bash
npm install -g vercel
```

**Step 2: 로그인**

```bash
vercel login
```

**Step 3: 배포**

```bash
vercel --prod
```

### Option B: GitHub 연동

**Step 1: GitHub에 푸시**

```bash
git push origin main
```

**Step 2: Vercel 웹사이트에서**

1. https://vercel.com 접속
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 설정 확인 (Framework: Vite 자동 감지)
5. "Deploy" 클릭

---

## Task 6: 배포 후 확인

**Files:**
- None

**Step 1: 배포된 URL 확인**

- 제공된 URL (예: forest-99nights.vercel.app) 접속
- 모든 기능 테스트:
  - [ ] 메인 메뉴 표시
  - [ ] 새 게임 시작
  - [ ] 3D 씬 렌더링
  - [ ] 플레이어 이동
  - [ ] UI 표시 (HUD, 인벤토리)
  - [ ] 저장/불러오기

**Step 2: 성능 확인**

- Chrome DevTools > Performance 탭
- 초기 로드 시간 확인
- FPS 확인 (60fps 목표)

---

## Phase 13 완료 체크리스트

- [ ] vercel.json 설정 완료
- [ ] 빌드 최적화 적용
- [ ] 환경 변수 설정
- [ ] 프로덕션 빌드 성공
- [ ] Vercel 배포 성공
- [ ] 배포된 사이트에서 게임 정상 작동

---

## 🎉 프로젝트 완료!

**축하합니다! 숲에서 보낸 99일 밤 (99 Nights in the Forest) 개발이 완료되었습니다!**

### 최종 기능 목록

- ✅ 로우폴리 3D 그래픽
- ✅ 플레이어 캐릭터 (WASD 이동, 점프, 달리기)
- ✅ 생존 시스템 (체력, 배고픔, 정신력)
- ✅ 낮/밤 사이클 (7분 주기)
- ✅ 몬스터 (뱀, 원숭이, 곰, 불개미, 거대 지네, 광신도)
- ✅ 전투 시스템 (칼, 활, 총)
- ✅ 인벤토리 & 제작
- ✅ 이벤트 (광신도 습격, 불개미 대습격, 번개)
- ✅ 보스전 (거대 불개미)
- ✅ 3가지 엔딩
- ✅ 메인 메뉴 & 설정
- ✅ 사운드 시스템
- ✅ 저장/불러오기
- ✅ Vercel 배포

### 예상 개발 기간

**총 25일 (약 4주)**

---

**화이팅! 🚀**
