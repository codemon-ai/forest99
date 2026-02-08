# Phase 19: 튜토리얼 시스템 (Tutorial)

## Overview
첫 플레이어를 위한 단계별 가이드. UI 하이라이트와 진행 추적. **데스크톱/모바일 모두 지원.**

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/data/tutorial.js` | 튜토리얼 단계 정의 |
| `src/stores/tutorialStore.js` | 튜토리얼 상태 관리 |
| `src/components/ui/TutorialOverlay.jsx` | 튜토리얼 UI |
| `src/components/ui/TutorialOverlay.css` | 스타일 (반응형 포함) |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `App.jsx` | TutorialOverlay 추가 |
| `MainMenu.jsx` | 튜토리얼 시작/재시작 옵션 |
| `Player.jsx` | 이동/카메라/공격/점프 조건 트리거 |
| `resourceStore.js` | 채집 조건 트리거 |
| `inventoryStore.js` | 인벤토리/제작 조건 트리거 |
| `VirtualJoystick.jsx` | 하이라이트 클래스 지원 |
| `TouchButtons.jsx` | 하이라이트 클래스 지원 |

---

## Tutorial Steps (10단계)

```javascript
// src/data/tutorial.js
export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: '숲에서 보낸 99일 밤에 오신 것을 환영합니다!',
    description: '99일 동안 생존하고 숲의 수호자를 물리쳐야 합니다.',
    trigger: 'gameStart',
    highlight: null,
    pauseGame: true,
    requireConfirm: true,
  },
  {
    id: 'movement',
    title: '이동하기',
    description: {
      desktop: 'WASD 키로 이동하고, Shift로 달리세요.',
      mobile: '왼쪽 조이스틱으로 이동하세요.',
    },
    trigger: 'afterWelcome',
    highlight: { desktop: null, mobile: 'joystick' },
    completeCondition: 'playerMoved',
  },
  {
    id: 'camera',
    title: '시점 조작',
    description: {
      desktop: '마우스를 움직여 주변을 둘러보세요.',
      mobile: '화면을 스와이프하여 주변을 둘러보세요.',
    },
    trigger: 'afterMovement',
    highlight: null,
    completeCondition: 'cameraRotated',
  },
  {
    id: 'jump',
    title: '점프하기',
    description: {
      desktop: 'Space 키로 점프하세요.',
      mobile: 'JUMP 버튼을 터치하세요.',
    },
    trigger: 'afterCamera',
    highlight: { desktop: null, mobile: 'touchBtn-jump' },
    completeCondition: 'playerJumped',
  },
  {
    id: 'attack',
    title: '공격하기',
    description: {
      desktop: '마우스 클릭으로 공격하세요.',
      mobile: 'ATK 버튼을 터치하세요.',
    },
    trigger: 'afterJump',
    highlight: { desktop: null, mobile: 'touchBtn-attack' },
    completeCondition: 'playerAttacked',
  },
  {
    id: 'harvest',
    title: '자원 수집',
    description: {
      desktop: '나무나 바위 근처에서 E 키로 수집하세요.',
      mobile: '나무나 바위 근처에서 E 버튼을 터치하세요.',
    },
    trigger: 'afterAttack',
    highlight: { desktop: 'interactPrompt', mobile: 'touchBtn-interact' },
    completeCondition: 'resourceHarvested',
  },
  {
    id: 'inventory',
    title: '인벤토리',
    description: {
      desktop: 'I 키로 인벤토리를 열 수 있습니다.',
      mobile: 'I 버튼으로 인벤토리를 열 수 있습니다.',
    },
    trigger: 'afterHarvest',
    highlight: { desktop: null, mobile: 'touchBtn-inventory' },
    completeCondition: 'inventoryOpened',
  },
  {
    id: 'crafting',
    title: '제작하기',
    description: {
      desktop: 'C 키로 아이템을 제작하세요.',
      mobile: '인벤토리에서 제작 탭을 선택하세요.',
    },
    trigger: 'afterInventory',
    highlight: 'craftingTab',
    completeCondition: 'craftingOpened',
  },
  {
    id: 'survival',
    title: '생존하기',
    description: 'HP, 배고픔, 정신력을 관리하세요. 밤에는 더 위험합니다!',
    trigger: 'afterCrafting',
    highlight: 'hudStats',
    requireConfirm: true,
  },
  {
    id: 'complete',
    title: '준비 완료!',
    description: '이제 숲에서 생존할 준비가 되었습니다. 행운을 빕니다!',
    trigger: 'afterSurvival',
    highlight: null,
    requireConfirm: true,
  },
];
```

---

## Tutorial Store

```javascript
// src/stores/tutorialStore.js
import { create } from 'zustand';
import { TUTORIAL_STEPS } from '../data/tutorial';

