# Phase 19: 튜토리얼 시스템 (Tutorial)

## Overview
첫 플레이어를 위한 단계별 가이드. UI 하이라이트와 진행 추적.

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/stores/tutorialStore.js` | 튜토리얼 상태 관리 |
| `src/data/tutorial.js` | 튜토리얼 단계 정의 |
| `src/components/ui/TutorialOverlay.jsx` | 튜토리얼 UI |
| `src/components/ui/TutorialOverlay.css` | 스타일 |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `App.jsx` | TutorialOverlay 추가 |
| `MainMenu.jsx` | 튜토리얼 시작 옵션 |
| `HUD.jsx` | 하이라이트 효과 |
| `Inventory.jsx` | 하이라이트 효과 |

## Tutorial Steps

```javascript
// src/data/tutorial.js
export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: '숲에서 보낸 99일 밤에 오신 것을 환영합니다!',
    description: '99일 동안 생존하고 숲의 수호자를 물리쳐야 합니다.',
    trigger: 'gameStart',
    highlight: null,
  },
  {
    id: 'movement',
    title: '이동하기',
    description: 'WASD 키로 이동하고, Shift로 달리세요.',
    trigger: 'gameStart',
    highlight: null,
    completeCondition: 'playerMoved',
  },
  {
    id: 'camera',
    title: '시점 조작',
    description: '마우스를 움직여 주변을 둘러보세요.',
    trigger: 'afterMovement',
    highlight: null,
    completeCondition: 'cameraRotated',
  },
  {
    id: 'attack',
    title: '공격하기',
    description: '마우스 클릭으로 공격하세요.',
    trigger: 'afterCamera',
    highlight: null,
    completeCondition: 'playerAttacked',
  },
  {
    id: 'harvest',
    title: '자원 수집',
    description: 'E 키로 나무와 돌을 수집하세요.',
    trigger: 'nearResource',
    highlight: 'interactPrompt',
    completeCondition: 'resourceHarvested',
  },
  {
    id: 'inventory',
    title: '인벤토리',
    description: 'I 키로 인벤토리를 열 수 있습니다.',
    trigger: 'afterHarvest',
    highlight: 'inventoryHint',
    completeCondition: 'inventoryOpened',
  },
  {
    id: 'crafting',
    title: '제작하기',
    description: 'C 키로 아이템을 제작하세요.',
    trigger: 'afterInventory',
    highlight: 'craftingHint',
    completeCondition: 'craftingOpened',
  },
  {
    id: 'survival',
    title: '생존하기',
    description: 'HP, 배고픔, 정신력을 관리하세요. 밤에는 더 위험합니다!',
    trigger: 'afterCrafting',
    highlight: 'hudStats',
  },
  {
    id: 'complete',
    title: '준비 완료!',
    description: '이제 숲에서 생존할 준비가 되었습니다. 행운을 빕니다!',
    trigger: 'afterSurvival',
    highlight: null,
  },
];
```

## Tutorial Store

```javascript
// src/stores/tutorialStore.js
import { create } from 'zustand';
import { TUTORIAL_STEPS } from '../data/tutorial';

export const useTutorialStore = create((set, get) => ({
  isActive: false,
  currentStepIndex: 0,
  completedConditions: new Set(),
  
  get currentStep() {
    return TUTORIAL_STEPS[get().currentStepIndex];
  },
  
  startTutorial: () => set({ isActive: true, currentStepIndex: 0 }),
  
  skipTutorial: () => {
    set({ isActive: false });
    localStorage.setItem('forest99_tutorial_completed', 'true');
  },
  
  nextStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      get().completeTutorial();
    }
  },
  
  completeCondition: (condition) => {
    const { completedConditions, currentStep } = get();
    completedConditions.add(condition);
    set({ completedConditions: new Set(completedConditions) });
    
    if (currentStep?.completeCondition === condition) {
      get().nextStep();
    }
  },
  
  completeTutorial: () => {
    set({ isActive: false });
    localStorage.setItem('forest99_tutorial_completed', 'true');
  },
  
  isNewPlayer: () => {
    return localStorage.getItem('forest99_tutorial_completed') !== 'true';
  },
}));
```

## Implementation Steps

1. `tutorial.js` 생성 (단계 정의)
2. `tutorialStore.js` 생성
3. `TutorialOverlay.jsx` 생성
   - 현재 단계 표시
   - "다음" / "건너뛰기" 버튼
   - 하이라이트 오버레이
4. `MainMenu.jsx` 수정 - 첫 플레이어 감지, 튜토리얼 자동 시작
5. `App.jsx`에 TutorialOverlay 추가
6. 각 컴포넌트에 완료 조건 트리거 추가:
   - Player.jsx: playerMoved, cameraRotated, playerAttacked
   - resourceStore.js: resourceHarvested
   - inventoryStore.js: inventoryOpened, craftingOpened
7. 하이라이트 CSS 애니메이션 추가

## Highlight System

```css
.tutorial-highlight {
  position: relative;
  z-index: 1000;
  animation: highlight-pulse 1.5s infinite;
}

@keyframes highlight-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(255, 215, 0, 0.8); }
}

.tutorial-overlay {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 20px 30px;
  border-radius: 12px;
  border: 2px solid #ffd700;
  max-width: 400px;
  text-align: center;
  z-index: 1001;
}

.tutorial-title {
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.tutorial-description {
  color: white;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.tutorial-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.tutorial-button {
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.tutorial-next {
  background: #ffd700;
  color: #1a1a1a;
}

.tutorial-skip {
  background: transparent;
  border: 1px solid #666;
  color: #999;
}
```

## Testing Checklist

- [ ] 첫 플레이어 자동 감지
- [ ] 튜토리얼 시작/건너뛰기
- [ ] 각 단계 순서대로 진행
- [ ] 조건 충족 시 자동 다음 단계
- [ ] UI 하이라이트 효과
- [ ] 튜토리얼 완료 시 localStorage 저장
- [ ] 재방문 시 튜토리얼 건너뛰기

## Estimated Effort

**Medium (3시간)**
