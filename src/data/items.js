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