export const useTutorialStore = create((set, get) => ({
  isActive: false,
  currentStepIndex: 0,
  completedConditions: [],
  
  getCurrentStep: () => TUTORIAL_STEPS[get().currentStepIndex],
  
  startTutorial: () => set({ 
    isActive: true, 
    currentStepIndex: 0,
    completedConditions: [],
  }),
  
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
    const { completedConditions, getCurrentStep, nextStep } = get();
    if (completedConditions.includes(condition)) return;
    
    set({ completedConditions: [...completedConditions, condition] });
    
    const currentStep = getCurrentStep();
    if (currentStep?.completeCondition === condition) {
      nextStep();
    }
  },
  
  completeTutorial: () => {
    set({ isActive: false });
    localStorage.setItem('forest99_tutorial_completed', 'true');
  },
  
  isNewPlayer: () => {
    return localStorage.getItem('forest99_tutorial_completed') !== 'true';
  },
  
  resetTutorial: () => {
    localStorage.removeItem('forest99_tutorial_completed');
    set({ isActive: false, currentStepIndex: 0, completedConditions: [] });
  },
}));
```

---

## TutorialOverlay Component

```jsx
// src/components/ui/TutorialOverlay.jsx
import { useTutorialStore } from '../../stores/tutorialStore';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import './TutorialOverlay.css';

