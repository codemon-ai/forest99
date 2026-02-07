# Phase 15: 사운드 효과 (Sound Effects)

## Overview
Howler.js를 사용한 효과음 시스템. 전투, 채집, UI, 환경 사운드 통합.

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/stores/audioStore.js` | 볼륨/음소거 상태 관리 |
| `src/systems/SoundManager.js` | Howler.js 래퍼, 사운드 재생 API |
| `public/sounds/sfx/*.mp3` | 17개 효과음 파일 |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `package.json` | `howler` 추가 |
| `playerStore.js` | 공격/피격 시 `playSound()` |
| `combatStore.js` | 몬스터 타격/사망 시 사운드 |
| `resourceStore.js` | 채집 시 사운드 |
| `inventoryStore.js` | 열기/닫기/획득 시 사운드 |
| `MainMenu.jsx` | UI 클릭 사운드 |
| `PauseMenu.jsx` | UI 클릭 사운드 |
| `Player.jsx` | 발걸음/점프 사운드 |

## Implementation Steps

1. `npm install howler` 실행
2. `audioStore.js` 생성 (masterVolume, sfxVolume, musicVolume, 저장/불러오기)
3. `SoundManager.js` 생성 (Howl 인스턴스 관리, play/stop API)
4. `public/sounds/sfx/` 디렉토리 생성
5. `playerStore.js`에 공격/피격 사운드 트리거 추가
6. `combatStore.js`에 명중/사망 사운드 추가
7. `resourceStore.js`에 채집 사운드 추가
8. `inventoryStore.js`에 UI 사운드 추가
9. `MainMenu.jsx`/`PauseMenu.jsx`에 버튼 클릭 사운드 추가
10. `Player.jsx`에 발걸음/점프 사운드 추가

## Dependencies

```bash
npm install howler
```

## Sound List

| 사운드 | 파일명 | 용도 |
|--------|--------|------|
| 공격 휘두르기 | `attack_swing.mp3` | 공격 시 |
| 공격 명중 | `attack_hit.mp3` | 몬스터 타격 |
| 플레이어 피격 | `player_hurt.mp3` | 피격 시 |
| 몬스터 으르렁 | `monster_growl.mp3` | 몬스터 감지 |
| 몬스터 사망 | `monster_death.mp3` | 처치 시 |
| 나무 채집 | `chop_wood.mp3` | 나무 채집 |
| 돌 채집 | `mine_rock.mp3` | 돌 채집 |
| 아이템 획득 | `item_pickup.mp3` | 아이템 획득 |
| 인벤토리 열기 | `ui_open.mp3` | UI 열기 |
| 인벤토리 닫기 | `ui_close.mp3` | UI 닫기 |
| 버튼 클릭 | `ui_click.mp3` | 버튼 클릭 |
| 제작 완료 | `craft_complete.mp3` | 제작 성공 |
| 발걸음 | `footstep.mp3` | 걷기 |
| 달리기 | `footstep_run.mp3` | 달리기 |
| 점프 | `jump.mp3` | 점프 |
| 착지 | `land.mp3` | 착지 |
| 무기 장착 | `equip.mp3` | 장비 변경 |

## Testing Checklist

- [ ] 공격 휘두르기/명중 소리
- [ ] 플레이어/몬스터 피격/사망 소리
- [ ] 채집 소리 (나무/돌)
- [ ] 인벤토리/크래프팅 열기/닫기 소리
- [ ] 아이템 획득/제작 소리
- [ ] 버튼 클릭 소리
- [ ] 발걸음/달리기/점프/착지 소리

## Estimated Effort

**Medium (2-3시간)**
