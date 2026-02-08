export const ACHIEVEMENTS = {
  // 생존
  SURVIVE_7_DAYS: {
    id: 'survive_7_days',
    name: '일주일 생존',
    description: '7일 동안 생존하세요',
    icon: '📅',
    condition: (stats) => stats.daysSurvived >= 7,
  },
  SURVIVE_30_DAYS: {
    id: 'survive_30_days',
    name: '한 달 생존',
    description: '30일 동안 생존하세요',
    icon: '🗓️',
    condition: (stats) => stats.daysSurvived >= 30,
  },
  SURVIVE_99_DAYS: {
    id: 'survive_99_days',
    name: '99일의 밤',
    description: '99일 동안 생존하세요',
    icon: '🏆',
    condition: (stats) => stats.daysSurvived >= 99,
  },

  // 전투
  FIRST_KILL: {
    id: 'first_kill',
    name: '첫 사냥',
    description: '몬스터를 처음으로 처치하세요',
    icon: '⚔️',
    condition: (stats) => stats.monstersKilled >= 1,
  },
  MONSTER_HUNTER: {
    id: 'monster_hunter',
    name: '몬스터 헌터',
    description: '몬스터 50마리를 처치하세요',
    icon: '🗡️',
    condition: (stats) => stats.monstersKilled >= 50,
  },
  BOSS_SLAYER: {
    id: 'boss_slayer',
    name: '숲의 해방자',
    description: '숲의 수호자를 물리치세요',
    icon: '👑',
    condition: (stats) => stats.bossDefeated,
  },

  // 제작
  FIRST_CRAFT: {
    id: 'first_craft',
    name: '장인의 시작',
    description: '아이템을 처음으로 제작하세요',
    icon: '🔨',
    condition: (stats) => stats.itemsCrafted >= 1,
  },
  MASTER_CRAFTER: {
    id: 'master_crafter',
    name: '마스터 장인',
    description: '아이템 20개를 제작하세요',
    icon: '⚒️',
    condition: (stats) => stats.itemsCrafted >= 20,
  },

  // 수집
  GATHERER: {
    id: 'gatherer',
    name: '수집가',
    description: '자원 100개를 수집하세요',
    icon: '🌲',
    condition: (stats) => stats.resourcesGathered >= 100,
  },

  // 특별
  NIGHT_OWL: {
    id: 'night_owl',
    name: '야행성',
    description: '밤에 10마리의 몬스터를 처치하세요',
    icon: '🦉',
    condition: (stats) => stats.nightKills >= 10,
  },
  COMBO_MASTER: {
    id: 'combo_master',
    name: '콤보 마스터',
    description: '5콤보를 달성하세요',
    icon: '💥',
    condition: (stats) => stats.maxCombo >= 5,
  },
  SURVIVOR: {
    id: 'survivor',
    name: '불굴의 의지',
    description: 'HP 10% 이하에서 생존하세요',
    icon: '💪',
    condition: (stats) => stats.survivedLowHealth,
  },
};
