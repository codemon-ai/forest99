import { Howl } from 'howler';
import { useAudioStore } from '../stores/audioStore';

const SOUNDS = {
  attack_swing: { src: '/sounds/sfx/attack_swing.mp3', volume: 0.6, duration: 300 },
  attack_hit: { src: '/sounds/sfx/attack_hit.mp3', volume: 0.7, duration: 200 },
  player_hurt: { src: '/sounds/sfx/player_hurt.mp3', volume: 0.8, duration: 500 },
  monster_growl: { src: '/sounds/sfx/monster_growl.mp3', volume: 0.5, duration: 800 },
  monster_death: { src: '/sounds/sfx/monster_death.mp3', volume: 0.7, duration: 600 },
  chop_wood: { src: '/sounds/sfx/chop_wood.mp3', volume: 0.9, duration: 600 },
  mine_rock: { src: '/sounds/sfx/mine_rock.mp3', volume: 0.9, duration: 600 },
  item_pickup: { src: '/sounds/sfx/item_pickup.mp3', volume: 0.4, duration: 400 },
  ui_open: { src: '/sounds/sfx/ui_open.mp3', volume: 0.4, duration: 200 },
  ui_close: { src: '/sounds/sfx/ui_close.mp3', volume: 0.4, duration: 200 },
  ui_click: { src: '/sounds/sfx/ui_click.mp3', volume: 0.3, duration: 100 },
  craft_complete: { src: '/sounds/sfx/craft_complete.mp3', volume: 0.6, duration: 500 },
  footstep: { src: '/sounds/sfx/footstep.mp3', volume: 0.2, duration: 200 },
  jump: { src: '/sounds/sfx/jump.mp3', volume: 0.4, duration: 300 },
  land: { src: '/sounds/sfx/land.mp3', volume: 0.3, duration: 200 },
  equip: { src: '/sounds/sfx/equip.mp3', volume: 0.5, duration: 300 },
};

class SoundManagerClass {
  constructor() {
    this.sounds = {};
    this.loaded = false;
    this.loadAttempted = {};
    this.playingTimeouts = new Map();
  }
  
  init() {
    if (this.loaded) return;
    
    Object.entries(SOUNDS).forEach(([key, config]) => {
      this.loadSound(key, config);
    });
    
    this.loaded = true;
  }
  
  loadSound(key, config) {
    if (this.loadAttempted[key]) return;
    this.loadAttempted[key] = true;
    
    try {
      this.sounds[key] = new Howl({
        src: [config.src],
        volume: config.volume,
        preload: true,
        onloaderror: () => {
          delete this.sounds[key];
        },
      });
    } catch (e) {
    }
  }
  
  play(soundName, volumeMultiplier = 1, durationOverride = null) {
    const sound = this.sounds[soundName];
    if (!sound) return;
    
    const effectiveVolume = useAudioStore.getState().getEffectiveVolume('sfx');
    if (effectiveVolume === 0) return;
    
    const baseVolume = SOUNDS[soundName]?.volume || 0.5;
    sound.volume(baseVolume * effectiveVolume * volumeMultiplier);
    
    const soundId = sound.play();
    
    const duration = durationOverride ?? SOUNDS[soundName]?.duration;
    if (duration && soundId !== false) {
      const timeoutId = setTimeout(() => {
        sound.stop(soundId);
        this.playingTimeouts.delete(soundId);
      }, duration);
      this.playingTimeouts.set(soundId, timeoutId);
    }
    
    return soundId;
  }
  
  stop(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.stop();
      // Clear any pending timeouts for this sound
      this.playingTimeouts.forEach((timeoutId, soundId) => {
        clearTimeout(timeoutId);
        this.playingTimeouts.delete(soundId);
      });
    }
  }
  
  stopAll() {
    Object.values(this.sounds).forEach(sound => sound.stop());
    this.playingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.playingTimeouts.clear();
  }
}

export const SoundManager = new SoundManagerClass();

export function playSound(soundName, volumeMultiplier = 1, duration = null) {
  return SoundManager.play(soundName, volumeMultiplier, duration);
}

export function initSounds() {
  SoundManager.init();
}
