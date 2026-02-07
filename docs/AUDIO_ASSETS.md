# 오디오 에셋 가이드 (Audio Assets Guide)

## 개요

이 문서는 "숲에서 보낸 99일 밤" 게임에 필요한 모든 오디오 파일을 정리합니다.

---

## 파일 위치

```
public/
└── sounds/
    ├── sfx/           # 효과음 (16개)
    └── music/         # 배경음악 (3개)
```

---

## 1. 효과음 (Sound Effects)

### 전투 사운드

| 파일명 | 설명 | 분위기/키워드 |
|--------|------|---------------|
| `attack_swing.mp3` | 무기 휘두르기 | whoosh, swing, slash |
| `attack_hit.mp3` | 타격 명중 | punch, impact, hit |
| `player_hurt.mp3` | 플레이어 피격 | hurt, pain, grunt |
| `monster_growl.mp3` | 몬스터 으르렁 | growl, snarl, creature |
| `monster_death.mp3` | 몬스터 사망 | death, creature die |

### 채집 사운드

| 파일명 | 설명 | 분위기/키워드 |
|--------|------|---------------|
| `chop_wood.mp3` | 나무 채집 | axe, chop, wood |
| `mine_rock.mp3` | 돌 채집 | pickaxe, mining, stone |

### UI 사운드

| 파일명 | 설명 | 분위기/키워드 |
|--------|------|---------------|
| `item_pickup.mp3` | 아이템 획득 | collect, pickup, ding |
| `ui_open.mp3` | UI 열기 | menu open, whoosh |
| `ui_close.mp3` | UI 닫기 | menu close, soft |
| `ui_click.mp3` | 버튼 클릭 | click, button, select |
| `craft_complete.mp3` | 제작 완료 | success, anvil, craft |
| `equip.mp3` | 장비 장착 | equip, gear, weapon |

### 이동 사운드

| 파일명 | 설명 | 분위기/키워드 |
|--------|------|---------------|
| `footstep.mp3` | 걷기 발소리 | footstep, grass, walk |
| `jump.mp3` | 점프 | jump, leap |
| `land.mp3` | 착지 | land, thud |

---

## 2. 배경음악 (Background Music)

### 🌞 낮 테마 (Day Theme)

**파일명:** `day-theme.mp3`

| 항목 | 내용 |
|------|------|
| **분위기** | 평화롭고 차분한, 자연의 소리, 탐험적 |
| **장르** | Ambient, Folk, Acoustic, Celtic |
| **템포** | 느림-중간 (60-90 BPM) |
| **길이** | 2-3분 (루프) |
| **사용 시점** | 게임 중 낮 시간, 승리 화면 |

**검색 키워드:**
```
peaceful forest ambient
acoustic nature exploration
calm adventure background
medieval peaceful theme
```

---

### 🌙 밤 테마 (Night Theme)

**파일명:** `night-theme.mp3`

| 항목 | 내용 |
|------|------|
| **분위기** | 긴장감, 어둡고 불안한, 미스터리 |
| **장르** | Dark Ambient, Horror Atmosphere, Suspense |
| **템포** | 느림 (40-70 BPM) |
| **길이** | 2-3분 (루프) |
| **사용 시점** | 게임 중 밤 시간 |

**검색 키워드:**
```
dark forest ambient
survival horror background
tense night atmosphere
creepy ambient soundscape
```

---

### ⚔️ 보스 테마 (Boss Theme)

**파일명:** `boss-theme.mp3`

| 항목 | 내용 |
|------|------|
| **분위기** | 웅장하고 강렬한, 전투적, 에픽 |
| **장르** | Epic Orchestral, Boss Battle, Dramatic Action |
| **템포** | 빠름 (120-160 BPM) |
| **길이** | 2-3분 (루프) |
| **사용 시점** | 99일차 숲의 수호자 보스전 |

**검색 키워드:**
```
epic boss battle music
intense orchestral combat
dramatic fight theme
final boss soundtrack
```

---

## 3. 오디오 사양

### 권장 스펙

