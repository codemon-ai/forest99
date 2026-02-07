# Phase 18: 모바일 지원 (Mobile Support)

## Overview
가상 조이스틱, 터치 버튼, 반응형 UI로 모바일 플레이 지원.

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/hooks/useTouchControls.js` | 터치 입력 처리 훅 |
| `src/hooks/useDeviceDetect.js` | 모바일/데스크톱 감지 |
| `src/components/ui/VirtualJoystick.jsx` | 가상 조이스틱 컴포넌트 |
| `src/components/ui/VirtualJoystick.css` | 스타일 |
| `src/components/ui/TouchButtons.jsx` | 공격/상호작용 터치 버튼 |
| `src/components/ui/TouchButtons.css` | 스타일 |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `useControls.js` | 터치 입력 통합 |
| `Player.jsx` | 터치 카메라 컨트롤 |
| `App.jsx` | 모바일 UI 조건부 렌더링 |
| `HUD.jsx` | 반응형 레이아웃 |
| `Inventory.jsx` | 반응형 그리드 |
| `MainMenu.css` | 반응형 스타일 |
| `PauseMenu.css` | 반응형 스타일 |

## Data Structure

```javascript
// useTouchControls.js
export function useTouchControls() {
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  return {
    joystickInput,
    isTouchDevice,
    onJoystickMove: (x, y) => setJoystickInput({ x, y }),
    onJoystickEnd: () => setJoystickInput({ x: 0, y: 0 }),
  };
}
```

## Implementation Steps

1. `useDeviceDetect.js` 생성 (터치 디바이스 감지)
2. `VirtualJoystick.jsx` 생성
   - 드래그 가능한 원형 조이스틱
   - 중앙에서 드래그 거리/방향 계산
3. `TouchButtons.jsx` 생성
   - 공격, 상호작용(E), 인벤토리(I) 버튼
4. `useTouchControls.js` 생성
5. `useControls.js` 수정 - 조이스틱 입력 통합
6. `Player.jsx` 수정 - 터치 드래그로 카메라 회전
7. 모든 UI CSS에 `@media` 쿼리 추가
8. `App.jsx`에서 모바일 UI 조건부 렌더링

## Virtual Joystick Component

```jsx
// VirtualJoystick.jsx
export default function VirtualJoystick({ onMove, onEnd }) {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const baseRef = useRef(null);
  
  const handleTouchStart = (e) => {
    setActive(true);
  };
  
  const handleTouchMove = (e) => {
    if (!active || !baseRef.current) return;
    
    const touch = e.touches[0];
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    const maxDistance = rect.width / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }
    
    setPosition({ x: dx, y: dy });
    onMove(dx / maxDistance, dy / maxDistance);
  };
  
  const handleTouchEnd = () => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    onEnd();
  };
  
  return (
    <div 
      ref={baseRef}
      className="joystick-base"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="joystick-knob"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      />
    </div>
  );
}
```

## CSS Breakpoints

```css
/* 태블릿 */
@media (max-width: 1024px) {
  .hud { font-size: 14px; }
}

/* 모바일 */
@media (max-width: 768px) {
  .hud { font-size: 12px; }
  .inventory-grid { grid-template-columns: repeat(4, 1fr); }
  .stat-bar { height: 12px; }
}

/* 소형 모바일 */
@media (max-width: 480px) {
  .hud { font-size: 10px; }
  .inventory-grid { grid-template-columns: repeat(3, 1fr); }
}
```

## Touch Buttons Layout

```
┌─────────────────────────────────────────┐
│                                         │
│                 [Game]                  │
│                                         │
│                                         │
│   ┌─────┐                    ┌───┐      │
│   │     │                    │ I │      │
│   │ Joy │               ┌───┐└───┘      │
│   │stick│               │ E │           │
│   │     │          ┌───┐└───┘           │
│   └─────┘          │ATK│                │
│                    └───┘                │
└─────────────────────────────────────────┘
```

## Testing Checklist

- [ ] 터치 디바이스 자동 감지
- [ ] 가상 조이스틱으로 이동
- [ ] 터치 버튼으로 공격/상호작용
- [ ] 터치 드래그로 카메라 회전
- [ ] HUD 반응형 레이아웃
- [ ] 인벤토리 반응형 그리드
- [ ] 메뉴 반응형 레이아웃
- [ ] 데스크톱에서 터치 UI 숨김

## Estimated Effort

**High (4-5시간)**