export default function TutorialOverlay() {
  const isActive = useTutorialStore((state) => state.isActive);
  const getCurrentStep = useTutorialStore((state) => state.getCurrentStep);
  const nextStep = useTutorialStore((state) => state.nextStep);
  const skipTutorial = useTutorialStore((state) => state.skipTutorial);
  const { isTouchDevice } = useDeviceDetect();
  
  if (!isActive) return null;
  
  const step = getCurrentStep();
  if (!step) return null;
  
  const description = typeof step.description === 'object'
    ? (isTouchDevice ? step.description.mobile : step.description.desktop)
    : step.description;
  
  const showNextButton = step.requireConfirm || !step.completeCondition;
  
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <h3 className="tutorial-title">{step.title}</h3>
        <p className="tutorial-description">{description}</p>
        <div className="tutorial-buttons">
          {showNextButton && (
            <button className="tutorial-btn tutorial-next" onClick={nextStep}>
              {step.id === 'complete' ? '시작하기' : '다음'}
            </button>
          )}
          {step.id !== 'complete' && (
            <button className="tutorial-btn tutorial-skip" onClick={skipTutorial}>
              건너뛰기
            </button>
          )}
        </div>
        <div className="tutorial-progress">
          {TUTORIAL_STEPS.map((s, i) => (
            <div 
              key={s.id}
              className={`progress-dot ${i <= currentStepIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## CSS Styles (Responsive)

```css
/* src/components/ui/TutorialOverlay.css */

.tutorial-overlay {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  pointer-events: auto;
}

.tutorial-content {
  background: rgba(0, 0, 0, 0.9);
  padding: 20px 30px;
  border-radius: 12px;
  border: 2px solid #ffd700;
  max-width: 400px;
  text-align: center;
}

.tutorial-title {
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.tutorial-description {
  color: white;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 15px 0;
}

.tutorial-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.tutorial-btn {
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  border: none;
  transition: transform 0.1s, opacity 0.2s;
}

.tutorial-btn:active {
  transform: scale(0.95);
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

.tutorial-progress {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: 15px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #444;
}

.progress-dot.active {
  background: #ffd700;
}

/* Highlight Animation */
.tutorial-highlight {
  position: relative;
  z-index: 1000;
  animation: highlight-pulse 1.5s infinite;
}

@keyframes highlight-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(255, 215, 0, 0.8); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .tutorial-overlay {
    bottom: 200px; /* 조이스틱/버튼 위로 */
    left: 10px;
    right: 10px;
    transform: none;
  }
  
  .tutorial-content {
    max-width: 100%;
    padding: 15px 20px;
  }
  
  .tutorial-title {
    font-size: 16px;
  }
  
  .tutorial-description {
    font-size: 13px;
  }
  
  .tutorial-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .tutorial-overlay {
    bottom: 180px;
  }
  
  .tutorial-content {
    padding: 12px 16px;
  }
  
  .tutorial-title {
    font-size: 14px;
  }
  
  .tutorial-description {
    font-size: 12px;
  }
}
```

---

## Condition Triggers

### Player.jsx

```javascript
// 이동 감지
const hasMoved = useRef(false);
const hasRotated = useRef(false);
const hasJumped = useRef(false);
const hasAttacked = useRef(false);

// useFrame 내부
if (isMoving && !hasMoved.current) {
  hasMoved.current = true;
  useTutorialStore.getState().completeCondition('playerMoved');
}

// 카메라 회전 감지 (handleMouseMove 또는 handleTouchMove 내)
if (!hasRotated.current) {
  hasRotated.current = true;
  useTutorialStore.getState().completeCondition('cameraRotated');
}

// 점프 감지 (점프 로직 내)
if (keys.current.jump && !hasJumped.current) {
  hasJumped.current = true;
  useTutorialStore.getState().completeCondition('playerJumped');
}

// 공격 감지 (handleAttack 내)
if (!hasAttacked.current) {
  hasAttacked.current = true;
  useTutorialStore.getState().completeCondition('playerAttacked');
}
```

### resourceStore.js

```javascript
// harvestResource 함수 내
playSound(resource.type === 'tree' ? 'chop_wood' : 'mine_rock');
useTutorialStore.getState().completeCondition('resourceHarvested');
```

### inventoryStore.js

```javascript
// toggleInventory 함수 내
if (!wasOpen) {
  useTutorialStore.getState().completeCondition('inventoryOpened');
}

// toggleCrafting 함수 내
if (!wasOpen) {
  useTutorialStore.getState().completeCondition('craftingOpened');
}
```

---

## Highlight Integration

### VirtualJoystick.jsx

```javascript
const highlightTarget = useTutorialStore((state) => {
  const step = state.getCurrentStep?.();
  return step?.highlight?.mobile;
});

<div 
  className={`joystick-base ${highlightTarget === 'joystick' ? 'tutorial-highlight' : ''}`}
  // ...
>
```

### TouchButtons.jsx

```javascript
const highlightTarget = useTutorialStore((state) => {
  const step = state.getCurrentStep?.();
  return step?.highlight?.mobile;
});

<button 
  className={`touch-btn touch-btn-attack ${highlightTarget === 'touchBtn-attack' ? 'tutorial-highlight' : ''}`}
  // ...
>
<button 
  className={`touch-btn touch-btn-jump ${highlightTarget === 'touchBtn-jump' ? 'tutorial-highlight' : ''}`}
  // ...
>
// ... 나머지 버튼들
```

---

## MainMenu Integration

```jsx
// MainMenu.jsx
const isNewPlayer = useTutorialStore((state) => state.isNewPlayer);
const startTutorial = useTutorialStore((state) => state.startTutorial);
const resetTutorial = useTutorialStore((state) => state.resetTutorial);

// 새 게임 시작 시
const handleNewGame = () => {
  startGame();
  if (isNewPlayer()) {
    startTutorial();
  }
};

// 메뉴에 튜토리얼 버튼 추가
<button onClick={() => { resetTutorial(); startGame(); startTutorial(); }}>
  📖 튜토리얼
</button>
```

---

## Testing Checklist

### 데스크톱
- [ ] 첫 플레이어 자동 감지 → 튜토리얼 시작
- [ ] WASD 이동 → "playerMoved" 조건 충족
- [ ] 마우스 회전 → "cameraRotated" 조건 충족
- [ ] Space 점프 → "playerJumped" 조건 충족
- [ ] 마우스 클릭 → "playerAttacked" 조건 충족
- [ ] E 키 채집 → "resourceHarvested" 조건 충족
- [ ] I 키 → "inventoryOpened" 조건 충족
- [ ] C 키 → "craftingOpened" 조건 충족
- [ ] 건너뛰기 버튼 동작
- [ ] 완료 시 localStorage 저장
- [ ] 재방문 시 튜토리얼 건너뛰기

### 모바일
- [ ] 조이스틱 이동 → "playerMoved" 조건 충족
- [ ] 화면 스와이프 → "cameraRotated" 조건 충족
- [ ] JUMP 버튼 → "playerJumped" 조건 충족
- [ ] ATK 버튼 → "playerAttacked" 조건 충족
- [ ] E 버튼 → "resourceHarvested" 조건 충족
- [ ] I 버튼 → "inventoryOpened" 조건 충족
- [ ] 제작 탭 → "craftingOpened" 조건 충족
- [ ] 조이스틱 하이라이트 표시
- [ ] 터치 버튼 하이라이트 표시
- [ ] 오버레이가 조이스틱/버튼과 겹치지 않음
- [ ] 모바일 설명 텍스트 표시

### 메뉴
- [ ] 메인 메뉴에서 튜토리얼 재시작 가능

---

## Estimated Effort

**4-5시간**

| 작업 | 시간 |
|------|------|
| tutorial.js, tutorialStore.js | 30분 |
| TutorialOverlay 컴포넌트 | 1시간 |
| Player.jsx 조건 트리거 | 1시간 |
| Store 트리거 (resource, inventory) | 30분 |
| 하이라이트 통합 (Joystick, Buttons) | 30분 |
| MainMenu 통합 | 30분 |
| 테스트 & 버그 수정 | 1시간 |
