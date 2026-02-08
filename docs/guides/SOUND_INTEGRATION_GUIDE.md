# Sound Integration Guide

## Overview

All 19 sound files have been successfully downloaded and organized for Forest 99 Nights game:
- **16 SFX files** in `public/sounds/sfx/`
- **3 music tracks** in `public/sounds/music/`
- **Total size**: 11.4 MB
- **Format**: MP3 (192 Kbps, 44.1 kHz, 16-bit)

## Quick Integration

### Basic Implementation (React)

```javascript
import { useEffect, useRef } from 'react';

export function GameAudio() {
  const audioRefs = useRef({});

  useEffect(() => {
    // Pre-load all sounds
    const sounds = {
      // Attack sounds
      attackSwing: new Audio('/sounds/sfx/attack_swing.mp3'),
      attackHit: new Audio('/sounds/sfx/attack_hit.mp3'),

      // Player sounds
      playerHurt: new Audio('/sounds/sfx/player_hurt.mp3'),
      jump: new Audio('/sounds/sfx/jump.mp3'),
      land: new Audio('/sounds/sfx/land.mp3'),
      footstep: new Audio('/sounds/sfx/footstep.mp3'),

      // Resource sounds
      chopWood: new Audio('/sounds/sfx/chop_wood.mp3'),
      mineRock: new Audio('/sounds/sfx/mine_rock.mp3'),

      // UI sounds
      uiOpen: new Audio('/sounds/sfx/ui_open.mp3'),
      uiClose: new Audio('/sounds/sfx/ui_close.mp3'),
      uiClick: new Audio('/sounds/sfx/ui_click.mp3'),

      // Item sounds
      itemPickup: new Audio('/sounds/sfx/item_pickup.mp3'),
      craftComplete: new Audio('/sounds/sfx/craft_complete.mp3'),
      equip: new Audio('/sounds/sfx/equip.mp3'),

      // Monster sounds
      monsterGrowl: new Audio('/sounds/sfx/monster_growl.mp3'),
      monsterDeath: new Audio('/sounds/sfx/monster_death.mp3'),

      // Music
      dayTheme: new Audio('/sounds/music/day-theme.mp3'),
      nightTheme: new Audio('/sounds/music/night-theme.mp3'),
      bossTheme: new Audio('/sounds/music/boss-theme.mp3'),
    };

    // Set volume levels
    Object.values(sounds).forEach(audio => {
      audio.volume = 0.7; // Adjust as needed
    });

    // Enable looping for music
    sounds.dayTheme.loop = true;
    sounds.nightTheme.loop = true;
    sounds.bossTheme.loop = true;

    audioRefs.current = sounds;
  }, []);

  const playSound = (soundName) => {
    if (audioRefs.current[soundName]) {
      audioRefs.current[soundName].currentTime = 0;
      audioRefs.current[soundName].play().catch(e =>
        console.log('Audio playback failed:', e)
      );
    }
  };

  const playMusic = (musicName) => {
    // Stop all music
    ['dayTheme', 'nightTheme', 'bossTheme'].forEach(theme => {
      audioRefs.current[theme].pause();
      audioRefs.current[theme].currentTime = 0;
    });

    // Play selected music
    if (audioRefs.current[musicName]) {
      audioRefs.current[musicName].play().catch(e =>
        console.log('Music playback failed:', e)
      );
    }
  };

  return { playSound, playMusic };
}
```

### Integration with Zustand (Recommended for React)

```javascript
// stores/audioStore.js
import { create } from 'zustand';

export const useAudioStore = create((set) => ({
  sounds: {},
  volume: 0.7,
  musicVolume: 0.6,
  muted: false,

  initAudio: () => set((state) => ({
    sounds: {
      attackSwing: new Audio('/sounds/sfx/attack_swing.mp3'),
      attackHit: new Audio('/sounds/sfx/attack_hit.mp3'),
      playerHurt: new Audio('/sounds/sfx/player_hurt.mp3'),
      jump: new Audio('/sounds/sfx/jump.mp3'),
      land: new Audio('/sounds/sfx/land.mp3'),
      footstep: new Audio('/sounds/sfx/footstep.mp3'),
      chopWood: new Audio('/sounds/sfx/chop_wood.mp3'),
      mineRock: new Audio('/sounds/sfx/mine_rock.mp3'),
      uiOpen: new Audio('/sounds/sfx/ui_open.mp3'),
      uiClose: new Audio('/sounds/sfx/ui_close.mp3'),
      uiClick: new Audio('/sounds/sfx/ui_click.mp3'),
      itemPickup: new Audio('/sounds/sfx/item_pickup.mp3'),
      craftComplete: new Audio('/sounds/sfx/craft_complete.mp3'),
      equip: new Audio('/sounds/sfx/equip.mp3'),
      monsterGrowl: new Audio('/sounds/sfx/monster_growl.mp3'),
      monsterDeath: new Audio('/sounds/sfx/monster_death.mp3'),
      dayTheme: new Audio('/sounds/music/day-theme.mp3'),
      nightTheme: new Audio('/sounds/music/night-theme.mp3'),
      bossTheme: new Audio('/sounds/music/boss-theme.mp3'),
    }
  })),

  playSound: (soundName) => set((state) => {
    if (state.sounds[soundName] && !state.muted) {
      state.sounds[soundName].currentTime = 0;
      state.sounds[soundName].volume = state.volume;
      state.sounds[soundName].play().catch(e => console.log('Audio error:', e));
    }
    return state;
  }),

  playMusic: (musicName) => set((state) => {
    Object.keys(state.sounds)
      .filter(key => key.includes('Theme'))
      .forEach(key => {
        state.sounds[key].pause();
        state.sounds[key].currentTime = 0;
      });

    if (state.sounds[musicName] && !state.muted) {
      state.sounds[musicName].loop = true;
      state.sounds[musicName].volume = state.musicVolume;
      state.sounds[musicName].play().catch(e => console.log('Music error:', e));
    }
    return state;
  }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
}));
```

