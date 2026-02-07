# Phase 20: 업적 시스템 (Achievements)

## Overview
게임 내 목표 달성 추적 및 알림. 업적 갤러리.

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/stores/achievementStore.js` | 업적 상태 관리 |
| `src/data/achievements.js` | 업적 정의 |
| `src/components/ui/AchievementNotification.jsx` | 업적 해금 알림 |
| `src/components/ui/AchievementNotification.css` | 스타일 |
| `src/components/ui/AchievementGallery.jsx` | 업적 목록 UI |
| `src/components/ui/AchievementGallery.css` | 스타일 |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `App.jsx` | AchievementNotification 추가 |
| `MainMenu.jsx` | 업적 갤러리 버튼 추가 |
| `gameStore.js` | 날짜 변경 시 업적 체크 |
| `combatStore.js` | 몬스터 킬 카운트 |
| `inventoryStore.js` | 제작 카운트 |

## Achievement Definitions

```javascript
// src/data/achievements.js
export const ACHIEVEMENTS = {
  // 생존
  SURVIVE_7_DAYS: {
    id: 'survive_7_days',
    name: '일주일 생존',
    description: '7일 동안 생존하세요',
    icon: '📅',
    condition: (stats) => stats.daysSurvived >= 7,
  },
  SURVIVE_30_DAYS: {
    id: 'survive_30_days',
    name: '한 달 생존',
    description: '30일 동안 생존하세요',
    icon: '🗓️',
    condition: (stats) => stats.daysSurvived >= 30,
  },
  SURVIVE_99_DAYS: {
    id: 'survive_99_days',
    name: '99일의 밤',
    description: '99일 동안 생존하세요',
    icon: '🏆',
    condition: (stats) => stats.daysSurvived >= 99,
  },
  
  // 전투
  FIRST_KILL: {
    id: 'first_kill',
    name: '첫 사냥',
    description: '몬스터를 처음으로 처치하세요',
    icon: '⚔️',
    condition: (stats) => stats.monstersKilled >= 1,
  },
  MONSTER_HUNTER: {
    id: 'monster_hunter',
    name: '몬스터 헌터',
    description: '몬스터 50마리를 처치하세요',
    icon: '🗡️',
    condition: (stats) => stats.monstersKilled >= 50,
  },
  BOSS_SLAYER: {
    id: 'boss_slayer',
    name: '숲의 해방자',
    description: '숲의 수호자를 물리치세요',
    icon: '👑',
    condition: (stats) => stats.bossDefeated,
  },
  
  // 제작
  FIRST_CRAFT: {
    id: 'first_craft',
    name: '장인의 시작',
    description: '아이템을 처음으로 제작하세요',
    icon: '🔨',
    condition: (stats) => stats.itemsCrafted >= 1,
  },
  MASTER_CRAFTER: {
    id: 'master_crafter',
    name: '마스터 장인',
    description: '아이템 20개를 제작하세요',
    icon: '⚒️',
    condition: (stats) => stats.itemsCrafted >= 20,
  },
  
  // 수집
  GATHERER: {
    id: 'gatherer',
    name: '수집가',
    description: '자원 100개를 수집하세요',
    icon: '🌲',
    condition: (stats) => stats.resourcesGathered >= 100,
  },
  
  // 특별
  NIGHT_OWL: {
    id: 'night_owl',
    name: '야행성',
    description: '밤에 10마리의 몬스터를 처치하세요',
    icon: '🦉',
    condition: (stats) => stats.nightKills >= 10,
  },
  COMBO_MASTER: {
    id: 'combo_master',
    name: '콤보 마스터',
    description: '5콤보를 달성하세요',
    icon: '💥',
    condition: (stats) => stats.maxCombo >= 5,
  },
  SURVIVOR: {
    id: 'survivor',
    name: '불굴의 의지',
    description: 'HP 10% 이하에서 생존하세요',
    icon: '💪',
    condition: (stats) => stats.survivedLowHealth,
  },
};
```

## Achievement Store

```javascript
// src/stores/achievementStore.js
import { create } from 'zustand';
import { ACHIEVEMENTS } from '../data/achievements';

