export const EVENT_TYPES = {
  STORM: 'storm',
  MONSTER_WAVE: 'monsterWave',
  BLOOD_MOON: 'bloodMoon',
  RESOURCE_BLOOM: 'resourceBloom',
  FOG: 'fog',
  EARTHQUAKE: 'earthquake',
  FULL_MOON: 'fullMoon',
  FOREST_BLESSING: 'forestBlessing',
  SHADOW_FOG: 'shadowFog',
};

export const EVENTS = {
  [EVENT_TYPES.STORM]: {
    id: EVENT_TYPES.STORM,
    name: '폭풍',
    description: '강한 바람이 불어옵니다. 이동 속도가 감소합니다.',
    icon: '🌪️',
    duration: 30,
    effects: {
      moveSpeedMultiplier: 0.6,
      visibilityRange: 20,
      sanityDrain: 2,
    },
    minDay: 3,
    chance: 0.15,
  },
  [EVENT_TYPES.MONSTER_WAVE]: {
    id: EVENT_TYPES.MONSTER_WAVE,
    name: '몬스터 습격',
    description: '대규모 몬스터가 습격해옵니다!',
    icon: '💀',
    duration: 45,
    effects: {
      monsterSpawnMultiplier: 3,
      monsterAggroRange: 1.5,
    },
    minDay: 5,
    chance: 0.12,
  },
  [EVENT_TYPES.BLOOD_MOON]: {
    id: EVENT_TYPES.BLOOD_MOON,
    name: '핏빛 달',
    description: '달이 붉게 물들었습니다. 몬스터가 강해집니다.',
    icon: '🌑',
    duration: 60,
    effects: {
      monsterDamageMultiplier: 1.5,
      monsterSpeedMultiplier: 1.3,
      sanityDrain: 3,
    },
    minDay: 7,
    chance: 0.1,
    nightOnly: true,
  },
  [EVENT_TYPES.RESOURCE_BLOOM]: {
    id: EVENT_TYPES.RESOURCE_BLOOM,
    name: '자원 풍요',
    description: '자연이 풍요로워졌습니다. 자원 수집량이 증가합니다.',
    icon: '🌸',
    duration: 40,
    effects: {
      resourceMultiplier: 2,
      harvestCooldownMultiplier: 0.5,
    },
    minDay: 2,
    chance: 0.1,
  },
  [EVENT_TYPES.FOG]: {
    id: EVENT_TYPES.FOG,
    name: '짙은 안개',
    description: '시야가 매우 제한됩니다.',
    icon: '🌫️',
    duration: 25,
    effects: {
      visibilityRange: 10,
      monsterDetectionRange: 0.5,
    },
    minDay: 1,
    chance: 0.18,
  },
  [EVENT_TYPES.EARTHQUAKE]: {
    id: EVENT_TYPES.EARTHQUAKE,
    name: '지진',
    description: '땅이 흔들립니다! 잠시 후 추가 자원이 드러납니다.',
    icon: '🌋',
    duration: 15,
    effects: {
      cameraShake: 0.1,
      bonusResources: true,
    },
    minDay: 10,
    chance: 0.08,
  },
  [EVENT_TYPES.FULL_MOON]: {
    id: EVENT_TYPES.FULL_MOON,
    name: '보름달',
    description: '밝은 보름달이 떴습니다. 몬스터가 강해지지만 드롭률이 증가합니다.',
    icon: '🌕',
    duration: 60,
    effects: {
      monsterDamageMultiplier: 1.3,
      monsterHpMultiplier: 1.2,
      dropRateMultiplier: 2.0,
      visibilityRange: 40,
    },
    minDay: 15,
    chance: 0.1,
    nightOnly: true,
  },
  [EVENT_TYPES.FOREST_BLESSING]: {
    id: EVENT_TYPES.FOREST_BLESSING,
    name: '숲의 축복',
    description: '숲의 정령이 축복을 내립니다. 자원이 빠르게 재생됩니다.',
    icon: '🌿',
    duration: 60,
    effects: {
      resourceMultiplier: 2.0,
      resourceRegenMultiplier: 2.0,
      sanityRegenMultiplier: 1.5,
    },
    minDay: 10,
    chance: 0.08,
  },
  [EVENT_TYPES.SHADOW_FOG]: {
    id: EVENT_TYPES.SHADOW_FOG,
    name: '안개 속 그림자',
    description: '짙은 안개 속에서 무언가 다가옵니다...',
    icon: '👁️',
    duration: 30,
    effects: {
      visibilityRange: 8,
      spawnMiniBoss: true,
      sanityDrain: 4,
    },
    minDay: 25,
    chance: 0.06,
    nightOnly: true,
  },
};

export const getAvailableEvents = (day, isNight) => {
  return Object.values(EVENTS).filter(event => {
    if (day < event.minDay) return false;
    if (event.nightOnly && !isNight) return false;
    return true;
  });
};

export const rollForEvent = (day, isNight) => {
  const availableEvents = getAvailableEvents(day, isNight);
  
  for (const event of availableEvents) {
    if (Math.random() < event.chance) {
      return event;
    }
  }
  
  return null;
};