## File Reference

### Sound Effects (SFX) Files

#### Combat Sounds
- `attack_swing.mp3` - Play when player starts attacking
- `attack_hit.mp3` - Play on successful hit
- `player_hurt.mp3` - Play when player takes damage
- `equip.mp3` - Play when equipping weapon

#### Movement Sounds
- `footstep.mp3` - Play during walking (can loop)
- `jump.mp3` - Play on jump start
- `land.mp3` - Play on landing

#### Resource Gathering
- `chop_wood.mp3` - Play when chopping trees
- `mine_rock.mp3` - Play when mining stones

#### Inventory & UI
- `item_pickup.mp3` - Play when picking up items
- `craft_complete.mp3` - Play when crafting complete
- `ui_open.mp3` - Play when opening menu
- `ui_close.mp3` - Play when closing menu
- `ui_click.mp3` - Play on button click

#### Monster Sounds
- `monster_growl.mp3` - Play when monsters appear/attack
- `monster_death.mp3` - Play when monster dies

### Background Music Files

#### Day Theme
- `day-theme.mp3`
- Duration: 2:33
- Loopable: Yes
- Use: Daytime music, peaceful exploration

#### Night Theme
- `night-theme.mp3`
- Duration: 3:12
- Loopable: Yes
- Use: Nighttime music, ambient/tense

#### Boss Theme
- `boss-theme.mp3`
- Duration: 3:33
- Loopable: Yes
- Use: Boss battles, intense combat

## Audio Events Integration

### Recommended Event Points

```javascript
// In Player component
if (isAttacking) {
  playSound('attackSwing');
  // ... after hit detection
  playSound('attackHit');
}

if (isJumping) {
  playSound('jump');
}

if (isLanding) {
  playSound('land');
}

if (takingDamage) {
  playSound('playerHurt');
}

// In DayNight cycle
if (isDay) {
  playMusic('dayTheme');
} else if (isBoss) {
  playMusic('bossTheme');
} else {
  playMusic('nightTheme');
}

// In UI interactions
if (menuOpened) playSound('uiOpen');
if (menuClosed) playSound('uiClose');
if (buttonClicked) playSound('uiClick');

// In crafting
if (craftComplete) playSound('craftComplete');

// In resource gathering
if (chopAction) playSound('chopWood');
if (mineAction) playSound('mineRock');

// In inventory
if (itemPickedUp) playSound('itemPickup');
if (itemEquipped) playSound('equip');

// In monster interactions
if (monsterAppears) playSound('monsterGrowl');
if (monsterDies) playSound('monsterDeath');
```

## Volume Management

Recommended volume levels:
- **SFX Volume:** 0.6 - 0.8 (effects shouldn't overwhelm)
- **Music Volume:** 0.4 - 0.6 (background, won't interfere with SFX)
- **Overall Master:** 0.7 - 1.0

```javascript
// Example volume adjustment
const audioRefs = {
  // High volume effects
  attackHit: { volume: 0.8 },
  monsterDeath: { volume: 0.8 },

  // Medium volume effects
  attackSwing: { volume: 0.7 },
  jump: { volume: 0.6 },
  land: { volume: 0.6 },

  // Low volume effects
  footstep: { volume: 0.4 },
  uiClick: { volume: 0.5 },
  itemPickup: { volume: 0.5 },

  // Music (lower than SFX)
  dayTheme: { volume: 0.5 },
  nightTheme: { volume: 0.5 },
  bossTheme: { volume: 0.5 },
};
```

## Mobile Support Considerations

```javascript
// For mobile audio playback
const playAudioMobile = async (audio) => {
  try {
    // Handle iOS/Safari restrictions
    await audio.play();
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      // User hasn't interacted with page yet
      // Try again after user interaction
      console.log('Audio playback requires user interaction');
    }
  }
};

// Initialize audio with user gesture
document.addEventListener('click', () => {
  if (!audioInitialized) {
    initAudio();
    audioInitialized = true;
  }
});
```

## Performance Tips

1. **Pre-load Audio:** Load all sounds in components that mount first
2. **Use currentTime = 0:** Always reset position before playing
3. **Limit Concurrent Sounds:** Avoid playing too many sounds simultaneously
4. **Volume Normalization:** Keep consistent levels across all sounds
5. **Test on Devices:** Test audio on target devices (mobile, desktop)

## Troubleshooting

### Audio Not Playing
- Check browser console for CORS errors
- Verify file paths are correct
- Ensure audio elements have permission to play
- Check mobile device restrictions (iOS requires user interaction)

### Sound Quality Issues
- All files are 192 Kbps MP3 - quality should be consistent
- Check system volume is not muted
- Verify audio context is not suspended

### Music Not Looping
- Ensure `loop = true` is set before playing
- Some browsers require user interaction first
- Check browser console for playback errors

## License Requirements

**Source:** Orange Free Sounds (https://orangefreesounds.com/)
**License:** Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

If using commercially, contact Orange Free Sounds for proper licensing.

---

**Setup Complete!** The audio system is ready for integration into your React components.
