# Phase 16: 배경음악 시스템 구현

## 배경 정보
숲에서 보낸 99일 밤 게임의 다음 단계입니다.
- Phase 15에서 모든 오디오 파일(16개 SFX + 3개 BGM)을 다운로드 완료
- 이제 BGM 시스템을 게임에 통합해야 함

## 현황
- ✅ 배경음악 3개 준비됨: `public/sounds/music/day-theme.mp3`, `night-theme.mp3`, `boss-theme.mp3`
- ✅ SoundManager.js 이미 존재 (효과음 시스템)
- ✅ audioStore.js 이미 생성 (볼륨 상태 관리)
- ❌ MusicManager.js 필요 (BGM 관리)
- ❌ VolumeControl.jsx 필요 (음량 조절 UI)

## 구현 요구사항

### 1. MusicManager.js 생성
위치: `src/systems/MusicManager.js`

요구사항:
- Howler.js (또는 Web Audio API) 사용
- 3가지 트랙: day, night, boss
- 트랙별 기본 볼륨: day(0.4), night(0.5), boss(0.7)
- crossfade 함수: 현재 트랙 → 새 트랙으로 부드러운 전환 (기본 2초)
- 글로벌 마스터 볼륨 지원

```javascript
예상 구조:
- playTrack(trackName): 트랙 재생
- crossfadeToTrack(trackName, duration): 부드러운 전환 재생
- setVolume(trackName, volume): 트랙 볼륨 조절
- setMasterVolume(volume): 마스터 볼륨 조절
- stopAll(): 모든 트랙 중지
```

### 2. VolumeControl.jsx 생성
위치: `src/components/ui/VolumeControl.jsx`

요구사항:
- 마스터 볼륨 슬라이더 (0-100%)
- SFX 음량 슬라이더
- 음악 음량 슬라이더
- 음소거(Mute) 버튼
- audioStore와 연동

### 3. VolumeControl.css 생성
위치: `src/components/ui/VolumeControl.css`

요구사항:
- 어두운 게임 UI와 조화되는 스타일
- 슬라이더, 레이블, 음소거 버튼 스타일
- 반응형 디자인

### 4. gameStore.js 수정
변경 내용:
- isNight 상태 변경 시 BGM 자동 전환 로직 추가
  - isNight: false → 'day' 트랙 재생
  - isNight: true → 'night' 트랙 재생
- bossSpawned 상태 변경 시
  - bossSpawned: true → 'boss' 트랙 재생
  - bossSpawned: false → 현재 낮/밤 상태의 트랙으로 복구

### 5. App.jsx 수정
변경 내용:
- MusicManager 초기화 (useEffect)
- 게임 시작 시 'day' 트랙 자동 재생

### 6. PauseMenu.jsx 수정
변경 내용:
- VolumeControl 컴포넌트 추가
- 일시정지 메뉴에서 음량 조절 가능하게

## 테스트 체크리스트

필수 확인 사항:
- [ ] 게임 시작 시 낮 테마가 자동 재생됨
- [ ] isNight 변경 시 day ↔ night BGM이 부드럽게 전환됨 (2초 페이드)
- [ ] bossSpawned: true 시 boss 테마로 전환
- [ ] boss 승리/패배 후 이전 BGM 상태로 복구
- [ ] PauseMenu에서 음량 슬라이더로 조절 가능
- [ ] 마스터 음량, SFX 음량, 음악 음량 독립적으로 제어 가능
- [ ] 음소거 버튼으로 전체 음소거 가능
- [ ] 음량 설정이 audioStore에 저장됨

## 기술 사양

### 오디오 라이브러리
선택 사항:
1. **Howler.js** (권장): Web Audio API 래퍼, 쉬운 사용, 크로스페이드 지원
2. **Web Audio API**: 저수준, 완전한 제어

### BGM 트랙 정보
| 이름 | 파일 | 길이 | 분위기 |
|------|------|------|--------|
| Day | `/sounds/music/day-theme.mp3` | 2:33 | 평화로운, 탐험적 |
| Night | `/sounds/music/night-theme.mp3` | 3:12 | 긴장, 불안함 |
| Boss | `/sounds/music/boss-theme.mp3` | 3:33 | 웅장함, 전투적 |

### 크로스페이드 로직 (권장 구현)
```javascript
// 현재 재생 중인 트랙에서 새 트랙으로 2초 동안 전환
// 단계: 20 스텝 (매 100ms마다 볼륨 변경)
// 이전 트랙: 100% → 0% (페이드 아웃)
// 새 트랙: 0% → 기본 볼륨% (페이드 인)
// 전환 완료 후 이전 트랙 정지
```

## 참고 파일
- `docs/AUDIO_ASSETS.md` - 오디오 에셋 상세 정보
- `docs/plans/2026-02-07-phase16-background-music.md` - 원본 계획서
- `src/stores/audioStore.js` - 이미 생성된 오디오 상태 관리
- `src/systems/SoundManager.js` - 효과음 시스템 참고

## 예상 파일 생성/수정 요약
- 새로 생성: MusicManager.js, VolumeControl.jsx, VolumeControl.css
- 수정: gameStore.js, App.jsx, PauseMenu.jsx

## 완료 기준
모든 테스트 체크리스트 항목 통과 및 게임 내에서 음악이 올바르게 재생/전환되는 것 확인
