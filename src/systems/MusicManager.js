import { Howl } from 'howler';
import { useGameStore, GAME_STATE } from '../stores/gameStore';
import { useAudioStore } from '../stores/audioStore';

const MUSIC_TRACKS = {
  day: { src: '/sounds/music/day-theme.mp3', baseVolume: 0.4 },
  night: { src: '/sounds/music/night-theme.mp3', baseVolume: 0.5 },
  boss: { src: '/sounds/music/boss-theme.mp3', baseVolume: 0.7 },
};

class MusicManagerClass {
  constructor() {
    this.tracks = {};
    this.currentTrack = null;
    this.fadeInterval = null;
    this.initialized = false;
    this.unsubscribeGame = null;
    this.unsubscribeAudio = null;
  }

  init() {
    if (this.initialized) return;
    
    Object.entries(MUSIC_TRACKS).forEach(([key, config]) => {
      try {
        this.tracks[key] = new Howl({
          src: [config.src],
          volume: 0,
          loop: true,
          preload: true,
          html5: true,
          onloaderror: () => {
            delete this.tracks[key];
          },
        });
      } catch (e) {
      }
    });
    
    this.unsubscribeGame = useGameStore.subscribe(
      (state) => ({
        gameState: state.gameState,
        isNight: state.isNight,
        bossSpawned: state.bossSpawned,
      }),
      (current, previous) => {
        this.handleStateChange(current, previous);
      }
    );
    
    this.unsubscribeAudio = useAudioStore.subscribe(
      (state) => state.getEffectiveVolume('music'),
      (volume) => {
        this.updateVolume(volume);
      }
    );
    
    this.initialized = true;
  }

  handleStateChange(current, previous) {
    const { gameState, isNight, bossSpawned } = current;
    
    switch (gameState) {
      case GAME_STATE.MENU:
        this.stopAll();
        break;
        
      case GAME_STATE.PLAYING:
        if (!bossSpawned) {
          this.crossfadeTo(isNight ? 'night' : 'day');
        }
        break;
        
      case GAME_STATE.BOSS_FIGHT:
        this.crossfadeTo('boss');
        break;
        
      case GAME_STATE.PAUSED:
        this.pauseCurrentTrack();
        break;
        
      case GAME_STATE.VICTORY:
        this.crossfadeTo('day');
        break;
        
      case GAME_STATE.GAME_OVER:
        this.fadeOutAndStop();
        break;
    }
    
    if (previous?.gameState === GAME_STATE.PAUSED && 
        gameState !== GAME_STATE.PAUSED) {
      this.resumeCurrentTrack();
    }
  }

  crossfadeTo(trackName, duration = 2000) {
    if (this.currentTrack === trackName) return;
    
    const newTrack = this.tracks[trackName];
    if (!newTrack) return;
    
    const oldTrackName = this.currentTrack;
    const oldTrack = this.tracks[oldTrackName];
    
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    const effectiveVolume = useAudioStore.getState().getEffectiveVolume('music');
    const targetVolume = MUSIC_TRACKS[trackName].baseVolume * effectiveVolume;
    
    newTrack.volume(0);
    newTrack.play();
    
    const steps = 20;
    const stepTime = duration / steps;
    let step = 0;
    
    this.fadeInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      
      newTrack.volume(targetVolume * progress);
      
      if (oldTrack) {
        const oldBaseVolume = MUSIC_TRACKS[oldTrackName]?.baseVolume || 0.5;
        oldTrack.volume(oldBaseVolume * effectiveVolume * (1 - progress));
      }
      
      if (step >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (oldTrack) oldTrack.stop();
      }
    }, stepTime);
    
    this.currentTrack = trackName;
  }

  pauseCurrentTrack() {
    if (this.currentTrack && this.tracks[this.currentTrack]) {
      this.tracks[this.currentTrack].pause();
    }
  }

  resumeCurrentTrack() {
    if (this.currentTrack && this.tracks[this.currentTrack]) {
      this.tracks[this.currentTrack].play();
    }
  }

  fadeOutAndStop(duration = 1500) {
    if (!this.currentTrack) return;
    
    const track = this.tracks[this.currentTrack];
    if (!track) return;
    
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    const startVolume = track.volume();
    const steps = 15;
    const stepTime = duration / steps;
    let step = 0;
    
    this.fadeInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      track.volume(startVolume * (1 - progress));
      
      if (step >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        track.stop();
        this.currentTrack = null;
      }
    }, stepTime);
  }

  stopAll() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    Object.values(this.tracks).forEach(track => track.stop());
    this.currentTrack = null;
  }

  updateVolume(effectiveVolume) {
    if (!this.currentTrack) return;
    
    const track = this.tracks[this.currentTrack];
    const baseVolume = MUSIC_TRACKS[this.currentTrack].baseVolume;
    track.volume(baseVolume * effectiveVolume);
  }

  destroy() {
    this.stopAll();
    if (this.unsubscribeGame) this.unsubscribeGame();
    if (this.unsubscribeAudio) this.unsubscribeAudio();
    Object.values(this.tracks).forEach(track => track.unload());
  }
}

export const MusicManager = new MusicManagerClass();

export function initMusic() {
  MusicManager.init();
}
