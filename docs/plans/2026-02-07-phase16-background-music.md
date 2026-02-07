# Phase 16: 배경 음악 (Background Music)

## Overview
낮/밤/보스전 테마 BGM과 부드러운 전환 효과.

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/systems/MusicManager.js` | BGM 재생/전환 시스템 |
| `src/components/ui/VolumeControl.jsx` | 볼륨 슬라이더 UI |
| `src/components/ui/VolumeControl.css` | 스타일 |
| `public/sounds/music/*.mp3` | 3개 BGM 파일 |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `audioStore.js` | musicVolume 상태 추가 (Phase 15에서 이미 포함) |
| `gameStore.js` | isNight/bossSpawned 변경 시 BGM 전환 트리거 |
| `PauseMenu.jsx` | VolumeControl 통합 |
| `App.jsx` | MusicManager 초기화 |

## Data Structure

```javascript
// MusicManager.js
const MUSIC_TRACKS = {
  day: { src: '/sounds/music/day-theme.mp3', volume: 0.4 },
  night: { src: '/sounds/music/night-theme.mp3', volume: 0.5 },
  boss: { src: '/sounds/music/boss-theme.mp3', volume: 0.7 },
};
```

## Implementation Steps

1. `MusicManager.js` 생성 (Howl 인스턴스, crossfade 로직)
2. `crossfade(from, to, duration)` 함수 구현
3. `gameStore.js`에 BGM 트리거 로직 추가
4. `VolumeControl.jsx` 생성 (마스터/SFX/음악 슬라이더)
5. `PauseMenu.jsx`에 VolumeControl 통합
6. `App.jsx`에 MusicManager 초기화

## Music Tracks

| 트랙 | 파일명 | 용도 | 분위기 |
|------|--------|------|--------|
| 낮 테마 | `day-theme.mp3` | 낮 시간대 | 평화로운, 탐험적 |
| 밤 테마 | `night-theme.mp3` | 밤 시간대 | 긴장감, 불안함 |
| 보스 테마 | `boss-theme.mp3` | 보스전 | 웅장함, 전투적 |

## Crossfade Logic

```javascript
function crossfade(fromTrack, toTrack, duration = 2000) {
  const steps = 20;
  const stepTime = duration / steps;
  let step = 0;
  
  const interval = setInterval(() => {
    step++;
    const progress = step / steps;
    
    fromTrack.volume(fromTrack._volume * (1 - progress));
    toTrack.volume(toTrack._volume * progress);
    
    if (step >= steps) {
      clearInterval(interval);
      fromTrack.stop();
    }
  }, stepTime);
  
  toTrack.play();
}
```

## Testing Checklist

- [ ] 게임 시작 시 낮 테마 재생
- [ ] 밤 전환 시 페이드 아웃/인
- [ ] 보스전 시작 시 보스 테마
- [ ] 보스전 종료/승리 시 테마 복구
- [ ] 일시정지 메뉴에서 볼륨 조절
- [ ] 볼륨 설정 저장/불러오기

## Estimated Effort

**Medium (2시간)**
