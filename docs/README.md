# 문서 관리 가이드

이 폴더는 프로젝트의 모든 문서를 체계적으로 관리합니다.

## 폴더 구조

```
docs/
├── README.md          # 이 파일 - 문서 관리 규칙
├── PROGRESS.md        # 전체 개발 진행 상황
├── plans/             # 개발 계획서
├── reports/           # 완료 보고서, 검증 결과
├── guides/            # 사용 가이드, 연동 가이드
└── images/            # 이미지 파일
```

## 폴더별 용도

### plans/ - 개발 계획서

개발 **시작 전** 작성하는 계획 문서입니다.

**파일명 규칙:** `YYYY-MM-DD-phase##-기능명.md`

**예시:**
- `2026-02-06-phase01-project-setup.md`
- `2026-02-07-phase15-sound-effects.md`

**포함 내용:**
- 구현 목표
- 기술 스택/라이브러리
- 작업 단계
- 예상 이슈

### reports/ - 완료 보고서

개발 **완료 후** 작성하는 결과 문서입니다.

**파일명 규칙:** `PHASE##_SUMMARY.md` 또는 `PHASE##_COMPLETION.md`

**예시:**
- `PHASE15_SUMMARY.md`
- `PHASE15_VERIFICATION.txt`

**포함 내용:**
- 구현 결과
- 테스트 결과
- 발견된 이슈
- 다음 단계

### guides/ - 가이드 문서

기능 사용법, 연동 방법 등 참조용 문서입니다.

**예시:**
- `AUDIO_ASSETS.md` - 오디오 에셋 목록
- `SOUND_INTEGRATION_GUIDE.md` - 사운드 연동 가이드

### images/ - 이미지

문서에서 참조하는 이미지 파일입니다.

**파일명 규칙:** 용도를 알 수 있는 명확한 이름 사용
- `original-plan.jpg` - 초기 기획서
- `screenshot-gameplay.png` - 게임플레이 스크린샷

## 문서 작성 규칙

1. **언어:** 한국어 사용 (코드/명령어 제외)
2. **형식:** Markdown (.md) 사용
3. **인코딩:** UTF-8
4. **줄바꿈:** LF (Unix 스타일)

## 커밋 메시지 규칙

문서 관련 커밋은 `docs:` 접두어 사용:

```
docs: 문서 구조 정리 및 관리 규칙 추가
docs: Phase 15 완료 보고서 작성
docs: 사운드 연동 가이드 업데이트
```
