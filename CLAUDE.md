# 숲에서 보낸 99일 밤 (Forest 99 Nights)

Three.js + React 기반 로우폴리 생존 게임

## Quick Reference

| 항목 | 값 |
|------|-----|
| **배포 URL** | https://forest99.vercel.app |
| **로컬 URL** | https://forest99.ngrok.app |
| **기술 스택** | Vite, React 18, React Three Fiber, Drei, Three.js, Zustand |
| **상태** | 개발 완료 (Phase 1-14) |

## 프로젝트 구조

```
src/
├── components/
│   ├── game/           # 게임 오브젝트 (Player, Terrain, Monsters...)
│   ├── lowpoly/        # 로우폴리 3D 모델 (Tree, Rock, Character)
│   └── ui/             # UI 컴포넌트 (HUD, Inventory, Menus)
├── stores/             # Zustand 상태 (player, game, combat, inventory, resource, event)
├── systems/            # 게임 시스템 (AI, Survival, Collision)
├── data/               # 게임 데이터 (config, monsters, items, events, boss)
├── hooks/              # React hooks (useControls)
└── utils/              # 유틸리티 (noise.js - 지형 생성)
```

## 핵심 파일

| 파일 | 역할 |
|------|------|
| `src/components/game/Player.jsx` | 플레이어 이동, 카메라, 전투, 지형 추적 |
| `src/components/game/Terrain.jsx` | Perlin noise 기반 지형 메시 생성 |
| `src/utils/noise.js` | `getTerrainHeight()` - 지형 높이 계산 |
| `src/systems/AISystem.js` | 몬스터/보스 AI (배회, 추적, 공격) |
| `src/stores/gameStore.js` | 게임 상태 (MENU, PLAYING, PAUSED, etc.) |
| `src/stores/playerStore.js` | 플레이어 스탯 (HP, 배고픔, 정신력) |
| `src/data/config.js` | 게임 설정 상수 |

## 게임 시스템 요약

### 생존 (Phase 4)
- HP, 배고픔, 정신력 3가지 스탯
- 베이스캠프 근처에서 정신력 회복

### 낮/밤 (Phase 5)
- 60초 주기, 밤에 정신력 급감
- 밤 전용 몬스터 (지네, 광신도)

### 몬스터 (Phase 6-7)
- 주간: 뱀, 원숭이, 곰, 불개미
- 야간: 거대 지네 (12 세그먼트), 광신도
- 보스: 숲의 수호자 (99일차, HP 3000, 3페이즈)

### 전투 (Phase 8)
- 마우스 클릭 공격, 콤보 시스템 (최대 5콤보)
- 무기: 주먹 → 나뭇가지 → 돌도끼 → 창 → 횃불

### 인벤토리 & 크래프팅 (Phase 9)
- I: 인벤토리 (5x4 그리드)
- C: 크래프팅
- E: 자원 수집

### 이벤트 (Phase 10)
- 6가지: 짙은 안개, 자원 풍요, 폭풍, 몬스터 습격, 핏빛 달, 지진
- 15초마다 확률적 발생

### UI (Phase 12)
- 메인 메뉴, 일시정지 (ESC), 승리/게임오버 화면

## 지형 시스템 (Phase 14)

```javascript
// src/utils/noise.js
export const TERRAIN_SCALE = 0.03;      // 낮을수록 부드러운 언덕
export const TERRAIN_AMPLITUDE = 5;     // 높이 범위: -5 ~ +5

export function getTerrainHeight(x, z, scale = TERRAIN_SCALE, amplitude = TERRAIN_AMPLITUDE) {
  return simplex.noise2D(x * scale, z * scale) * amplitude;
}
```

- 플레이어/몬스터가 지형 높이를 따라 이동
- 오르막: 속도 감소 (최대 50%), 내리막: 속도 증가 (최대 30%)

## 배포

```bash
npm run build && vercel --prod --yes
```

## 조작법

| 키 | 동작 |
|----|------|
| WASD | 이동 |
| Shift | 달리기 |
| Space | 점프 |
| 마우스 | 시점/공격 |
| I/C/E | 인벤토리/크래프팅/수집 |
| ESC | 일시정지 |

## 개발 히스토리

- **Phase 1-3**: 프로젝트 설정, 로우폴리 월드, 플레이어 이동
- **Phase 4**: 생존 시스템 (HP, 배고픔, 정신력) & HUD
- **Phase 5**: 낮/밤 사이클 (60초 주기)
- **Phase 6-7**: 몬스터 시스템 (6종 + 보스)
- **Phase 8**: 전투 시스템 (무기, 콤보)
- **Phase 9**: 인벤토리 & 크래프팅
- **Phase 10**: 이벤트 시스템 (6가지)
- **Phase 11**: 보스 & 엔딩 (99일차 숲의 수호자)
- **Phase 12**: UI 폴리시 (메인메뉴, 일시정지)
- **Phase 13**: Vercel 배포
- **Phase 14**: 게임플레이 폴리시 (지형 따라 걷기)

## 상세 문서

- `docs/PROGRESS.md` - 상세 개발 진행 현황
- `docs/plans/` - Phase별 구현 계획서
