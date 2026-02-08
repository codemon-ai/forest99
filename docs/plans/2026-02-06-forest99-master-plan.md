# Forest 99 - Master Implementation Plan

**Goal:** Build "숲에서 보낸 99일 밤" (99 Nights in the Forest) - a Three.js + React survival game with low-poly graphics

**Architecture:** React SPA with React Three Fiber for 3D rendering, Zustand for state management, component-based game systems

**Tech Stack:** Vite, React 18+, React Three Fiber, Drei, Zustand, Howler.js, Vercel

---

## Overview

이 게임은 13개의 Phase로 나누어 개발합니다. 각 Phase는 독립적으로 테스트 가능한 기능 단위입니다.

| Phase | 내용 | 예상 기간 | 우선순위 |
|-------|------|----------|---------|
| 1 | 프로젝트 설정 | Day 1 | Critical |
| 2 | 로우폴리 월드 | Day 2-3 | Critical |
| 3 | 플레이어 캐릭터 | Day 4-5 | Critical |
| 4 | 생존 시스템 | Day 6-7 | High |
| 5 | 낮/밤 사이클 | Day 8 | High |
| 6 | 몬스터 기본 | Day 9-11 | High |
| 7 | 거대 지네 & 광신도 | Day 12-13 | Medium |
| 8 | 전투 시스템 | Day 14-15 | High |
| 9 | 인벤토리 & 제작 | Day 16-18 | High |
| 10 | 이벤트 시스템 | Day 19-20 | Medium |
| 11 | 보스 & 엔딩 | Day 21-22 | Medium |
| 12 | UI & 폴리싱 | Day 23-24 | Low |
| 13 | Vercel 배포 | Day 25 | Low |

---

## 색상 팔레트 (전체 공유)

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
```

---

## Phase별 상세 계획 문서

각 Phase는 개별 문서로 분리되어 있습니다:

1. `2026-02-06-phase01-project-setup.md`
2. `2026-02-06-phase02-lowpoly-world.md`
3. `2026-02-06-phase03-player-character.md`
4. (이후 Phase는 Phase 1-3 완료 후 작성)

---

## 개발 원칙

1. **TDD**: 테스트 먼저, 구현 나중
2. **DRY**: 반복 코드 최소화
3. **YAGNI**: 필요한 것만 구현
4. **Frequent Commits**: 각 기능 단위로 커밋
5. **Low-Poly First**: 항상 `flatShading: true`

---

## 다음 단계

Phase 1 (프로젝트 설정)부터 시작합니다.
→ `docs/plans/2026-02-06-phase01-project-setup.md` 참조
