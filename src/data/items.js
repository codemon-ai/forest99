export const ITEM_TYPES = {
  MATERIAL: 'material',
  WEAPON: 'weapon',
  CONSUMABLE: 'consumable',
  TOOL: 'tool',
};

export const ITEMS = {
  BRANCH: {
    id: 'BRANCH',
    name: '나뭇가지',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 20,
    icon: '🪵',
  },
  STONE: {
    id: 'STONE',
    name: '돌',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 20,
    icon: '🪨',
  },
  FIBER: {
    id: 'FIBER',
    name: '섬유',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 30,
    icon: '🧵',
  },
  MEAT: {
    id: 'MEAT',
    name: '고기',
    type: ITEM_TYPES.CONSUMABLE,
    stackable: true,
    maxStack: 10,
    icon: '🥩',
    effect: { hunger: 30 },
  },
  BERRY: {
    id: 'BERRY',
    name: '열매',
    type: ITEM_TYPES.CONSUMABLE,
    stackable: true,
    maxStack: 20,
    icon: '🫐',
    effect: { hunger: 10, sanity: 5 },
  },
  SNAKE_FANG: {
    id: 'SNAKE_FANG',
    name: '뱀 이빨',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 10,
    icon: '🦷',
  },
  BEAR_CLAW: {
    id: 'BEAR_CLAW',
    name: '곰 발톱',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 5,
    icon: '🐻',
  },
  MONKEY_FUR: {
    id: 'MONKEY_FUR',
    name: '원숭이 털',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 15,
    icon: '🐒',
  },
  ANT_SHELL: {
    id: 'ANT_SHELL',
    name: '개미 껍질',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 30,
    icon: '🐜',
  },
  WEAPON_BRANCH: {
    id: 'WEAPON_BRANCH',
    name: '나뭇가지 무기',
    type: ITEM_TYPES.WEAPON,
    stackable: false,
    icon: '🏏',
    weaponKey: 'BRANCH',
  },
  WEAPON_STONE_AXE: {
    id: 'WEAPON_STONE_AXE',
    name: '돌도끼',
    type: ITEM_TYPES.WEAPON,
    stackable: false,
    icon: '🪓',
    weaponKey: 'STONE_AXE',
  },
  WEAPON_SPEAR: {
    id: 'WEAPON_SPEAR',
    name: '창',
    type: ITEM_TYPES.WEAPON,
    stackable: false,
    icon: '🔱',
    weaponKey: 'SPEAR',
  },
  WEAPON_TORCH: {
    id: 'WEAPON_TORCH',
    name: '횃불',
    type: ITEM_TYPES.WEAPON,
    stackable: false,
    icon: '🔥',
    weaponKey: 'TORCH',
  },
  WEAPON_REINFORCED_AXE: {
    id: 'WEAPON_REINFORCED_AXE',
    name: '강화 도끼',
    type: ITEM_TYPES.WEAPON,
    stackable: false,
    icon: '⚔️',
    weaponKey: 'REINFORCED_AXE',
  },
  HEALTH_POTION: {
    id: 'HEALTH_POTION',
    name: '회복 물약',
    type: ITEM_TYPES.CONSUMABLE,
    stackable: true,
    maxStack: 5,
    icon: '🧪',
    effect: { hp: 50 },
  },
  SANITY_AMULET: {
    id: 'SANITY_AMULET',
    name: '정신력 부적',
    type: ITEM_TYPES.TOOL,
    stackable: false,
    icon: '🔮',
    effect: { sanityDecayReduction: 0.5 },
    equipSlot: 'accessory',
  },
  WATER: {
    id: 'WATER',
    name: '물',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 10,
    icon: '💧',
  },
  IRON_ORE: {
    id: 'IRON_ORE',
    name: '철광석',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 15,
    icon: '⛏️',
  },
  FAIRY_DUST: {
    id: 'FAIRY_DUST',
    name: '요정 가루',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 10,
    icon: '✨',
  },
  ENCHANTED_BERRY: {
    id: 'ENCHANTED_BERRY',
    name: '마법 열매',
    type: ITEM_TYPES.CONSUMABLE,
    stackable: true,
    maxStack: 5,
    icon: '🍇',
    effect: { hp: 20, hunger: 15, sanity: 20 },
  },
  GOLEM_CORE: {
    id: 'GOLEM_CORE',
    name: '골렘 핵',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 3,
    icon: '💎',
  },
  WOLF_PELT: {
    id: 'WOLF_PELT',
    name: '늑대 가죽',
    type: ITEM_TYPES.MATERIAL,
    stackable: true,
    maxStack: 10,
    icon: '🐺',
  },
};

