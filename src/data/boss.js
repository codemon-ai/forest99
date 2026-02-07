export const BOSS_PHASES = {
  PHASE_1: 1,
  PHASE_2: 2,
  PHASE_3: 3,
};

export const BOSS_ATTACKS = {
  SLAM: 'slam',
  ROOT_STRIKE: 'rootStrike',
  SUMMON: 'summon',
  RAGE: 'rage',
};

export const FOREST_GUARDIAN = {
  phases: {
    [BOSS_PHASES.PHASE_1]: {
      hpThreshold: 1.0,
      attacks: [BOSS_ATTACKS.SLAM, BOSS_ATTACKS.ROOT_STRIKE],
      attackCooldown: 2,
      moveSpeed: 2,
    },
    [BOSS_PHASES.PHASE_2]: {
      hpThreshold: 0.6,
      attacks: [BOSS_ATTACKS.SLAM, BOSS_ATTACKS.ROOT_STRIKE, BOSS_ATTACKS.SUMMON],
      attackCooldown: 1.5,
      moveSpeed: 2.5,
    },
    [BOSS_PHASES.PHASE_3]: {
      hpThreshold: 0.3,
      attacks: [BOSS_ATTACKS.SLAM, BOSS_ATTACKS.ROOT_STRIKE, BOSS_ATTACKS.SUMMON, BOSS_ATTACKS.RAGE],
      attackCooldown: 1,
      moveSpeed: 3,
    },
  },
  attackData: {
    [BOSS_ATTACKS.SLAM]: {
      damage: 50,
      range: 6,
      windupTime: 0.8,
    },
    [BOSS_ATTACKS.ROOT_STRIKE]: {
      damage: 30,
      range: 12,
      windupTime: 1.2,
    },
    [BOSS_ATTACKS.SUMMON]: {
      summonCount: 3,
      cooldown: 10,
    },
    [BOSS_ATTACKS.RAGE]: {
      damageMultiplier: 1.5,
      speedMultiplier: 1.5,
      duration: 5,
    },
  },
};
