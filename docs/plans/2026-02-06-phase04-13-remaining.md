# Phase 4-13: Remaining Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete remaining game systems - survival, combat, monsters, events, and polish

**Architecture:** Incremental feature addition with immediate testing

**Tech Stack:** React Three Fiber, Zustand, Howler.js (for sound)

---

## Phase 4: 생존 시스템 & HUD (High Priority)

### Core Features
- HUD component with 3 status bars (health, hunger, sanity)
- Automatic hunger decrease (1분마다 -5)
- Health damage when hunger = 0
- Sanity decrease at night outside base
- Visual effects for low sanity

### Files to Create
- `src/components/ui/HUD.jsx`
- `src/stores/gameStore.js` (day counter, time)
- `src/systems/SurvivalSystem.js`

---

## Phase 5: 낮/밤 사이클 (High Priority)

### Core Features
- 7분 주기 (낮 4분, 밤 3분)
- DirectionalLight intensity/color change
- Sky color transition
- Fog density change
- Day counter increment

### Files to Create/Modify
- `src/components/game/DayNight.jsx`
- Modify `World.jsx` to use dynamic lighting

---

## Phase 6: 몬스터 기본 (High Priority)

### Core Features
- 4 monster types: Snake, Monkey, Bear, FireAnt
- Basic AI: wander, chase player, attack
- Spawn system (daytime only, away from base)
- Health and damage stats

### Files to Create
- `src/components/game/monsters/Snake.jsx`
- `src/components/game/monsters/Monkey.jsx`
- `src/components/game/monsters/Bear.jsx`
- `src/components/game/monsters/FireAnt.jsx`
- `src/components/game/MonsterSpawner.jsx`
- `src/data/monsters.js`
- `src/systems/AISystem.js`

---

## Phase 7: 거대 지네 & 광신도 (Medium Priority)

### Core Features
- Giant Centipede (night only, unkillable, flees from base)
- Cultist (spawns in specific areas, attacks base during raids)

### Files to Create
- `src/components/game/monsters/GiantCentipede.jsx`
- `src/components/game/monsters/Cultist.jsx`

---

## Phase 8: 전투 시스템 (High Priority)

### Core Features
- 3 weapons: Knife (melee), Bow (ranged), Gun (ranged)
- Attack on left-click
- Projectiles for ranged weapons
- Damage calculation
- Monster death and drops

### Files to Create
- `src/components/game/Weapon.jsx`
- `src/components/game/Projectile.jsx`
- `src/systems/CombatSystem.js`
- `src/data/weapons.js`

---

## Phase 9: 인벤토리 & 제작 (High Priority)

### Core Features
- 24-slot inventory (4x6 grid)
- Resource collection (wood, stone, herbs, food)
- Crafting menu at base
- Recipes (torch, trap, barricade, bed, poison arrow)

### Files to Create
- `src/components/ui/Inventory.jsx`
- `src/components/ui/CraftingMenu.jsx`
- `src/components/game/Resource.jsx`
- `src/stores/inventoryStore.js`
- `src/systems/CraftingSystem.js`
- `src/data/items.js`
- `src/data/recipes.js`

---

## Phase 10: 이벤트 시스템 (Medium Priority)

### Core Features
- Cultist raid (every 3-6 days)
- Fire ant swarm (every 5 days)
- Lightning event (random, player must hide in building)

### Files to Create
- `src/systems/EventSystem.js`
- `src/components/game/events/CultistRaid.jsx`
- `src/components/game/events/AntSwarm.jsx`
- `src/components/game/events/Lightning.jsx`

---

## Phase 11: 보스 & 엔딩 (Medium Priority)

### Core Features
- Key system (10 keys from ant nests)
- Giant Fire Ant Boss (HP 1000, 3 attack patterns)
- 3 endings: Boss kill, TV hidden ending, 99 days survival

### Files to Create
- `src/components/game/monsters/BossAnt.jsx`
- `src/components/game/Altar.jsx`
- `src/components/game/Cave.jsx`
- `src/components/ui/EndingScreen.jsx`

---

## Phase 12: UI & 폴리싱 (Low Priority)

### Core Features
- Main menu
- Settings menu
- Game over screen
- BGM and sound effects (Howler.js)
- Save/load system (localStorage)

### Files to Create
- `src/components/ui/MainMenu.jsx`
- `src/components/ui/Settings.jsx`
- `src/components/ui/GameOver.jsx`
- `src/hooks/useAudio.js`
- `src/systems/SaveSystem.js`

---

## Phase 13: Vercel 배포 (Low Priority)

### Tasks
- Build optimization
- vercel.json configuration
- Environment variables
- Deploy to Vercel

---

## Implementation Strategy

**Priority Order:**
1. Phase 4 (HUD) - Essential for gameplay feedback
2. Phase 5 (Day/Night) - Core game mechanic
3. Phase 6 (Monsters) - Core gameplay loop
4. Phase 8 (Combat) - Player interaction
5. Phase 9 (Inventory) - Progression system
6. Phase 7, 10, 11 (Special features)
7. Phase 12, 13 (Polish & Deploy)

**Each Phase:**
- Create minimal viable implementation
- Test immediately
- Commit after verification
- Move to next phase

**Focus:** Get playable game loop working first (Phase 4-6, 8-9), then add special features.
