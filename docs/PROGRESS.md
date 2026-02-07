# 숲에서 보낸 99일 밤 - 개발 진행 현황

**프로젝트:** Three.js + React 기반 로우폴리 생존 게임  
**작업 디렉토리:** `/Users/coffeemon/workspace/codemon/forest99`  
**접속 URL:** https://forest99.ngrok.app  
**최종 업데이트:** 2026-02-07 (Phase 14 완료 - 개발 완료!)
**배포 URL:** https://forest99.vercel.app

---

## 기술 스택

- **프레임워크:** Vite + React 18
- **3D 렌더링:** Three.js + React Three Fiber (v8.15.19) + Drei (v9.92.7)
- **상태관리:** Zustand
- **스타일:** CSS

---

## 완료된 Phase

### Phase 1-3: 프로젝트 설정 & 기본 월드 ✅

- Vite + React 프로젝트 초기화
- React Three Fiber 설정
- Perlin noise 기반 지형 생성
- 로우폴리 나무 100개 배치
- 로우폴리 바위 배치
- 플레이어 캐릭터 (WASD 이동, 마우스 시점)
- 3인칭 카메라 시스템

### Phase 4: 생존 시스템 & HUD ✅

- 체력(HP), 배고픔(Hunger), 정신력(Sanity) 시스템
- 시간에 따른 배고픔/정신력 감소
- 베이스캠프 근처에서 정신력 회복
- HUD 표시 (스탯 바, 일차 카운터)

### Phase 5: 낮/밤 사이클 ✅

- 60초 주기 낮/밤 전환
- 태양/달 위치 변화
- 조명 색상 변화 (낮: 밝은 하늘색, 밤: 어두운 남색)
- 밤에 정신력 급격히 감소
- 안개 효과

### Phase 6: 기본 몬스터 ✅

| 몬스터 | HP | 공격력 | 특징 |
|--------|-----|--------|------|
| 뱀 (Snake) | 30 | 10 | 빠른 이동, 물결 움직임 |
| 원숭이 (Monkey) | 50 | 15 | 민첩, 나무 근처 서식 |
| 곰 (Bear) | 150 | 30 | 느리지만 강력 |
| 불개미 (Fire Ant) | 10 | 5 | 떼로 출현 |

- AI 시스템 (배회, 추적, 공격 상태)
- 플레이어 감지 범위
- 베이스캠프 근처 스폰 제한

### Phase 7: 밤 몬스터 & 광신도 ✅

| 몬스터 | HP | 공격력 | 특징 |
|--------|-----|--------|------|
| 거대 지네 (Giant Centipede) | 500 | 40 | 밤에만 출현, 12개 세그먼트 |
| 광신도 (Cultist) | 80 | 20 | 밤에 출현 |

- 밤마다 지네 3마리 스폰
- 개미굴 구조물 추가

### Phase 8: 전투 시스템 ✅

**무기 시스템:**
| 무기 | 데미지 | 범위 | 쿨다운 |
|------|--------|------|--------|
| 주먹 | 5 | 1.5m | 0.5s |
| 나뭇가지 | 10 | 2m | 0.4s |
| 돌도끼 | 20 | 2.5m | 0.6s |
| 창 | 25 | 3m | 0.7s |
| 횃불 | 15 | 2m | 0.5s |

**전투 메카닉:**
- 마우스 클릭으로 공격
- 콤보 시스템 (1초 이내 연속 공격, 최대 5콤보)
- 콤보당 20% 추가 데미지
- 전방 90도 범위 내 가장 가까운 적 타겟팅

**시각 효과:**
- 캐릭터 펀치 애니메이션
- 몬스터 HP 바 (피격 시 표시)
- 데미지 숫자 팝업
- 피격 시 몬스터 확대 효과
- 사망 시 납작해지며 제거

### Phase 9: 인벤토리 & 크래프팅 ✅

**아이템 시스템:**
| 아이템 | 타입 | 스택 | 용도 |
|--------|------|------|------|
| 나뭇가지 | 재료 | 20 | 무기/횃불 제작 |
| 돌 | 재료 | 20 | 무기 제작 |
| 섬유 | 재료 | 30 | 묶는 용도 |
| 고기 | 소모품 | 10 | 배고픔 +30 |
| 열매 | 소모품 | 20 | 배고픔 +10, 정신력 +5 |
| 뱀 이빨 | 재료 | 10 | 창 제작 |
| 곰 발톱 | 재료 | 5 | 특수 무기 |
| 원숭이 털 | 재료 | 15 | 방어구 |
| 개미 껍질 | 재료 | 30 | 방어구 |

**크래프팅 레시피:**
| 결과물 | 재료 |
|--------|------|
| 나뭇가지 무기 | 나뭇가지 x3 + 섬유 x2 |
| 돌도끼 | 나뭇가지 x2 + 돌 x3 + 섬유 x3 |
| 창 | 나뭇가지 x4 + 돌 x2 + 뱀 이빨 x1 |
| 횃불 | 나뭇가지 x2 + 섬유 x5 |

