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
    return {
      ...centipede,
      position: [
        position[0] + fleeDir[0] * speed * delta,
        position[1],
        position[2] + fleeDir[1] * speed * delta,
      ],
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
    return {
      ...centipede,
      position: [
        position[0] + (dx / dist) * speed * delta,
        position[1],
        position[2] + (dz / dist) * speed * delta,
      ],
      state: AI_STATES.WANDER,
    };
  }
  
  return centipede;
}
