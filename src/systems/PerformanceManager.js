import { create } from 'zustand';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);

const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = navigator.deviceMemory || 4;
  return hardwareConcurrency <= 4 || deviceMemory <= 4;
};

export const QUALITY_PRESETS = {
  LOW: {
    shadowMapSize: 512,
    maxMonsters: 10,
    particleMultiplier: 0.3,
    lodDistances: [10, 20, 40],
    postProcessing: false,
    drawDistance: 50,
    treeDensity: 0.5,
    rockDensity: 0.5,
  },
  MEDIUM: {
    shadowMapSize: 1024,
    maxMonsters: 20,
    particleMultiplier: 0.6,
    lodDistances: [15, 30, 60],
    postProcessing: true,
    drawDistance: 80,
    treeDensity: 0.75,
    rockDensity: 0.75,
  },
  HIGH: {
    shadowMapSize: 2048,
    maxMonsters: 30,
    particleMultiplier: 1.0,
    lodDistances: [20, 40, 80],
    postProcessing: true,
    drawDistance: 100,
    treeDensity: 1.0,
    rockDensity: 1.0,
  },
};

const getDefaultQuality = () => {
  if (isMobile || isLowEndDevice()) return 'LOW';
  return 'HIGH';
};

export const usePerformanceStore = create((set, get) => ({
  quality: getDefaultQuality(),
  settings: QUALITY_PRESETS[getDefaultQuality()],
  fps: 60,
  frameTimeHistory: [],
  autoAdjust: true,
  
  setQuality: (quality) => {
    const settings = QUALITY_PRESETS[quality] || QUALITY_PRESETS.MEDIUM;
    set({ quality, settings });
    localStorage.setItem('forest99_quality', quality);
  },
  
  loadSavedQuality: () => {
    const saved = localStorage.getItem('forest99_quality');
    if (saved && QUALITY_PRESETS[saved]) {
      set({ quality: saved, settings: QUALITY_PRESETS[saved] });
    }
  },
  
  updateFps: (frameTime) => {
    const state = get();
    const history = [...state.frameTimeHistory, frameTime].slice(-60);
    const avgFrameTime = history.reduce((a, b) => a + b, 0) / history.length;
    const fps = Math.round(1000 / avgFrameTime);
    
    set({ fps, frameTimeHistory: history });
    
    if (state.autoAdjust && history.length >= 60) {
      if (fps < 25 && state.quality !== 'LOW') {
        const qualities = ['HIGH', 'MEDIUM', 'LOW'];
        const currentIdx = qualities.indexOf(state.quality);
        if (currentIdx < qualities.length - 1) {
          get().setQuality(qualities[currentIdx + 1]);
        }
      } else if (fps > 55 && state.quality !== 'HIGH') {
        const qualities = ['LOW', 'MEDIUM', 'HIGH'];
        const currentIdx = qualities.indexOf(state.quality);
        if (currentIdx < qualities.length - 1) {
          get().setQuality(qualities[currentIdx + 1]);
        }
      }
    }
  },
  
  setAutoAdjust: (enabled) => set({ autoAdjust: enabled }),
}));

export const calculateLOD = (distance, lodDistances) => {
  if (distance < lodDistances[0]) return 0;
  if (distance < lodDistances[1]) return 1;
  if (distance < lodDistances[2]) return 2;
  return 3;
};

export const shouldRender = (distance, drawDistance) => {
  return distance <= drawDistance;
};