export const RECIPES = {
  WEAPON_BRANCH: {
    result: 'WEAPON_BRANCH',
    ingredients: [
      { itemId: 'BRANCH', amount: 3 },
      { itemId: 'FIBER', amount: 2 },
    ],
  },
  WEAPON_STONE_AXE: {
    result: 'WEAPON_STONE_AXE',
    ingredients: [
      { itemId: 'BRANCH', amount: 2 },
      { itemId: 'STONE', amount: 3 },
      { itemId: 'FIBER', amount: 3 },
    ],
  },
  WEAPON_SPEAR: {
    result: 'WEAPON_SPEAR',
    ingredients: [
      { itemId: 'BRANCH', amount: 4 },
      { itemId: 'STONE', amount: 2 },
      { itemId: 'SNAKE_FANG', amount: 1 },
    ],
  },
  WEAPON_TORCH: {
    result: 'WEAPON_TORCH',
    ingredients: [
      { itemId: 'BRANCH', amount: 2 },
      { itemId: 'FIBER', amount: 5 },
    ],
  },
  HEALTH_POTION: {
    result: 'HEALTH_POTION',
    ingredients: [
      { itemId: 'BERRY', amount: 3 },
      { itemId: 'WATER', amount: 1 },
    ],
  },
  SANITY_AMULET: {
    result: 'SANITY_AMULET',
    ingredients: [
      { itemId: 'BRANCH', amount: 2 },
      { itemId: 'STONE', amount: 1 },
      { itemId: 'FAIRY_DUST', amount: 1 },
    ],
  },
  WEAPON_REINFORCED_AXE: {
    result: 'WEAPON_REINFORCED_AXE',
    ingredients: [
      { itemId: 'WEAPON_STONE_AXE', amount: 1 },
      { itemId: 'IRON_ORE', amount: 2 },
      { itemId: 'GOLEM_CORE', amount: 1 },
    ],
  },
};

export const MONSTER_DROPS = {
  snake: [
    { itemId: 'SNAKE_FANG', chance: 0.8, min: 1, max: 2 },
    { itemId: 'MEAT', chance: 0.5, min: 1, max: 1 },
  ],
  monkey: [
    { itemId: 'MONKEY_FUR', chance: 0.9, min: 2, max: 4 },
    { itemId: 'BERRY', chance: 0.3, min: 1, max: 3 },
  ],
  bear: [
    { itemId: 'BEAR_CLAW', chance: 1.0, min: 2, max: 4 },
    { itemId: 'MEAT', chance: 0.8, min: 2, max: 4 },
  ],
  fireAnt: [
    { itemId: 'ANT_SHELL', chance: 0.6, min: 1, max: 2 },
  ],
  giantCentipede: [
    { itemId: 'ANT_SHELL', chance: 1.0, min: 5, max: 10 },
    { itemId: 'MEAT', chance: 0.7, min: 3, max: 5 },
  ],
  wolf: [
    { itemId: 'WOLF_PELT', chance: 0.9, min: 1, max: 2 },
    { itemId: 'MEAT', chance: 0.6, min: 1, max: 2 },
  ],
  forestFairy: [
    { itemId: 'FAIRY_DUST', chance: 1.0, min: 1, max: 3 },
    { itemId: 'ENCHANTED_BERRY', chance: 0.4, min: 1, max: 2 },
  ],
  ancientGolem: [
    { itemId: 'GOLEM_CORE', chance: 1.0, min: 1, max: 1 },
    { itemId: 'IRON_ORE', chance: 0.8, min: 2, max: 4 },
    { itemId: 'STONE', chance: 1.0, min: 5, max: 10 },
  ],
};

export const RESOURCE_DROPS = {
  tree: [
    { itemId: 'BRANCH', min: 2, max: 4 },
    { itemId: 'FIBER', min: 1, max: 2 },
  ],
  rock: [
    { itemId: 'STONE', min: 2, max: 4 },
  ],
  bush: [
    { itemId: 'BERRY', min: 1, max: 3 },
    { itemId: 'FIBER', min: 1, max: 2 },
  ],
};
