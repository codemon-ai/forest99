# Phase 22: 추가 콘텐츠 (Additional Content)

## Overview
새로운 몬스터, 아이템, 이벤트, 무기 추가로 게임 콘텐츠 확장.

## New Monsters

| 몬스터 | 설명 | 출현 조건 |
|--------|------|-----------|
| 늑대 무리 | 3-5마리 그룹으로 이동 | 밤, 30일 이후 |
| 숲 요정 | 회피형, 희귀 드롭 | 주간, 랜덤 |
| 고대 골렘 | 높은 체력, 느린 이동 | 50일 이후 |

## New Items

| 아이템 | 효과 | 제작 재료 |
|--------|------|-----------|
| 회복 물약 | HP +50 | 열매 x3, 물 x1 |
| 정신력 부적 | 정신력 감소 50% 감소 | 나뭇가지 x2, 돌 x1 |
| 강화 도끼 | 공격력 +5 | 돌도끼 x1, 철 x2 |

## New Events

| 이벤트 | 효과 | 지속 시간 |
|--------|------|-----------|
| 보름달 | 몬스터 강화, 드롭률 증가 | 하룻밤 |
| 숲의 축복 | 자원 재생 2배 | 1일 |
| 안개 속 그림자 | 시야 제한, 미니보스 출현 | 30초 |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `src/data/monsters.js` | 새 몬스터 추가 |
| `src/data/items.js` | 새 아이템 추가 |
| `src/data/events.js` | 새 이벤트 추가 |
| `src/data/recipes.js` | 새 제작법 추가 |

## Status
- [x] 구현 완료 (2026-02-08)

## Implementation Notes

### New Monsters Added (src/data/monsters.js)
- **늑대 (Wolf)**: HP 60, 공격력 18, 속도 6, 30일 이후 야간 등장, 3-5마리 무리
- **숲 요정 (Forest Fairy)**: HP 25, 공격력 5, 속도 8, 패시브, 희귀 드롭 (요정 가루, 마법 열매)
- **고대 골렘 (Ancient Golem)**: HP 400, 공격력 45, 속도 1.5, 50일 이후 등장

### New Items Added (src/data/items.js)
- **회복 물약 (Health Potion)**: HP +50, 제작: 열매 x3, 물 x1
- **정신력 부적 (Sanity Amulet)**: 정신력 감소 50% 감소, 제작: 나뭇가지 x2, 돌 x1, 요정 가루 x1
- **강화 도끼 (Reinforced Axe)**: 공격력 35, 제작: 돌도끼 x1, 철광석 x2, 골렘 핵 x1
- **물 (Water)**: 재료
- **철광석 (Iron Ore)**: 재료, 골렘 드롭
- **요정 가루 (Fairy Dust)**: 재료, 요정 드롭
- **마법 열매 (Enchanted Berry)**: HP +20, 배고픔 +15, 정신력 +20
- **골렘 핵 (Golem Core)**: 재료, 골렘 드롭
- **늑대 가죽 (Wolf Pelt)**: 재료, 늑대 드롭

### New Events Added (src/data/events.js)
- **보름달 (Full Moon)**: 밤 전용, 15일 이후, 몬스터 강화 + 드롭률 2배
- **숲의 축복 (Forest Blessing)**: 10일 이후, 자원 재생 2배, 정신력 회복 1.5배
- **안개 속 그림자 (Shadow Fog)**: 밤 전용, 25일 이후, 시야 제한 + 미니보스 등장

### Weapons Added (src/stores/playerStore.js)
- **강화 도끼 (Reinforced Axe)**: 공격력 35, 사거리 2.5, 쿨다운 0.5
