import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

const HUNGER_DECREASE_INTERVAL = 60;
const HUNGER_DECREASE_AMOUNT = 5;
const STARVATION_DAMAGE = 2;
const SANITY_DECREASE_RATE = 1;
const BASE_RADIUS = 10;

let lastHungerTime = 0;

export function updateSurvival(delta, playerPosition, eventSanityDrain = 0) {
  const { 
    hunger, 
    health,
    decreaseHunger, 
    damage,
    decreaseSanity 
  } = usePlayerStore.getState();
  
  const { isNight } = useGameStore.getState();
  
  lastHungerTime += delta;
  
  if (lastHungerTime >= HUNGER_DECREASE_INTERVAL) {
    lastHungerTime = 0;
    decreaseHunger(HUNGER_DECREASE_AMOUNT);
  }
  
  if (hunger <= 0) {
    damage(STARVATION_DAMAGE * delta);
  }
  
  let sanityDrain = 0;
  
  if (isNight) {
    const distFromBase = Math.sqrt(
      playerPosition[0] ** 2 + playerPosition[2] ** 2
    );
    
    if (distFromBase > BASE_RADIUS) {
      sanityDrain += SANITY_DECREASE_RATE;
    }
  }
  
  sanityDrain += eventSanityDrain;
  
  if (sanityDrain > 0) {
    decreaseSanity(sanityDrain * delta);
  }
}

export function resetSurvivalTimer() {
  lastHungerTime = 0;
}
