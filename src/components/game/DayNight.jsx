import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';
import { useEventStore } from '../../stores/eventStore';
import { COLORS, GAME_CONFIG } from '../../data/config';

const DAY_DURATION = GAME_CONFIG.dayDuration;
const NIGHT_DURATION = GAME_CONFIG.nightDuration;
const TOTAL_CYCLE = DAY_DURATION + NIGHT_DURATION;
const EVENT_CHECK_INTERVAL = 15;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(colorA, colorB, t) {
  const a = new THREE.Color(colorA);
  const b = new THREE.Color(colorB);
  return a.lerp(b, t);
}

export default function DayNight() {
  const directionalRef = useRef();
  const ambientRef = useRef();
  const { scene } = useThree();
  
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const day = useGameStore((state) => state.day);
  const setTimeOfDay = useGameStore((state) => state.setTimeOfDay);
  const setIsNight = useGameStore((state) => state.setIsNight);
  const incrementDay = useGameStore((state) => state.incrementDay);
  const isNight = useGameStore((state) => state.isNight);
  const isPaused = useGameStore((state) => state.isPaused);
  
  const updateEvent = useEventStore((state) => state.updateEvent);
  const tryTriggerEvent = useEventStore((state) => state.tryTriggerEvent);
  const currentEvent = useEventStore((state) => state.currentEvent);
  
  const wasNight = useRef(false);
  const lastEventCheck = useRef(0);
  
  useFrame((_, delta) => {
    if (isPaused) return;
    
    const newTime = (timeOfDay + delta) % TOTAL_CYCLE;
    setTimeOfDay(newTime);
    
    const currentIsNight = newTime >= DAY_DURATION;
    setIsNight(currentIsNight);
    
    if (wasNight.current && !currentIsNight) {
      incrementDay();
    }
    wasNight.current = currentIsNight;
    
    updateEvent(delta);
    
    lastEventCheck.current += delta;
    if (lastEventCheck.current >= EVENT_CHECK_INTERVAL && !currentEvent) {
      lastEventCheck.current = 0;
      tryTriggerEvent(day, isNight);
    }
    
    let lightIntensity, ambientIntensity, lightColor, skyColor, fogNear, fogFar;
    
    if (!currentIsNight) {
      const dayProgress = newTime / DAY_DURATION;
      
      if (dayProgress < 0.1) {
        const t = dayProgress / 0.1;
        lightIntensity = lerp(0.2, 1, t);
        ambientIntensity = lerp(0.1, 0.5, t);
        lightColor = lerpColor('#ff9966', '#ffffff', t);
        skyColor = lerpColor('#1a1a2e', COLORS.sky_day, t);
      } else if (dayProgress > 0.9) {
        const t = (dayProgress - 0.9) / 0.1;
        lightIntensity = lerp(1, 0.3, t);
        ambientIntensity = lerp(0.5, 0.1, t);
        lightColor = lerpColor('#ffffff', '#ff6633', t);
        skyColor = lerpColor(COLORS.sky_day, '#ff9966', t);
      } else {
        lightIntensity = 1;
        ambientIntensity = 0.5;
        lightColor = new THREE.Color('#ffffff');
        skyColor = new THREE.Color(COLORS.sky_day);
      }
      
      fogNear = 30;
      fogFar = 100;
    } else {
      lightIntensity = 0.2;
      ambientIntensity = 0.1;
      lightColor = new THREE.Color('#6666ff');
      skyColor = new THREE.Color(COLORS.sky_night);
      
      fogNear = 15;
      fogFar = 50;
    }
    
    if (directionalRef.current) {
      directionalRef.current.intensity = lightIntensity;
      directionalRef.current.color = lightColor;
    }
    
    if (ambientRef.current) {
      ambientRef.current.intensity = ambientIntensity;
    }
    
    scene.background = skyColor;
    
    if (scene.fog) {
      scene.fog.near = fogNear;
      scene.fog.far = fogFar;
      scene.fog.color = skyColor;
    }
  });
  
  return (
    <>
      <ambientLight ref={ambientRef} intensity={isNight ? 0.1 : 0.5} />
      <directionalLight
        ref={directionalRef}
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
}
