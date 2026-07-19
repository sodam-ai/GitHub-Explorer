<p align="center">
  <img src="src-tauri/icons/128x128.png" alt="GitHub AI Explorer" width="80" />
</p>

<h1 align="center">GitHub AI Explorer</h1>

<p align="center">
  <strong>GitHub 저장소, 코드, 이슈를 AI 자연어로 검색하세요 -- 데스크톱에서 바로.</strong>
</p>

<p align="center">
  <a href="https://github.com/sodam-ai/github-ai-explorer/releases">
    <img src="https://img.shields.io/badge/version-0.3.0-blue.svg" alt="Version" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/platform-Windows-0078D6.svg" alt="Platform" />
  <img src="https://img.shields.io/badge/Tauri-2.0-FFC131.svg" alt="Tauri" />
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React" />
  <img src="https://img.shields.io/badge/설치파일-4.7MB-purple.svg" alt="Size" />
</p>

<p align="center">
  <a href="README.md">English</a> &middot;
  <a href="README.ja.md">日本語</a> &middot;
  <a href="README.zh.md">中文</a>
</p>

---

## GitHub AI Explorer란?

**GitHub AI Explorer**는 복잡한 검색 문법 대신 일상 언어로 GitHub를 검색하고 탐색할 수 있는 가벼운 데스크톱 앱입니다.

`react drag drop library stars:>1000 language:typescript` 같은 복잡한 검색어 대신:

> "React 드래그앤드롭 라이브러리 중에 스타 많고 TypeScript 지원하는 것"

이렇게 자연어로 입력하면 AI가 가장 적합한 저장소, 코드, 이슈를 찾아주고, 결과를 요약해서 빠르게 판단할 수 있게 도와줍니다.

### 누구를 위한 앱인가요?

- **개발자** -- 라이브러리, 도구, 코드 예제를 찾고 싶을 때
- **학생** -- 학습을 위해 오픈소스 프로젝트를 탐색하고 싶을 때
- **연구자** -- 관련 분야의 저장소를 발견하고 싶을 때
- **누구나** -- GitHub에 어떤 프로젝트가 있는지 궁금할 때

---

## 주요 기능 (50+개)

### 검색 & 탐색

| # | 기능 | 설명 |
|---|------|------|
| 1 | AI 시맨틱 검색 | 3단계 병렬 검색: 일반 + 유저 저장소 + `user:` 쿼리로 포괄적인 결과 제공 |
| 2 | 검색 결과 AI 요약 | 모든 검색 결과 상단에 AI가 핵심 요약을 자동 생성 |
| 3 | 자연어 코드 Q&A | 저장소 코드에 대해 질문하면 AI가 RAG(README + 파일트리 컨텍스트)로 답변 |
| 4 | 코드 스니펫 뷰어 | Prism.js 기반 12개 이상 언어 구문 강조 코드 뷰어 |
| 5 | 고급 필터 (8종) | 제작자, 언어, 라이선스, 스타, 포크, 기간, 정렬 순서, 아카이브 여부 |
| 6 | 필터 프리셋 | 3개 기본 프리셋 + 필터 칩 시각적 표시 |
| 7 | 검색 자동완성 | 검색 히스토리 + 인기 GitHub 토픽 기반 자동 추천 |
| 8 | 빈 검색어 필터 검색 | 검색어 없이 필터만으로 검색 가능 |
| 9 | 무한 스크롤 | 스크롤 시 검색 결과 자동 로드 |

### 분석 & 비교

| # | 기능 | 설명 |
|---|------|------|
| 10 | 저장소 비교 | 2~3개 유사 저장소를 나란히 비교하는 비교표 |
| 11 | 건강도 분석 | 활동성/문서화/커뮤니티 기반 점수 + 등급(A~F) |
| 12 | 비교 히스토리 | 과거 비교 결과를 저장하고 언제든 다시 확인 |
| 13 | AI 모델 벤치마크 | 다양한 AI 제공자의 응답 품질 테스트 및 비교 |

### 정리 & 관리

