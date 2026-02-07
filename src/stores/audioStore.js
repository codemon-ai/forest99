import { create } from 'zustand';

const STORAGE_KEY = 'forest99_audio_settings';

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return { masterVolume: 0.7, sfxVolume: 0.8, musicVolume: 0.5, muted: false };
};

export const useAudioStore = create((set, get) => ({
  ...loadSettings(),
  
  setMasterVolume: (volume) => {
    set({ masterVolume: volume });
    get().saveSettings();
  },
  
  setSfxVolume: (volume) => {
    set({ sfxVolume: volume });
    get().saveSettings();
  },
  
  setMusicVolume: (volume) => {
    set({ musicVolume: volume });
    get().saveSettings();
  },
  
  toggleMute: () => {
    set((state) => ({ muted: !state.muted }));
    get().saveSettings();
  },
  
  getEffectiveVolume: (type = 'sfx') => {
    const state = get();
    if (state.muted) return 0;
    const typeVolume = type === 'music' ? state.musicVolume : state.sfxVolume;
    return state.masterVolume * typeVolume;
  },
  
  saveSettings: () => {
    const { masterVolume, sfxVolume, musicVolume, muted } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      masterVolume, sfxVolume, musicVolume, muted
    }));
  },
}));