**기능:**
- 인벤토리 UI (I 키) - 5x4 그리드
- 크래프팅 UI (C 키) - 레시피 목록
- 자원 수집 (E 키) - 나무/바위 근처에서
- 몬스터 사망 시 아이템 드랍
- 무기 장착 시스템 (인벤토리에서 더블클릭)
- 소모품 사용 (배고픔/정신력 회복)
- 퀵 인벤토리 표시 (우측 상단)
- 상호작용 프롬프트 (자원 근처)

### Phase 10: 이벤트 시스템 ✅

**이벤트 목록:**
| 이벤트 | 최소 일차 | 확률 | 지속시간 | 효과 |
|--------|----------|------|---------|------|
| 짙은 안개 | 1일 | 18% | 25s | 시야 제한, 몬스터 감지 범위 감소 |
| 자원 풍요 | 2일 | 10% | 40s | 자원 수집량 2배, 쿨다운 절반 |
| 폭풍 | 3일 | 15% | 30s | 이동속도 40% 감소, 시야 제한, 정신력 감소 |
| 몬스터 습격 | 5일 | 12% | 45s | 몬스터 스폰 3배, 어그로 범위 증가 |
| 핏빛 달 | 7일 (밤) | 10% | 60s | 몬스터 공격력/속도 증가, 정신력 감소 |
| 지진 | 10일 | 8% | 15s | 카메라 흔들림, 보너스 자원 |

**기능:**
- 15초마다 이벤트 발생 체크
- 이벤트 시작/종료 알림 UI
- 진행중인 이벤트 상태바 (남은 시간)
- 시각 효과:
  - 폭풍: 비 파티클
  - 안개: 짙은 fog 효과
  - 핏빛 달: 붉은 조명
  - 지진: 카메라 흔들림

**파일:**
- `src/data/events.js` - 이벤트 정의
- `src/stores/eventStore.js` - 이벤트 상태 관리
- `src/components/ui/EventNotification.jsx/css` - 알림 UI
- `src/components/game/EventEffects.jsx` - 시각 효과

### Phase 11: 보스 & 엔딩 ✅

**숲의 수호자 (Forest Guardian):**
| 스탯 | 값 |
|------|-----|
| HP | 3000 |
| 공격력 | 50 |
| 속도 | 2 (페이즈별 증가) |
| 등장 | 99일차 |

**페이즈 시스템:**
| 페이즈 | HP 비율 | 특징 |
|--------|---------|------|
| Phase 1 | 100-60% | 기본 공격 (슬램, 뿌리 공격) |
| Phase 2 | 60-30% | 미니언 소환, 속도 증가 |
| Phase 3 | 30% 이하 | 분노 모드, 빨간 발광 |

**기능:**
- 99일차 보스 자동 스폰
- 3단계 페이즈 전환 (HP 기반)
- 화면 하단 보스 HP 바 UI
- 승리 화면 (보스 처치 시)
- 게임오버 화면 (플레이어 사망 시)
- 다시 시작 버튼

**파일:**
- `src/data/boss.js` - 보스 데이터 정의
- `src/components/game/monsters/ForestGuardian.jsx` - 보스 3D 모델
- `src/components/game/BossSpawner.jsx` - 보스 스폰 로직
- `src/components/ui/BossHUD.jsx/css` - 보스 HP 바
- `src/components/ui/GameOverlay.jsx/css` - 엔딩/게임오버 화면
- `src/systems/AISystem.js` - 보스 AI 추가

### Phase 12: UI 폴리시 ✅

**메인 메뉴:**
- 게임 타이틀 화면
- 게임 시작 버튼
- 도움말 버튼 (조작법 모달)

**일시정지 메뉴:**
- ESC 키로 일시정지/재개
- 계속하기 버튼
- 도움말 버튼
- 메인 메뉴로 돌아가기

**게임 상태 관리:**
- MENU, PLAYING, PAUSED, BOSS_FIGHT, VICTORY, GAME_OVER 상태
- 일시정지 시 게임 로직 중단

**파일:**
- `src/components/ui/MainMenu.jsx/css` - 메인 메뉴
- `src/components/ui/PauseMenu.jsx/css` - 일시정지 메뉴
- `src/stores/gameStore.js` - 게임 상태 확장

### Phase 13: Vercel 배포 ✅

**배포 정보:**
- 프로덕션 URL: https://forest99.vercel.app
- 빌드 시스템: Vite
- 호스팅: Vercel

**빌드 결과:**
- HTML: 0.47 kB
- CSS: 13.36 kB (gzip: 2.93 kB)
- JS: 1,118 kB (gzip: 321 kB)

**파일:**
- `vercel.json` - Vercel 설정

### Phase 14: 게임플레이 폴리시 ✅

**지형 시스템:**
- 플레이어가 지형 높이를 따라 걸음
- 모든 몬스터가 지형 높이를 따라 이동
- 보스가 지형 높이를 따라 이동