| 항목 | 효과음 | 배경음악 |
|------|--------|----------|
| **포맷** | MP3 | MP3 |
| **비트레이트** | 128 kbps | 192 kbps |
| **샘플레이트** | 44.1 kHz | 44.1 kHz |
| **채널** | Mono/Stereo | Stereo |
| **길이** | 0.5-3초 | 2-3분 |
| **볼륨** | 정규화 | 정규화 (-14 LUFS) |

### 파일 크기 가이드

| 타입 | 권장 크기 |
|------|-----------|
| 효과음 (개당) | 10-100 KB |
| 배경음악 (개당) | 2-5 MB |
| 총 예상 크기 | ~20 MB |

---

## 4. 무료 오디오 리소스

### 효과음 사이트

| 사이트 | URL | 특징 |
|--------|-----|------|
| Freesound | https://freesound.org | 다양한 CC 라이선스 효과음 |
| Mixkit | https://mixkit.co/free-sound-effects/ | 무료 상업용 가능 |
| Pixabay | https://pixabay.com/sound-effects/ | 저작권 무료 |
| Zapsplat | https://www.zapsplat.com | 무료 (가입 필요) |
| SoundBible | https://soundbible.com | 무료 효과음 |

### 배경음악 사이트

| 사이트 | URL | 특징 |
|--------|-----|------|
| Incompetech | https://incompetech.com | Kevin MacLeod, 크레딧 표기 필요 |
| Free Music Archive | https://freemusicarchive.org | 다양한 CC 라이선스 |
| OpenGameArt | https://opengameart.org | 게임용 에셋 특화 |
| Purple Planet | https://www.purple-planet.com | 무료 배경음악 |
| Bensound | https://www.bensound.com | 고품질 무료 (크레딧 필요) |
| Pixabay Music | https://pixabay.com/music/ | 저작권 무료 |

---

## 5. 체크리스트

### 효과음 (16개)

- [ ] `attack_swing.mp3`
- [ ] `attack_hit.mp3`
- [ ] `player_hurt.mp3`
- [ ] `monster_growl.mp3`
- [ ] `monster_death.mp3`
- [ ] `chop_wood.mp3`
- [ ] `mine_rock.mp3`
- [ ] `item_pickup.mp3`
- [ ] `ui_open.mp3`
- [ ] `ui_close.mp3`
- [ ] `ui_click.mp3`
- [ ] `craft_complete.mp3`
- [ ] `equip.mp3`
- [ ] `footstep.mp3`
- [ ] `jump.mp3`
- [ ] `land.mp3`

### 배경음악 (3개)

- [ ] `day-theme.mp3`
- [ ] `night-theme.mp3`
- [ ] `boss-theme.mp3`

---

## 6. 구현 상태

| 시스템 | 파일 | 상태 |
|--------|------|------|
| 효과음 매니저 | `src/systems/SoundManager.js` | ✅ 완료 |
| 음악 매니저 | `src/systems/MusicManager.js` | ✅ 완료 |
| 볼륨 설정 | `src/stores/audioStore.js` | ✅ 완료 |
| 볼륨 UI | `src/components/ui/VolumeControl.jsx` | ✅ 완료 |

**오디오 파일만 추가하면 바로 작동합니다!**

---

## 7. 라이선스 주의사항

음악/효과음 다운로드 시 확인:

- ✅ **상업적 사용 가능** (Commercial Use)
- ✅ **게임 사용 가능** (Game Use)
- ✅ **웹 배포 가능** (Web Distribution)
- ⚠️ **크레딧 표기 필요 여부** 확인
- ⚠️ **수정/편집 가능 여부** 확인

### 크레딧 표기 예시

게임에 크레딧이 필요한 경우 `MainMenu.jsx`나 별도 크레딧 페이지에 추가:

```
Music:
- "Day Theme" by [Artist Name] - [License]
- "Night Theme" by [Artist Name] - [License]
- "Boss Theme" by [Artist Name] - [License]

Sound Effects:
- [Source Name] - [License]
```
