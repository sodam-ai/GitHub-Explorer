# GitHub AI Explorer -- 프로젝트 스펙

> AI가 코드를 짤 때 지켜야 할 규칙과 절대 하면 안 되는 것.
> 이 문서를 AI에게 항상 함께 공유하세요.

---

## 기술 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Tauri 2.0 (Rust 백엔드) | 가벼움 (20~40MB RAM), 네이티브 보안, 크로스플랫폼 |
| 프론트엔드 | React 19 + TypeScript | AI 코딩 도구 지원 최고, 커뮤니티 최대 |
| UI 라이브러리 | shadcn/ui + Tailwind CSS | 복사해서 쓰는 컴포넌트, 커스터마이징 자유 |
| 상태 관리 | Zustand | 가볍고 간단, 보일러플레이트 최소 |
| 로컬 DB | SQLite (Tauri 내장) | 파일 하나로 모든 데이터, 백업 간편 |
| 벡터 DB | sqlite-vss | SQLite 확장, 별도 서버 불필요 |
| AI 통신 | OpenAI/Anthropic API 직접 호출 | 중개 서버 불필요, 로컬에서 직접 통신 |
| 빌드 도구 | Vite | 빠른 HMR, Tauri 공식 지원 |
| 인증 | GitHub OAuth 2.0 | GitHub API 접근 + 사용자 인증 동시 해결 |

---

## 프로젝트 구조

```
github-ai-explorer/
├── src/                    # 프론트엔드 (React)
│   ├── components/         # 재사용 가능한 UI 조각
│   │   ├── ui/             # shadcn/ui 컴포넌트
│   │   ├── search/         # 검색 관련 컴포넌트
│   │   ├── collection/     # 컬렉션 관련 컴포넌트
│   │   └── chat/           # AI 대화 관련 컴포넌트
│   ├── pages/              # 페이지 (라우팅)
│   ├── stores/             # Zustand 상태 관리
│   ├── lib/                # 유틸리티, API 클라이언트
│   ├── types/              # TypeScript 타입 정의
│   └── hooks/              # 커스텀 React 훅
├── src-tauri/              # 백엔드 (Rust)
│   ├── src/
│   │   ├── main.rs         # 엔트리포인트
│   │   ├── commands/       # Tauri 커맨드 (프론트↔백 통신)
│   │   ├── db/             # SQLite 관련
│   │   ├── github/         # GitHub API 클라이언트
│   │   ├── ai/             # AI API 클라이언트
│   │   └── auth/           # OAuth 처리
│   ├── migrations/         # DB 마이그레이션 파일
│   ├── Cargo.toml          # Rust 의존성
│   └── tauri.conf.json     # Tauri 설정
├── public/                 # 정적 파일 (아이콘 등)
├── .env                    # 환경변수 (개발용)
├── package.json            # 프론트엔드 의존성
├── tsconfig.json           # TypeScript 설정
├── tailwind.config.ts      # Tailwind 설정
└── vite.config.ts          # Vite 설정
```

---

## 절대 하지 마 (DO NOT)

> AI에게 코드를 시킬 때 이 목록을 반드시 함께 공유하세요.

- [ ] API 키나 비밀번호를 코드에 직접 쓰지 마 (.env 파일 또는 OS 키체인 사용)
- [ ] GitHub 토큰을 localStorage에 평문으로 저장하지 마 (Tauri secure storage 사용)
- [ ] 기존 DB 스키마를 임의로 변경하지 마 (마이그레이션 파일 추가)
- [ ] 테스트 없이 빌드하지 마
- [ ] 목업/하드코딩 데이터로 완성이라고 하지 마
- [ ] package.json이나 Cargo.toml의 기존 의존성 버전을 임의로 변경하지 마
- [ ] Tauri 커맨드에서 사용자 입력을 검증 없이 쓰지 마 (SQL injection 방지)
- [ ] 벡터 임베딩을 매 검색마다 재생성하지 마 (캐시 활용)
- [ ] GitHub API 호출을 rate limit 없이 마구 하지 마 (throttling 적용)
- [ ] 프론트엔드에서 직접 외부 API를 호출하지 마 (Tauri 커맨드 경유)

---

## 항상 해 (ALWAYS DO)

- [ ] 변경하기 전에 계획을 먼저 보여줘
- [ ] 환경변수는 .env 파일에 저장하고 .gitignore에 추가
- [ ] 에러가 발생하면 사용자에게 친절한 한국어 메시지 표시
- [ ] GitHub API 응답은 로컬 DB에 캐시하여 재요청 최소화
- [ ] Tauri 커맨드는 Result<T, E> 타입으로 에러 처리
- [ ] 프론트엔드 상태는 Zustand store로 관리 (prop drilling 금지)
- [ ] 컴포넌트는 shadcn/ui 기반으로 일관된 디자인 유지
- [ ] TypeScript strict 모드 사용, any 타입 금지

---

## 테스트 방법

```bash
# 프론트엔드 개발 서버
npm run dev

# Tauri 앱 실행 (프론트+백 동시)
npm run tauri dev

# TypeScript 타입 체크
npx tsc --noEmit

# 프론트엔드 빌드 확인
npm run build

# Tauri 앱 빌드 (설치 파일 생성)
npm run tauri build

# Rust 테스트
cd src-tauri && cargo test

# Rust 린트
cd src-tauri && cargo clippy
```

---

## 배포 방법

Tauri 빌드로 플랫폼별 설치 파일 생성:

```bash
# Windows: .msi 설치 파일
npm run tauri build

# 결과물 위치: src-tauri/target/release/bundle/msi/
```

플랫폼별 설치 파일:
- **Windows**: `.msi` (src-tauri/target/release/bundle/msi/)
- **macOS**: `.dmg` (src-tauri/target/release/bundle/dmg/)
- **Linux**: `.deb` / `.AppImage` (src-tauri/target/release/bundle/deb/)

GitHub Releases에 설치 파일 업로드하여 배포.
자동 업데이트: **Tauri updater 플러그인 + GitHub Releases** (앱 시작 시 새 버전 자동 확인).

---

## 환경변수

| 변수명 | 설명 | 어디서 발급 |
|--------|------|------------|
| GITHUB_CLIENT_ID | GitHub OAuth 앱 Client ID | https://github.com/settings/developers |
| GITHUB_CLIENT_SECRET | GitHub OAuth 앱 Client Secret | https://github.com/settings/developers |
| OPENAI_API_KEY | OpenAI API 키 (선택) | https://platform.openai.com/api-keys |
| ANTHROPIC_API_KEY | Anthropic API 키 (선택) | https://console.anthropic.com |
| VITE_APP_NAME | 앱 표시 이름 | 직접 설정 (GitHub AI Explorer) |

> .env 파일에 저장. 절대 GitHub에 올리지 마세요.
> 사용자의 API 키는 앱 내 설정에서 입력받아 OS 키체인에 암호화 저장.

---

## 결정된 사항

- [x] 자동 업데이트 서버: **GitHub Releases** (Tauri updater 플러그인 사용)
- [x] 앱 아이콘: **돋보기 + GitHub 로고** 결합 스타일
- [x] 최소 지원 OS: **Windows 10+ / macOS 12+ / Ubuntu 22.04+**
