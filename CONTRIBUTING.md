# Contributing to 숲에서 보낸 99일 밤

먼저, 이 프로젝트에 관심을 가져주셔서 감사합니다! 🌲

## 🚀 시작하기

### 개발 환경 설정

1. 저장소 포크
2. 로컬에 클론
   ```bash
   git clone https://github.com/YOUR_USERNAME/forest99.git
   cd forest99
   ```
3. 의존성 설치
   ```bash
   npm install
   ```
4. 개발 서버 실행
   ```bash
   npm run dev
   ```
5. http://localhost:5173 접속

### 브랜치 전략

- `main` - 프로덕션 브랜치
- `feature/*` - 새 기능 개발
- `fix/*` - 버그 수정
- `docs/*` - 문서 수정

## 📝 기여 방법

### 이슈 등록

버그를 발견했거나 새 기능을 제안하고 싶다면:

1. 기존 이슈 확인 (중복 방지)
2. 새 이슈 생성
3. 템플릿에 맞춰 작성

### Pull Request

1. 이슈 번호와 연결된 브랜치 생성
   ```bash
   git checkout -b feature/123-new-monster
   ```
2. 변경사항 커밋
   ```bash
   git commit -m "feat: add new monster type"
   ```
3. 브랜치 푸시
   ```bash
   git push origin feature/123-new-monster
   ```
4. Pull Request 생성

## 💻 코드 스타일

### 커밋 메시지 규칙

```
<type>: <description>

[optional body]
```

**타입:**
- `feat` - 새 기능
- `fix` - 버그 수정
- `docs` - 문서 변경
- `style` - 코드 스타일 (포매팅 등)
- `refactor` - 리팩토링
- `perf` - 성능 개선
- `test` - 테스트 추가/수정
- `chore` - 빌드, 설정 등

**예시:**
```
feat: add wolf pack monster
fix: correct player collision detection
docs: update README with new controls
```

### 코드 스타일

- ESLint 규칙 준수
- 2 스페이스 들여쓰기
- 컴포넌트 파일명은 PascalCase
- 함수/변수명은 camelCase

### React/Three.js 규칙

- 컴포넌트는 함수형으로 작성
- 상태는 Zustand 스토어 사용
- 3D 오브젝트는 `components/game/` 또는 `components/lowpoly/`에 배치

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── game/       # 게임 오브젝트 (Player, Terrain, Monster...)
│   ├── effects/    # 시각 효과 (ParticleSystem, PostProcessing)
│   ├── lowpoly/    # 3D 모델 (LowPolyTree, LowPolyRock...)
│   └── ui/         # UI 컴포넌트 (HUD, Inventory, Menu...)
├── stores/         # Zustand 상태 관리
├── systems/        # 게임 시스템 (AI, Collision, Sound...)
├── data/           # 게임 데이터 (config, monsters, items...)
├── i18n/           # 다국어 지원
├── hooks/          # React hooks
└── utils/          # 유틸리티 함수
```

## 🎮 새 기능 추가 가이드

### 새 몬스터 추가

1. `src/data/monsters.js`에 몬스터 타입 추가
2. `src/components/game/monsters/`에 컴포넌트 생성
3. `src/data/items.js`에 드롭 아이템 정의
4. `src/i18n/locales/`에 번역 추가

### 새 아이템 추가

1. `src/data/items.js`에 아이템 정의
2. 크래프팅 가능하면 레시피 추가
3. `src/i18n/locales/`에 번역 추가

### 새 이벤트 추가

1. `src/data/events.js`에 이벤트 정의
2. 필요시 `src/components/game/EventEffects.jsx`에 시각 효과 추가
3. `src/i18n/locales/`에 번역 추가

## 🧪 테스트

```bash
# 빌드 테스트
npm run build

# 프리뷰
npm run preview
```

## 📄 라이선스

기여하신 코드는 MIT 라이선스로 배포됩니다.

## 💬 질문이 있으신가요?

이슈를 통해 질문해 주세요!

---

다시 한번 기여에 감사드립니다! 🙏
