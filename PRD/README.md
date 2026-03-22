# GitHub AI Explorer -- 디자인 문서

> Show Me The PRD로 생성됨 (2026-03-23)
> 최종 보완: 2026-03-23 (미결 사항 해결, 기능 강화, 와이어프레임 추가)

## 문서 구성

| 문서 | 내용 | 언제 읽나 |
|------|------|----------|
| [01_PRD.md](./01_PRD.md) | 뭘 만드는지, 누가 쓰는지, 핵심 기능 16개 | 프로젝트 시작 전 |
| [02_DATA_MODEL.md](./02_DATA_MODEL.md) | 데이터 구조 (11개 테이블) | DB 설계할 때 |
| [03_PHASES.md](./03_PHASES.md) | 3단계 개발 계획 (총 28개 기능) | 개발 순서 정할 때 |
| [04_PROJECT_SPEC.md](./04_PROJECT_SPEC.md) | 기술 스택 + AI 규칙 | AI에게 코드 시킬 때마다 |
| [05_WIREFRAMES.md](./05_WIREFRAMES.md) | UI 와이어프레임 8개 화면 + 단축키 | UI 구현할 때 |

## 제품 요약

**GitHub AI Explorer**는 GitHub 저장소/코드/이슈를 AI로 자연어 검색하고, 코드를 질문하고, 즐겨찾기로 관리하는 **데스크톱 앱**(Tauri + React + TypeScript)입니다.

### 핵심 기능 (16개, 3 Phase)

**Phase 1 (MVP - 11개)**
1. AI 시맨틱 통합 검색 (저장소+코드+이슈)
2. 검색 결과 AI 요약
3. 자연어 코드 Q&A (멀티파일 RAG)
4. 로컬 AI 지원 (Ollama, 오프라인)
5. 북마크 & 컬렉션 관리
6. 검색 히스토리
7. 키보드 단축키 + 커맨드 팔레트
8. GitHub OAuth 로그인
9. SQLite 로컬 DB
10. 설정 화면
11. 다크/라이트 모드

**Phase 2 (확장 - 9개)**
12. 저장소 건강도 분석
13. 유사 저장소 비교
14. 컬렉션 스마트 폴더
15. 벡터 임베딩 캐시
16. 코드 스니펫 뷰어
17. 고급 필터
18. AI 대화 기록
19. (기존 기능 강화)
20. (통합 테스트)

**Phase 3 (고도화 - 8개)**
21. 스마트 추천 엔진
22. 트렌딩 대시보드
23. 오프라인 모드
24. AI 모델 선택 UI
25. 내보내기/가져오기
26. 성능 최적화
27. 자동 업데이트
28. (기존 기능 강화)

### 기술 스택
Tauri 2.0 | React 19 | TypeScript | shadcn/ui | Tailwind | Zustand | SQLite | sqlite-vss | Vite

### 지원 OS
Windows 10+ | macOS 12+ | Ubuntu 22.04+

## 다음 단계

Phase 1을 시작하려면 [03_PHASES.md](./03_PHASES.md)의 **"Phase 1 시작 프롬프트"**를 복사해서 AI에게 붙여넣으세요.

## 결정 사항 종합 (10/10 완료)

- [x] 클라우드 AI: **OpenAI + Anthropic 둘 다 지원**
- [x] GitHub 인증: **OAuth App**
- [x] 임베딩 저장 용량: **제한 없음**
- [x] Ollama 모델: **사용자 선택** (설치된 모델 자동 감지)
- [x] 벡터 차원 수: **모델별 자동 처리**
- [x] 캐시 만료: **7일 자동 갱신 + 수동 새로고침**
- [x] 대화 보관: **무제한**
- [x] 자동 업데이트: **GitHub Releases**
- [x] 앱 아이콘: **돋보기 + GitHub 로고**
- [x] 지원 OS: **Win10+ / macOS12+ / Ubuntu22.04+**