| # | 기능 | 설명 |
|---|------|------|
| 14 | 북마크 & 컬렉션 | 저장소를 메모와 함께 저장하고, 컬렉션으로 분류 |
| 15 | 스마트 폴더 | 사용자 정의 규칙으로 저장소를 자동 분류 |
| 16 | 코드 스니펫 저장 | 관심 있는 코드를 서랍 UI에 영구 저장 |
| 17 | 컬렉션 내보내기 | 컬렉션을 JSON으로 내보내서 백업 또는 공유 |
| 18 | 검색 히스토리 | 모든 검색 기록을 로컬 SQLite에 영구 저장 |
| 19 | 저장소 미리보기 | README, 통계, 토픽, 언어 비율을 모달로 확인 |

### 대시보드 & 모니터링

| # | 기능 | 설명 |
|---|------|------|
| 20 | 트렌딩 대시보드 | 오늘 / 이번 주 / 이번 달 인기 저장소 발견 |
| 21 | 사용 통계 | 검색 패턴, 인기 키워드, 활동 그래프 시각화 |
| 22 | 저장소 알림 | 저장소 변경사항을 구독하고 알림 수신 |

### 사용자 경험

| # | 기능 | 설명 |
|---|------|------|
| 23 | 다크 / 라이트 모드 | 테마 전환 + 6가지 커스텀 accent 색상 |
| 24 | 키보드 단축키 | 커맨드 팔레트(`Ctrl+K`) 포함 전체 키보드 내비게이션 |
| 25 | 온보딩 가이드 | 첫 사용자를 위한 3단계 대화형 가이드 |
| 26 | 시스템 트레이 | 트레이로 최소화, 더블클릭으로 즉시 복원 |
| 27 | 자동 업데이트 | GitHub Releases + Tauri updater를 통한 자동 업데이트 |
| 28 | 접근성 | ARIA 레이블, 키보드 내비게이션, 스크린 리더 지원 |
| 29 | 오프라인 모드 | 인터넷 없이 캐시된 데이터로 검색 |
| 30 | Ollama 로컬 AI | 로컬 모델로 완전히 오프라인 AI 사용 (API 키 불필요) |

---

## 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl + K` | 커맨드 팔레트 열기 (어디서든 빠른 검색) |
| `Ctrl + F` | 검색창에 포커스 |
| `Ctrl + ,` | 설정 열기 |
| `Ctrl + B` | 선택한 저장소 북마크 토글 |
| `j` / `k` | 검색 결과 탐색 (아래 / 위) |
| `Enter` | 선택한 저장소 열기 / 미리보기 |
| `Escape` | 현재 모달 또는 패널 닫기 |

---

## 설치 방법

### 방법 1: 설치 파일 다운로드 (추천)

프로그래밍 지식 없이 가장 쉽게 시작하는 방법입니다.

