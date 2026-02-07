# Phase 17: 저장/불러오기 시스템 (Save/Load)

## Overview
LocalStorage 기반 게임 상태 저장. 자동 저장 + 수동 저장/불러오기.

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/systems/SaveSystem.js` | 저장/불러오기/자동저장 로직 |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `MainMenu.jsx` | "이어하기" 버튼 추가 |
| `PauseMenu.jsx` | "저장하기" 버튼 추가 |
| `gameStore.js` | 날짜 변경 시 자동저장 호출 |
| `playerStore.js` | reset() 함수 추가 |
| `inventoryStore.js` | reset() 함수 추가 |
| `combatStore.js` | reset() 함수 추가 |
| `resourceStore.js` | reset() 함수 추가 |

## Data Structure

```javascript
// 저장 데이터 형식
const SAVE_DATA = {
  version: 1,
  savedAt: Date.now(),
  player: {
    position: [x, y, z],
    health: 100,
    hunger: 100,
    sanity: 100,
    currentWeapon: 'FIST',
  },
  game: {
    day: 1,
    timeOfDay: 0,
    isNight: false,
    bossDefeated: false,
  },
  inventory: {
    slots: [...],
  },
};
```

## Implementation Steps

1. `SaveSystem.js` 생성
   - `saveGame()` - 모든 스토어 상태 직렬화
   - `loadGame()` - localStorage에서 복원
   - `hasSaveData()` - 저장 데이터 존재 확인
   - `deleteSave()` - 저장 데이터 삭제
2. 각 스토어에 `reset()` 함수 추가
3. 각 스토어에 `getState()` / `setState()` 함수 추가
4. `gameStore.incrementDay()`에 자동 저장 호출 추가
5. `MainMenu.jsx`에 "이어하기" 버튼 추가
6. `PauseMenu.jsx`에 "저장하기" 버튼 추가
7. 새 게임 시작 시 기존 저장 삭제 확인 다이얼로그

## SaveSystem API

```javascript
// src/systems/SaveSystem.js
const SAVE_KEY = 'forest99_save';

export const SaveSystem = {
  hasSaveData() {
    return localStorage.getItem(SAVE_KEY) !== null;
  },
  
  saveGame() {
    const saveData = {
      version: 1,
      savedAt: Date.now(),
      player: usePlayerStore.getState().getSaveData(),
      game: useGameStore.getState().getSaveData(),
      inventory: useInventoryStore.getState().getSaveData(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  },
  
  loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return false;
    
    const saveData = JSON.parse(saved);
    usePlayerStore.getState().loadSaveData(saveData.player);
    useGameStore.getState().loadSaveData(saveData.game);
    useInventoryStore.getState().loadSaveData(saveData.inventory);
    return true;
  },
  
  deleteSave() {
    localStorage.removeItem(SAVE_KEY);
  },
};
```

## Testing Checklist

- [ ] 게임 진행 후 수동 저장
- [ ] 새로고침 후 불러오기
- [ ] 날짜 변경 시 자동 저장
- [ ] 저장 데이터 있을 때 "이어하기" 버튼 표시
- [ ] 새 게임 시 기존 저장 덮어쓰기 확인
- [ ] 플레이어 위치, 체력, 인벤토리 모두 복원

## Estimated Effort

**Medium (2-3시간)**
