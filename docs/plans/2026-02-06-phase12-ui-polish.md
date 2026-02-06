# Phase 12: UI & 폴리싱 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 메인 메뉴, 설정, 게임 오버, 사운드, 저장/불러오기

**Architecture:** React 컴포넌트 + Howler.js + localStorage

**Tech Stack:** React, Howler.js, CSS

---

## Task 1: Howler.js 설치

**Files:**
- Modify: `package.json`

**Step 1: 패키지 설치**

```bash
npm install howler
```

**Step 2: Commit**

```bash
git add .
git commit -m "chore: add howler.js for audio"
```

---

## Task 2: 오디오 시스템

**Files:**
- Create: `src/hooks/useAudio.js`

**Step 1: useAudio.js 생성**

```javascript
import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useGameStore } from '../stores/gameStore';

const SOUNDS = {
  bgmDay: '/sounds/bgm-day.mp3',
  bgmNight: '/sounds/bgm-night.mp3',
  attack: '/sounds/attack.mp3',
  hit: '/sounds/hit.mp3',
  pickup: '/sounds/pickup.mp3',
  craft: '/sounds/craft.mp3',
};

export function useAudio() {
  const sounds = useRef({});
  const currentBgm = useRef(null);
  const isNight = useGameStore((state) => state.isNight);
  
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, src]) => {
      sounds.current[key] = new Howl({
        src: [src],
        loop: key.startsWith('bgm'),
        volume: key.startsWith('bgm') ? 0.3 : 0.5,
      });
    });
    
    return () => {
      Object.values(sounds.current).forEach((sound) => sound.unload());
    };
  }, []);
  
  useEffect(() => {
    const bgmKey = isNight ? 'bgmNight' : 'bgmDay';
    
    if (currentBgm.current && currentBgm.current !== bgmKey) {
      sounds.current[currentBgm.current]?.fade(0.3, 0, 1000);
      setTimeout(() => sounds.current[currentBgm.current]?.stop(), 1000);
    }
    
    if (sounds.current[bgmKey]) {
      sounds.current[bgmKey].play();
      sounds.current[bgmKey].fade(0, 0.3, 1000);
    }
    
    currentBgm.current = bgmKey;
  }, [isNight]);
  
  const playSound = (soundName) => {
    sounds.current[soundName]?.play();
  };
  
  return { playSound };
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add audio system with Howler.js"
```

---

## Task 3: 저장 시스템

**Files:**
- Create: `src/systems/SaveSystem.js`

**Step 1: SaveSystem.js 생성**

```javascript
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { useInventoryStore } from '../stores/inventoryStore';

const SAVE_KEY = 'forest99_save';
const AUTO_SAVE_INTERVAL = 60000;

export function saveGame() {
  const playerState = usePlayerStore.getState();
  const gameState = useGameStore.getState();
  const inventoryState = useInventoryStore.getState();
  
  const saveData = {
    player: {
      position: playerState.position,
      health: playerState.health,
      hunger: playerState.hunger,
      sanity: playerState.sanity,
      currentWeapon: playerState.currentWeapon,
    },
    game: {
      day: gameState.day,
      timeOfDay: gameState.timeOfDay,
    },
    inventory: {
      slots: inventoryState.slots,
    },
    savedAt: Date.now(),
  };
  
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  return true;
}

export function loadGame() {
  const saveData = localStorage.getItem(SAVE_KEY);
  if (!saveData) return false;
  
  try {
    const data = JSON.parse(saveData);
    
    const playerStore = usePlayerStore.getState();
    playerStore.setPosition(data.player.position);
    Object.assign(playerStore, {
      health: data.player.health,
      hunger: data.player.hunger,
      sanity: data.player.sanity,
      currentWeapon: data.player.currentWeapon,
    });
    
    const gameStore = useGameStore.getState();
    Object.assign(gameStore, {
      day: data.game.day,
      timeOfDay: data.game.timeOfDay,
    });
    
    const inventoryStore = useInventoryStore.getState();
    Object.assign(inventoryStore, {
      slots: data.inventory.slots,
    });
    
    return true;
  } catch (e) {
    console.error('Failed to load save:', e);
    return false;
  }
}

export function hasSaveData() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

let autoSaveInterval = null;

export function startAutoSave() {
  if (autoSaveInterval) return;
  
  autoSaveInterval = setInterval(() => {
    saveGame();
    console.log('Auto-saved');
  }, AUTO_SAVE_INTERVAL);
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add save/load system with localStorage"
```

---

## Task 4: 메인 메뉴

**Files:**
- Create: `src/components/ui/MainMenu.jsx`
- Create: `src/components/ui/MainMenu.css`

**Step 1: MainMenu.jsx 생성**