1. [Releases](https://github.com/sodam-ai/github-ai-explorer/releases) 페이지로 이동
2. 최신 버전 다운로드:

| 파일 | 크기 | 설명 |
|------|------|------|
| `GitHub AI Explorer_x64_en-US.msi` | 4.7 MB | 표준 Windows 설치 파일 (추천). 제어판에서 삭제 가능. |
| `GitHub AI Explorer_x64-setup.exe` | 3.3 MB | NSIS 포터블 설치 파일. |

3. 다운로드한 파일을 실행하고 화면의 안내를 따릅니다
4. 시작 메뉴 또는 바탕화면 바로가기에서 **GitHub AI Explorer**를 실행합니다

> **참고:** 서명되지 않은 앱이므로 Windows SmartScreen 경고가 나타날 수 있습니다. "추가 정보"를 클릭한 후 "실행"을 누르면 됩니다.

### 방법 2: 소스에서 빌드

프로젝트를 수정하거나 기여하고 싶은 개발자를 위한 방법입니다.

#### 사전 준비

| 도구 | 버전 | 용도 | 설치 |
|------|------|------|------|
| Node.js | 18+ | JavaScript 런타임 | [nodejs.org](https://nodejs.org/) |
| Rust | 1.77+ | 백엔드 컴파일 | [rustup.rs](https://rustup.rs/) |
| Visual Studio Build Tools | 2022 | C++ 컴파일러 (Windows) | [visualstudio.microsoft.com](https://visualstudio.microsoft.com/visual-cpp-build-tools/) |
| Git | 최신 | 소스 코드 관리 | [git-scm.com](https://git-scm.com/) |

#### 단계별 빌드 방법

```bash
# 1. 저장소 클론
git clone https://github.com/sodam-ai/github-ai-explorer.git
cd github-ai-explorer

# 2. 프론트엔드 의존성 설치
npm install

# 3. 개발 모드로 실행
#    첫 실행 시 Rust 컴파일로 5~10분 소요됩니다. 이후에는 몇 초면 시작됩니다.
#    http://127.0.0.1:7719 에서 열립니다
npm run tauri:dev

# 4. 프로덕션 설치 파일 빌드 (.msi + .exe)
npm run tauri:build
```

빌드 완료 후 설치 파일 위치:

```
src-tauri/target/release/bundle/msi/GitHub AI Explorer_0.3.0_x64_en-US.msi
src-tauri/target/release/bundle/nsis/GitHub AI Explorer_0.3.0_x64-setup.exe
```

---

## 시작하기

### 1단계: AI 제공자 선택

첫 실행 시 온보딩 가이드가 설정을 안내합니다. **설정** (`Ctrl + ,`)을 열고 AI 제공자를 최소 1개 이상 설정하세요:

| 제공자 | API 키 발급 | 모델 | 무료 |
|--------|-------------|------|------|
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) | GPT-4o, GPT-4o-mini | 아니오 |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) | Claude 4, Claude 4 Sonnet | 아니오 |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com/apikey) | Gemini 2.5 Pro, Gemini 2.5 Flash | 예 |
| Groq | [console.groq.com](https://console.groq.com/keys) | LLaMA, Mixtral | 예 |
| Ollama | [ollama.com](https://ollama.com/) | LLaMA, Mistral, Phi 등 | 예 (로컬, 키 불필요) |

### 2단계: GitHub 토큰 추가 (선택이지만 추천)

GitHub 개인 액세스 토큰을 추가하면 API 요청 한도가 **시간당 60회에서 5,000회로** 증가합니다.

1. [github.com/settings/tokens](https://github.com/settings/tokens) 방문
2. **"Generate new token (classic)"** 클릭
3. `public_repo` 범위 선택
4. 토큰을 복사해서 **설정 > GitHub 토큰**에 붙여넣기

### 3단계: 검색 시작

검색창에 자연어 질문을 입력하고 Enter를 누르세요:

- "React 상태관리 라이브러리 중에 TypeScript 지원하는 것"
- "Python 머신러닝 초보자용 프로젝트"
- "Rust 웹 프레임워크 성능 좋은 것"
- "오픈소스 캘린더 컴포넌트 드래그앤드롭 지원"

**고급 필터** 패널을 사용하면 언어, 스타, 라이선스 등으로 결과를 더 좁힐 수 있습니다.

---

## 지원 AI 제공자

| 제공자 | 모델 | 오프라인 | 무료 | 추천 용도 |
|--------|------|----------|------|-----------|
| OpenAI | GPT-4o, GPT-4o-mini | 불가 | 아니오 | 최고 품질 응답 |
| Anthropic | Claude 4, Claude 4 Sonnet | 불가 | 아니오 | 상세한 코드 분석 |
| Google Gemini | Gemini 2.5 Pro, Flash | 불가 | 예 | 무료로 좋은 품질 |
| Groq | LLaMA, Mixtral | 불가 | 예 | 가장 빠른 응답 속도 |
| Ollama | LLaMA, Mistral, Phi 등 | **가능** | **예** | 프라이버시 우선, 완전 오프라인 |

---

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 데스크톱 프레임워크 | [Tauri](https://tauri.app/) | 2.0 |
| 프론트엔드 | [React](https://react.dev/) | 19 |
| 언어 | [TypeScript](https://www.typescriptlang.org/) | 5.9 |
| 스타일링 | [Tailwind CSS](https://tailwindcss.com/) | 4.2 |
| 백엔드 | [Rust](https://www.rust-lang.org/) | 1.77+ |
| 데이터베이스 | [SQLite](https://www.sqlite.org/) (rusqlite) | 0.32 |
| 상태 관리 | [Zustand](https://zustand.docs.pmnd.rs/) | 5.0 |
| 애니메이션 | [Framer Motion](https://www.framer.com/motion/) | 12 |
| 구문 강조 | [Prism.js](https://prismjs.com/) | 1.30 |
| 아이콘 | [Lucide React](https://lucide.dev/) | 0.577 |
| 라우팅 | [React Router](https://reactrouter.com/) | 7.13 |
| 토스트 알림 | [Sonner](https://sonner.emilkowal.dev/) | 2.0 |
| 빌드 도구 | [Vite](https://vite.dev/) | 8.0 |

---

## 프로젝트 구조

```
github-ai-explorer/
├── src/                        # React 프론트엔드
│   ├── components/
│   │   ├── chat/               # 코드 Q&A 패널 (RAG 기반)
│   │   ├── collection/         # 북마크 & 컬렉션 관리
│   │   ├── search/             # 검색바, 필터, 결과, 비교, 코드 뷰어
│   │   ├── settings/           # 설정 페이지 (API 키, 테마, 언어)
│   │   └── ui/                 # 헤더, 온보딩, 툴팁, 스니펫 서랍
│   ├── hooks/                  # 커스텀 React 훅 (무한 스크롤 등)
│   ├── lib/                    # 핵심 로직
│   │   ├── ai.ts               # AI 제공자 통합
│   │   ├── github.ts           # GitHub API 클라이언트
│   │   ├── ollama.ts           # Ollama 로컬 AI 통합
│   │   ├── code-qa.ts          # RAG 기반 코드 Q&A
│   │   ├── health-score.ts     # 저장소 건강도 점수
│   │   ├── trending.ts         # 트렌딩 대시보드 데이터
│   │   ├── collections.ts      # 컬렉션 관리
│   │   ├── offline-cache.ts    # 오프라인 모드 캐싱
│   │   ├── ai-benchmark.ts     # AI 모델 벤치마크
│   │   ├── export-import.ts    # JSON 내보내기/가져오기
│   │   ├── tauri-bridge.ts     # Tauri IPC 브릿지
│   │   └── i18n.ts             # 국제화 (다국어)
│   ├── pages/                  # 라우트 페이지
│   │   ├── HomePage.tsx        # 랜딩 페이지 (온보딩 포함)
│   │   ├── SearchPage.tsx      # 메인 검색 인터페이스
│   │   ├── StatsPage.tsx       # 사용 통계 대시보드
│   │   └── TrendingPage.tsx    # 트렌딩 저장소
│   ├── stores/                 # Zustand 상태 스토어
│   │   ├── app-store.ts        # 메인 앱 상태
│   │   ├── compare-store.ts    # 저장소 비교 상태
│   │   ├── snippet-store.ts    # 코드 스니펫 저장
│   │   └── watch-store.ts      # 저장소 구독/알림 상태
│   └── types/                  # TypeScript 타입 정의
├── src-tauri/                  # Rust 백엔드
│   ├── src/                    # Tauri 커맨드, SQLite 연산
│   ├── capabilities/           # Tauri 권한 설정
│   ├── icons/                  # 앱 아이콘 (ico, icns, png)
│   ├── tauri.conf.json         # Tauri 설정 파일
│   ├── Cargo.toml              # Rust 의존성
│   └── Cargo.lock              # Rust 의존성 잠금 파일
├── public/                     # 정적 에셋
├── PRD/                        # 제품 기획 문서
├── package.json                # Node.js 의존성 & 스크립트
├── vite.config.ts              # Vite 빌드 설정 (포트 7719)
├── tsconfig.json               # TypeScript 설정
└── LICENSE                     # MIT 라이선스
```

---

## 개발

### 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Vite 개발 서버만 시작 (프론트엔드: `http://127.0.0.1:7719`) |
| `npm run build` | 프론트엔드 프로덕션 빌드 |
| `npm run tauri:dev` | Tauri 앱 전체를 개발 모드로 실행 |
| `npm run tauri:build` | 프로덕션 설치 파일 빌드 (.msi + .exe) |
| `npm run lint` | ESLint 코드 검사 |
| `npm run preview` | 프로덕션 빌드 로컬 미리보기 |

### 개발 단계

| 단계 | 기능 | 상태 |
|------|------|------|
| Phase 1 (MVP) | AI 검색, AI 요약, 탭, 검색 히스토리, 단축키, 다크모드, 설정, SQLite, GitHub 인증 | 핵심 기능 동작* |
| Phase 2 | 코드 Q&A, 북마크, 컬렉션, 건강도 분석, 비교, 스마트 폴더, 코드 뷰어, 고급 필터 | 대부분 동작, 일부 부분 구현* |
| Phase 3 | Ollama 로컬 AI, 오프라인 모드, 트렌딩 대시보드, 내보내기, 자동 업데이트, 캐시 전략, 벤치마크 | 핵심 기능 동작, 일부 미구현* |

\* GitHub 인증은 OAuth App이 아닌 Personal Access Token 방식으로 동작합니다. 코드 Q&A는 벡터 검색(RAG) 없이 README·파일 목록 기반으로 동작합니다. 스마트 추천 엔진과 자동 업데이트는 아직 구현되지 않았습니다. (2026-07-20 코드 감사 기준)

---

## 보안

| 항목 | 처리 방법 |
|------|-----------|
| API 키 저장 | OS 키체인(Windows Credential Manager 등)에 저장 -- DB나 브라우저 저장소에는 저장하지 않음 |
| 데이터 전송 | API 키는 해당 제공자의 공식 API 엔드포인트에만 전송 |
| GitHub 토큰 | 동일하게 OS 키체인에 저장; GitHub API 요청에만 사용 |
| 원격 측정 | 없음. 분석이나 추적 제로. 모든 데이터는 내 컴퓨터에만 저장. |
| 오프라인 프라이버시 | Ollama 사용 시 네트워크 요청 완전 차단 |
| 소스 코드 | 완전 오픈소스 -- 직접 검증 가능 |

---

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| 앱이 시작되지 않음 | WebView2가 설치되어 있는지 확인 (Windows 10 1803+ 및 Windows 11에는 기본 설치) |
| 검색 결과가 없음 | 인터넷 연결 확인; 요청 제한 시 설정에서 GitHub 토큰 확인 |
| AI 기능이 작동하지 않음 | 설정에서 API 키가 올바른지 확인; 선택한 AI 제공자 점검 |
| Ollama에 연결 안 됨 | Ollama가 로컬에서 실행 중인지 확인 (`ollama serve`), 모델이 다운로드되었는지 확인 |
| Windows에서 빌드 실패 | Visual Studio Build Tools 2022에서 "C++를 사용한 데스크톱 개발" 워크로드 설치 |
| 첫 빌드가 매우 느림 | 정상입니다 -- Rust 컴파일이 첫 실행 시 5~10분 소요; 이후 빌드는 빠름 |
| SmartScreen 경고 | "추가 정보"를 클릭한 후 "실행" (개발 중 서명되지 않은 앱) |

---

## 기여하기

기여를 환영합니다! 시작하는 방법:

1. 저장소를 Fork합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 작성하고 충분히 테스트합니다
4. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
5. 브랜치에 Push합니다 (`git push origin feature/amazing-feature`)
6. Pull Request를 생성합니다

기존 코드 스타일을 따르고 적절한 타입 정의를 포함해주세요.

---

## 라이선스

```
MIT License

Copyright (c) 2026 SoDam AI Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

전체 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 지원

문제가 발생하거나 질문이 있으면 [GitHub Issues](https://github.com/sodam-ai/github-ai-explorer/issues)에 등록해주세요.

---

<p align="center">
  <a href="https://github.com/sodam-ai">SoDam AI Studio</a>에서 정성껏 만들었습니다
</p>