export const useAchievementStore = create((set, get) => ({
  unlocked: [],
  stats: {
    daysSurvived: 0,
    monstersKilled: 0,
    nightKills: 0,
    itemsCrafted: 0,
    resourcesGathered: 0,
    maxCombo: 0,
    bossDefeated: false,
    survivedLowHealth: false,
  },
  pendingNotifications: [],
  
  updateStat: (key, value) => {
    set((state) => ({
      stats: { ...state.stats, [key]: value },
    }));
    get().checkAchievements();
  },
  
  incrementStat: (key, amount = 1) => {
    set((state) => ({
      stats: { ...state.stats, [key]: state.stats[key] + amount },
    }));
    get().checkAchievements();
  },
  
  checkAchievements: () => {
    const { stats, unlocked } = get();
    
    Object.values(ACHIEVEMENTS).forEach((achievement) => {
      if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
        get().unlockAchievement(achievement);
      }
    });
  },
  
  unlockAchievement: (achievement) => {
    set((state) => ({
      unlocked: [...state.unlocked, achievement.id],
      pendingNotifications: [...state.pendingNotifications, achievement],
    }));
    get().saveProgress();
  },
  
  dismissNotification: () => {
    set((state) => ({
      pendingNotifications: state.pendingNotifications.slice(1),
    }));
  },
  
  saveProgress: () => {
    const { unlocked, stats } = get();
    localStorage.setItem('forest99_achievements', JSON.stringify({ unlocked, stats }));
  },
  
  loadProgress: () => {
    const saved = localStorage.getItem('forest99_achievements');
    if (saved) {
      const { unlocked, stats } = JSON.parse(saved);
      set({ unlocked, stats });
    }
  },
  
  getUnlockedCount: () => get().unlocked.length,
  getTotalCount: () => Object.keys(ACHIEVEMENTS).length,
}));
```

## Implementation Steps

1. `achievements.js` 생성 (업적 정의)
2. `achievementStore.js` 생성
3. `AchievementNotification.jsx` 생성
   - 팝업 애니메이션
   - 3초 후 자동 사라짐
4. `AchievementGallery.jsx` 생성
   - 잠금/해금 상태 표시
   - 진행도 표시
5. `MainMenu.jsx`에 업적 버튼 추가
6. `App.jsx`에 AchievementNotification 추가
7. 각 스토어에 통계 업데이트 트리거 추가:
   - `gameStore.incrementDay()` → daysSurvived 업데이트
   - `combatStore.damageMonster()` (사망 시) → monstersKilled 증가
   - `inventoryStore.craft()` → itemsCrafted 증가
   - `resourceStore.harvestResource()` → resourcesGathered 증가
   - `playerStore.attack()` → maxCombo 업데이트
8. 저장/불러오기 연동

## Notification UI

```css
.achievement-notification {
  position: fixed;
  top: 80px;
  right: 20px;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border: 2px solid #ffd700;
  border-radius: 12px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  animation: achievement-slide-in 0.5s ease-out;
  z-index: 2000;
  min-width: 280px;
}

.achievement-icon {
  font-size: 40px;
}

.achievement-content {
  flex: 1;
}

.achievement-label {
  color: #ffd700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.achievement-name {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
}

@keyframes achievement-slide-in {
  from { 
    transform: translateX(100%); 
    opacity: 0; 
  }
  to { 
    transform: translateX(0); 
    opacity: 1; 
  }
}
```

## Gallery UI

```css
.achievement-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.achievement-card {
  background: rgba(40, 40, 40, 0.9);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.achievement-card.unlocked {
  border-color: #ffd700;
}

.achievement-card.locked {
  opacity: 0.5;
  filter: grayscale(1);
}

.achievement-card-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.achievement-card-name {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.achievement-card-desc {
  color: #888;
  font-size: 12px;
  margin-top: 5px;
}

.achievement-progress {
  text-align: center;
  color: #ffd700;
  font-size: 18px;
  margin-bottom: 20px;
}
```

## Testing Checklist

- [ ] 7일/30일/99일 생존 업적
- [ ] 첫 킬/50킬 업적
- [ ] 보스 처치 업적
- [ ] 첫 제작/20제작 업적
- [ ] 100자원 수집 업적
- [ ] 야간 10킬 업적
- [ ] 5콤보 업적
- [ ] 업적 해금 알림 팝업
- [ ] 업적 갤러리 표시
- [ ] 진행 저장/불러오기

## Estimated Effort

**High (3-4시간)**
