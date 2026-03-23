# GitHub AI Explorer

> GitHub 저장소, 코드, 이슈를 AI 자연어로 검색하세요 — 데스크톱에서 바로.

[English](./README.md) | [Japanese (日本語)](./README.ja.md) | [Chinese (中文)](./README.zh.md)

---

## 이게 뭔가요?

**GitHub AI Explorer**는 키워드 대신 일상 언어로 GitHub를 검색할 수 있는 데스크톱 앱입니다.

`react drag drop library stars:>1000` 같은 복잡한 검색 대신:
> "React 드래그앤드롭 라이브러리 중에 스타 많고 최근 업데이트된 것"

이렇게 자연어로 입력하면 AI가 알아서 최적의 결과를 찾아줍니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| AI 검색 | 자연어로 입력하면 저장소, 코드, 이슈에서 스마트하게 결과를 찾아줌 |
| AI 요약 | 검색 결과 상단에 AI가 요약을 생성해줌 |
| 탭 분리 | 결과가 저장소 / 코드 / 이슈 탭으로 정리됨 |
| 북마크 | 마음에 드는 저장소를 컬렉션에 저장 |
| 커맨드 팔레트 | `Ctrl+K`를 누르면 앱 어디서든 빠르게 검색 가능 |
| 다크/라이트 모드 | 다크 모드와 라이트 모드 전환 |
| 로컬 데이터베이스 | 검색 기록과 설정이 내 컴퓨터에 저장됨 |
| GitHub 인증 | GitHub 계정 연결로 API 한도 증가 (시간당 60회 → 5,000회) |
| 설정 화면 | GitHub 토큰과 AI API 키를 한곳에서 관리 |

---

## 스크린샷

> UI 완성 후 스크린샷이 추가될 예정입니다.

---

## 설치 및 실행 방법

### 먼저 필요한 것

시작하기 전에 컴퓨터에 아래 프로그램이 설치되어 있어야 합니다:

| 도구 | 역할 | 설치 방법 |
|------|------|----------|
| **Node.js 20+** | 프론트엔드 실행 | [nodejs.org](https://nodejs.org/) 에서 다운로드 |
| **Rust** | 백엔드 실행 | [rustup.rs](https://rustup.rs/) 에서 설치 |
| **Git** | 코드 관리 | [git-scm.com](https://git-scm.com/) 에서 다운로드 |

### 단계별 설정

**1단계: 프로젝트 다운로드**
```bash
git clone https://github.com/sodam-ai/github-ai-explorer.git
cd github-ai-explorer
```

**2단계: 패키지 설치**
```bash
npm install
```

**3단계: 앱 실행**
```bash
npm run tauri dev
```

> 처음 실행 시 Rust 컴파일 때문에 5~10분 걸립니다. 두 번째부터는 몇 초면 됩니다.

**4단계: API 키 설정**

1. 앱이 열리면 오른쪽 상단 톱니바퀴 아이콘 (설정) 클릭
2. **OpenAI API 키** 입력 ([platform.openai.com/api-keys](https://platform.openai.com/api-keys) 에서 발급)
3. (선택) **GitHub 토큰** 입력으로 API 한도 증가 ([github.com/settings/tokens](https://github.com/settings/tokens) 에서 발급)
4. "저장" 클릭

**5단계: 검색!**

검색창에 아무거나 입력하고 엔터를 누르세요. 예시:
- "React 테이블 라이브러리 정렬 기능 있는 것"
- "Python FastAPI 인증 예제"
- "TypeScript 상태관리 2026"

---

## 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl+K` | 커맨드 팔레트 (빠른 검색) |
| `Ctrl+,` | 설정 열기 |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 데스크톱 프레임워크 | Tauri 2.0 (Rust 백엔드) |
| 프론트엔드 | React 19 + TypeScript |
| 스타일링 | Tailwind CSS 4 |
| 상태 관리 | Zustand |
| 로컬 데이터베이스 | SQLite (rusqlite) |
| AI | OpenAI API (gpt-4o-mini) |
| 빌드 도구 | Vite 8 |
| 아이콘 | Lucide React |

---

## 프로젝트 구조

```
github-ai-explorer/
├── src/                    # 프론트엔드 (React)
│   ├── components/         # UI 컴포넌트
│   ├── pages/              # 페이지 (홈, 검색)
│   ├── stores/             # 상태 관리 (Zustand)
│   ├── lib/                # API 클라이언트 (GitHub, AI, Tauri 브릿지)
│   └── types/              # TypeScript 타입
├── src-tauri/              # 백엔드 (Rust)
│   ├── src/                # Rust 소스 (커맨드, 데이터베이스)
│   └── tauri.conf.json     # Tauri 설정
├── PRD/                    # 디자인 문서 (6개 파일)
└── .env                    # API 키 (GitHub에 업로드되지 않음)
```

---

## 개발 단계

| 단계 | 기능 | 상태 |
|------|------|------|
| Phase 1 (MVP) | AI 검색, AI 요약, 탭, 히스토리, 단축키, 다크모드, 설정, SQLite, GitHub 인증 | **완료** (11/11) |
| Phase 2 | 코드 Q&A, 북마크, 컬렉션, 건강도 분석, 비교, 스마트 폴더, 코드 뷰어, 필터 | **완료** (9/9) |
| Phase 3 | 로컬 AI (Ollama), 오프라인 모드, 트렌딩 대시보드, 내보내기, 자동 업데이트, 캐시 | **완료** (8/8) |

---

## 보안

- API 키는 **내 컴퓨터에만** 로컬 저장됩니다 (SQLite 데이터베이스)
- `.env` 파일은 `.gitignore`에 포함 — **절대 GitHub에 업로드되지 않음**
- GitHub API와 OpenAI API 외에는 어떤 서버에도 데이터를 보내지 않음
- 모든 코드는 오픈 소스 — 직접 확인 가능

---

## 라이선스

Copyright (c) 2026 SoDam AI Studio. All rights reserved.

자세한 내용은 [LICENSE](./LICENSE)를 참조하세요.

---

## 지원

질문이나 버그를 발견하면 [GitHub Issues](https://github.com/sodam-ai/github-ai-explorer/issues)에 등록해주세요.