```jsx
import { useState } from 'react';
import { hasSaveData, loadGame, deleteSave } from '../../systems/SaveSystem';
import './MainMenu.css';

export default function MainMenu({ onStartGame }) {
  const [showSettings, setShowSettings] = useState(false);
  const hasExistingSave = hasSaveData();
  
  const handleNewGame = () => {
    if (hasExistingSave) {
      if (confirm('This will delete your existing save. Continue?')) {
        deleteSave();
        onStartGame(false);
      }
    } else {
      onStartGame(false);
    }
  };
  
  const handleContinue = () => {
    if (loadGame()) {
      onStartGame(true);
    }
  };
  
  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">숲에서 보낸 99일 밤</h1>
        <p className="game-subtitle">99 Nights in the Forest</p>
        
        <div className="menu-buttons">
          <button className="menu-button primary" onClick={handleNewGame}>
            New Game
          </button>
          
          {hasExistingSave && (
            <button className="menu-button" onClick={handleContinue}>
              Continue
            </button>
          )}
          
          <button 
            className="menu-button" 
            onClick={() => setShowSettings(true)}
          >
            Settings
          </button>
        </div>
        
        <div className="menu-footer">
          <p>WASD - Move | Space - Jump | Shift - Run</p>
          <p>Tab - Inventory | Q - Switch Weapon | Click - Attack</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: MainMenu.css 생성**

```css
.main-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.menu-container {
  text-align: center;
  color: white;
}

.game-title {
  font-size: 64px;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.game-subtitle {
  font-size: 24px;
  color: #888;
  margin-bottom: 50px;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 50px;
}

.menu-button {
  padding: 15px 50px;
  font-size: 20px;
  background: #333;
  color: white;
  border: 2px solid #555;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-button:hover {
  background: #444;
  border-color: #777;
}

.menu-button.primary {
  background: #4caf50;
  border-color: #66bb6a;
}

.menu-button.primary:hover {
  background: #388e3c;
}

.menu-footer {
  color: #666;
  font-size: 14px;
}

.menu-footer p {
  margin: 5px 0;
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add main menu UI"
```

---

## Task 5: 설정 메뉴

**Files:**
- Create: `src/components/ui/Settings.jsx`
- Create: `src/components/ui/Settings.css`

**Step 1: Settings.jsx 생성**

```jsx
import { useState, useEffect } from 'react';
import './Settings.css';

const DEFAULT_SETTINGS = {
  masterVolume: 0.5,
  musicVolume: 0.3,
  sfxVolume: 0.5,
  mouseSensitivity: 1,
};

export default function Settings({ isOpen, onClose }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  
  useEffect(() => {
    const saved = localStorage.getItem('forest99_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);
  
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('forest99_settings', JSON.stringify(newSettings));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <h2>Settings</h2>
        
        <div className="setting-item">
          <label>Master Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.masterVolume}
            onChange={(e) => updateSetting('masterVolume', parseFloat(e.target.value))}
          />
          <span>{Math.round(settings.masterVolume * 100)}%</span>
        </div>
        
        <div className="setting-item">
          <label>Music Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.musicVolume}
            onChange={(e) => updateSetting('musicVolume', parseFloat(e.target.value))}
          />
          <span>{Math.round(settings.musicVolume * 100)}%</span>
        </div>
        
        <div className="setting-item">
          <label>SFX Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.sfxVolume}
            onChange={(e) => updateSetting('sfxVolume', parseFloat(e.target.value))}
          />
          <span>{Math.round(settings.sfxVolume * 100)}%</span>
        </div>
        
        <div className="setting-item">
          <label>Mouse Sensitivity</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.mouseSensitivity}
            onChange={(e) => updateSetting('mouseSensitivity', parseFloat(e.target.value))}
          />
          <span>{settings.mouseSensitivity.toFixed(1)}x</span>
        </div>
        
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Settings.css 생성**

```css
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.settings-container {
  background: #2a2a2a;
  padding: 30px 40px;
  border-radius: 12px;
  color: white;
  min-width: 400px;
}

.settings-container h2 {
  margin: 0 0 25px 0;
  text-align: center;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.setting-item label {
  width: 150px;
}

.setting-item input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: #555;
  border-radius: 3px;
}

.setting-item input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #4caf50;
  border-radius: 50%;
  cursor: pointer;
}

.setting-item span {
  width: 50px;
  text-align: right;
}

.close-button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  font-size: 16px;
  background: #555;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.close-button:hover {
  background: #666;
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add settings menu"
```

---

## Task 6: 게임 오버 화면

**Files:**
- Create: `src/components/ui/GameOver.jsx`

**Step 1: GameOver.jsx 생성**

```jsx
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';

export default function GameOver({ onRestart, onMainMenu }) {
  const day = useGameStore((state) => state.day);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '64px', color: '#f44336', marginBottom: '20px' }}>
          GAME OVER
        </h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>
          You survived {day} day{day !== 1 ? 's' : ''}
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={onRestart}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          <button
            onClick={onMainMenu}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              background: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add game over screen"
```

---

## Phase 12 완료 체크리스트

- [ ] 메인 메뉴 (타이틀, 새 게임, 이어하기, 설정)
- [ ] 설정 메뉴 (볼륨 조절)
- [ ] 게임 오버 화면
- [ ] BGM (낮/밤 다르게)
- [ ] 효과음 (공격, 피격, UI)
- [ ] 자동 저장 (1분마다)
- [ ] 저장/불러오기 작동

---

## 다음 Phase

Phase 12 완료 후 → Phase 13 (Vercel 배포) 진행