**지형 파라미터 (2026-02-07 수정):**
```javascript
// src/utils/noise.js
export const TERRAIN_SCALE = 0.03;      // 0.05 → 0.03 (더 넓고 부드러운 언덕)
export const TERRAIN_AMPLITUDE = 5;     // 2 → 5 (높이 2.5배 증가)
```

**경사면 이동:**
- 오르막: 이동 속도 감소 (최대 50% 감소)
- 내리막: 이동 속도 증가 (최대 30% 증가)

**카메라:**
- 부드러운 Y축 추적 (lerp)
- 급격한 지형 변화에도 부드러운 카메라 움직임

**수정된 파일:**
- `src/components/game/Player.jsx` - 지형 추적, 경사면 속도, 카메라 smoothing
- `src/systems/AISystem.js` - 몬스터/보스 지형 높이 적용
- `src/utils/noise.js` - 지형 파라미터 상수 export (TERRAIN_SCALE, TERRAIN_AMPLITUDE)

---

## 현재 파일 구조

```
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── game/
│   │   ├── World.jsx
│   │   ├── Player.jsx
│   │   ├── Terrain.jsx
│   │   ├── Forest.jsx
│   │   ├── Rocks.jsx
│   │   ├── Base.jsx
│   │   ├── AntNest.jsx
│   │   ├── DayNight.jsx
│   │   ├── MonsterSpawner.jsx
│   │   ├── NightSpawner.jsx
│   │   ├── MonsterWrapper.jsx
│   │   ├── DamageNumbers.jsx
│   │   └── monsters/
│   │       ├── Snake.jsx
│   │       ├── Monkey.jsx
│   │       ├── Bear.jsx
│   │       ├── FireAnt.jsx
│   │       ├── GiantCentipede.jsx
│   │       ├── Cultist.jsx
│   │       └── ForestGuardian.jsx
│   │   ├── EventEffects.jsx
│   │   └── BossSpawner.jsx
│   ├── lowpoly/
│   │   ├── LowPolyTree.jsx
│   │   ├── LowPolyRock.jsx
│   │   └── LowPolyCharacter.jsx
│   └── ui/
│       ├── HUD.jsx
│       ├── HUD.css
│       ├── SanityEffect.jsx
│       ├── Inventory.jsx
│       ├── Inventory.css
│       ├── EventNotification.jsx
│       ├── EventNotification.css
│       ├── BossHUD.jsx
│       ├── BossHUD.css
│       ├── GameOverlay.jsx
│       ├── GameOverlay.css
│       ├── MainMenu.jsx
│       ├── MainMenu.css
│       ├── PauseMenu.jsx
│       └── PauseMenu.css
├── stores/
│   ├── playerStore.js
│   ├── gameStore.js
│   ├── combatStore.js
│   ├── inventoryStore.js
│   ├── resourceStore.js
│   └── eventStore.js
├── systems/
│   ├── AISystem.js
│   ├── SurvivalSystem.js
│   └── CollisionSystem.js
├── data/
│   ├── config.js
│   ├── monsters.js
│   ├── items.js
│   ├── events.js
│   └── boss.js
├── hooks/
│   └── useControls.js
└── utils/
    └── noise.js
```

---

## 남은 Phase

모든 Phase 완료! 🎉

---

## 서버 정보

**PM2 프로세스:**
- `forest99-dev` - Vite 개발 서버 (localhost:5173)
- `forest99-ngrok` - ngrok 터널 (forest99.ngrok.app)

**패키지 버전 (호환성 확인됨):**
```json
{
  "@react-three/fiber": "8.15.19",
  "@react-three/drei": "9.92.7",
  "three": "0.160.0"
}
```

---

## 조작법

| 키 | 동작 |
|----|------|
| WASD | 이동 |
| Shift | 달리기 |
| Space | 점프 |
| 마우스 이동 | 시점 회전 |
| 마우스 클릭 | 공격 |
| I | 인벤토리 |
| C | 크래프팅 |
| E | 상호작용 (자원 수집) |
| ESC | 일시정지 / UI 닫기 |

---

## 알려진 이슈

- 없음 (모든 이슈 해결됨)

---

## Continuation Prompt

```
숲에서 보낸 99일 밤 게임 - 개발 완료!

작업 디렉토리: /Users/coffeemon/workspace/codemon/forest99
배포 URL: https://forest99.vercel.app
로컬 URL: https://forest99.ngrok.app

현재 상태: 모든 Phase 완료! (Phase 1-14)

완성된 기능:
- 로우폴리 3D 월드 (지형, 나무, 바위)
- 생존 시스템 (HP, 배고픔, 정신력)
- 낮/밤 사이클 (60초 주기)
- 6종 몬스터 + 보스
- 전투 시스템 (콤보, 무기)
- 인벤토리 & 크래프팅
- 이벤트 시스템 (6가지)
- 보스 & 엔딩
- UI (메인메뉴, 일시정지, 도움말)
- 지형 따라 걷기

게임이 완성되었습니다! 🎮
```
