import { getTerrainHeight } from '../utils/noise';

export const AI_STATES = {
  IDLE: 'idle',
  WANDER: 'wander',
  CHASE: 'chase',
  ATTACK: 'attack',
  FLEE: 'flee',
};

export function getDistanceToPlayer(monsterPos, playerPos) {
  const dx = monsterPos[0] - playerPos[0];
  const dz = monsterPos[2] - playerPos[2];
  return Math.sqrt(dx * dx + dz * dz);
}

export function getDirectionToPlayer(monsterPos, playerPos) {
  const dx = playerPos[0] - monsterPos[0];
  const dz = playerPos[2] - monsterPos[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  if (length === 0) return [0, 0];
  return [dx / length, dz / length];
}

export function updateMonsterAI(monster, playerPos, delta) {
  const { position, stats, state, wanderTarget } = monster;
  const distance = getDistanceToPlayer(position, playerPos);
  
  let newState = state;
  let newPosition = [...position];
  let newWanderTarget = wanderTarget;
  
  if (distance <= stats.attackRange) {
    newState = AI_STATES.ATTACK;
  } else if (distance <= stats.detectionRange) {
    newState = AI_STATES.CHASE;
  } else if (state === AI_STATES.CHASE) {
    newState = AI_STATES.WANDER;
  }
  
  switch (newState) {
    case AI_STATES.WANDER: {
      if (!newWanderTarget || Math.random() < 0.01) {
        newWanderTarget = [
          position[0] + (Math.random() - 0.5) * 20,
          position[2] + (Math.random() - 0.5) * 20,
        ];
      }
      
      const [dx, dz] = [
        newWanderTarget[0] - position[0],
        newWanderTarget[1] - position[2],
      ];
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist > 1) {
        newPosition[0] += (dx / dist) * stats.speed * 0.5 * delta;
        newPosition[2] += (dz / dist) * stats.speed * 0.5 * delta;
      }
      break;
    }
    
    case AI_STATES.CHASE: {
      const [dx, dz] = getDirectionToPlayer(position, playerPos);
      newPosition[0] += dx * stats.speed * delta;
      newPosition[2] += dz * stats.speed * delta;
      break;
    }
    
    case AI_STATES.ATTACK: {
      break;
    }
  }
  
  newPosition[1] = getTerrainHeight(newPosition[0], newPosition[2]);
  
  return {
    ...monster,
    position: newPosition,
    state: newState,
    wanderTarget: newWanderTarget,
  };
}

export function updateCentipedeAI(centipede, playerPos, delta) {
  const { position, speed } = centipede;
  const BASE_RADIUS = 15;
  
  const distFromBase = Math.sqrt(position[0] ** 2 + position[2] ** 2);
  
  if (distFromBase < BASE_RADIUS) {
    const fleeDir = [
      position[0] / distFromBase,
      position[2] / distFromBase,
    ];
    const newX = position[0] + fleeDir[0] * speed * delta;
    const newZ = position[2] + fleeDir[1] * speed * delta;
    return {
      ...centipede,
      position: [newX, getTerrainHeight(newX, newZ), newZ],
      state: AI_STATES.FLEE,
    };
  }
  
  if (!centipede.wanderTarget || Math.random() < 0.005) {
    centipede.wanderTarget = [
      position[0] + (Math.random() - 0.5) * 30,
      position[2] + (Math.random() - 0.5) * 30,
    ];
  }
  
  const [dx, dz] = [
    centipede.wanderTarget[0] - position[0],
    centipede.wanderTarget[1] - position[2],
  ];
  const dist = Math.sqrt(dx * dx + dz * dz);
  
  if (dist > 1) {
    const newX = position[0] + (dx / dist) * speed * delta;
    const newZ = position[2] + (dz / dist) * speed * delta;
    return {
      ...centipede,
      position: [newX, getTerrainHeight(newX, newZ), newZ],
      state: AI_STATES.WANDER,
    };
  }
  
  return centipede;
}

export const BOSS_STATES = {
  IDLE: 'idle',
  CHASE: 'chase',
  ATTACK: 'attack',
  WINDUP: 'windup',
  SUMMON: 'summon',
  RAGE: 'rage',
};

export function getBossPhase(hpPercent) {
  if (hpPercent <= 0.3) return 3;
  if (hpPercent <= 0.6) return 2;
  return 1;
}

export function updateBossAI(boss, playerPos, delta) {
  const { position, speed, attackCooldown, state, currentAttack, windupTimer, summonCooldown, rageCooldown, isRaging } = boss;
  const distance = getDistanceToPlayer(position, playerPos);
  
  let newState = state || BOSS_STATES.IDLE;
  let newPosition = [...position];
  let newAttackCooldown = Math.max(0, (attackCooldown || 0) - delta);
  let newWindupTimer = windupTimer || 0;
  let newCurrentAttack = currentAttack;
  let newSummonCooldown = Math.max(0, (summonCooldown || 0) - delta);
  let newRageCooldown = Math.max(0, (rageCooldown || 0) - delta);
  let shouldAttack = false;
  let shouldSummon = false;
  let shouldRage = false;
  
  const phase = getBossPhase(boss.hpPercent || 1);
  const baseSpeed = speed * (phase === 3 ? 1.5 : phase === 2 ? 1.25 : 1);
  const attackRange = 5;
  const attackInterval = phase === 3 ? 1 : phase === 2 ? 1.5 : 2;
  
  if (newState === BOSS_STATES.WINDUP) {
    newWindupTimer -= delta;
    if (newWindupTimer <= 0) {
      shouldAttack = true;
      newState = BOSS_STATES.ATTACK;
      newAttackCooldown = attackInterval;
    }
  } else if (newState === BOSS_STATES.ATTACK) {
    newState = BOSS_STATES.CHASE;
    newCurrentAttack = null;
  } else if (distance <= attackRange && newAttackCooldown <= 0) {
    const attacks = ['slam'];
    if (phase >= 2) attacks.push('rootStrike');
    newCurrentAttack = attacks[Math.floor(Math.random() * attacks.length)];
    newWindupTimer = newCurrentAttack === 'slam' ? 0.8 : 1.2;
    newState = BOSS_STATES.WINDUP;
  } else {
    newState = BOSS_STATES.CHASE;
    const [dx, dz] = getDirectionToPlayer(position, playerPos);
    const moveSpeed = isRaging ? baseSpeed * 1.5 : baseSpeed;
    newPosition[0] += dx * moveSpeed * delta;
    newPosition[2] += dz * moveSpeed * delta;
  }
  
  if (phase >= 2 && newSummonCooldown <= 0 && Math.random() < 0.01) {
    shouldSummon = true;
    newSummonCooldown = 15;
  }
  
  if (phase === 3 && newRageCooldown <= 0 && !isRaging && Math.random() < 0.005) {
    shouldRage = true;
    newRageCooldown = 20;
  }
  
  newPosition[1] = getTerrainHeight(newPosition[0], newPosition[2]);
  
  return {
    ...boss,
    position: newPosition,
    state: newState,
    attackCooldown: newAttackCooldown,
    windupTimer: newWindupTimer,
    currentAttack: newCurrentAttack,
    summonCooldown: newSummonCooldown,
    rageCooldown: newRageCooldown,
    phase,
    shouldAttack,
    shouldSummon,
    shouldRage,
    isAttacking: newState === BOSS_STATES.WINDUP || newState === BOSS_STATES.ATTACK,
  };
}
