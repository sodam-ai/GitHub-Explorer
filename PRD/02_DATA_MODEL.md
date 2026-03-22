# GitHub AI Explorer -- 데이터 모델

> 이 문서는 앱에서 다루는 핵심 데이터의 구조를 정의합니다.
> 개발자가 아니어도 이해할 수 있는 "개념적 ERD"입니다.

---

## 전체 구조

```
[Collection] --1:N--> [CollectionItem] --N:1--> [Repository]
                                                     |
                                                     └--1:N--> [Embedding]

[Conversation] --1:N--> [Message]

[SearchHistory] (독립)

[AIProvider] (독립, 설정 데이터)
```

---

## 엔티티 상세

### Repository
GitHub 저장소 정보. 검색 결과로 가져온 저장소 데이터를 로컬에 캐시.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 (자동 생성) | abc-123 | O |
| full_name | 저장소 전체 이름 | vercel/ai | O |
| description | 저장소 설명 | Build AI-powered apps | X |
| stars | 스타 수 | 12500 | O |
| language | 주 사용 언어 | TypeScript | X |
| topics | 토픽 태그들 | ["ai", "react", "sdk"] | X |
| url | GitHub URL | https://github.com/vercel/ai | O |
| readme_snippet | README 앞부분 (미리보기용) | Vercel AI SDK is... | X |
| owner_avatar | 소유자 프로필 이미지 URL | https://avatars... | X |
| last_synced | 마지막 동기화 시간 | 2026-03-23T10:00:00Z | O |
| created_at | 로컬 저장 시간 | 2026-03-23 | O |

### Collection
북마크 폴더. 저장소를 분류하는 상위 그룹.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | col-001 | O |
| name | 폴더 이름 | React 도구들 | O |
| description | 폴더 설명 | 드래그앤드롭, 테이블 관련 | X |
| color | 폴더 색상 | #3B82F6 | X |
| icon | 폴더 아이콘 | folder-star | X |
| created_at | 만든 날짜 | 2026-03-23 | O |

### CollectionItem
컬렉션과 저장소를 연결하는 다리. 메모 추가 가능.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | ci-001 | O |
| collection_id | 어떤 컬렉션에 속하는지 | col-001 | O |
| repository_id | 어떤 저장소인지 | abc-123 | O |
| memo | 내가 남긴 메모 | "성능 좋고 API 깔끔" | X |
| added_at | 추가한 시간 | 2026-03-23 | O |

### Embedding
벡터 임베딩 캐시. AI 시맨틱 검색을 위해 저장소 내용을 벡터로 변환한 것.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | emb-001 | O |
| repository_id | 어떤 저장소의 임베딩인지 | abc-123 | O |
| content | 원본 텍스트 (README, 코드 등) | "export function useChat..." | O |
| vector | 벡터 값 (숫자 배열) | [0.12, -0.34, ...] | O |
| chunk_type | 어떤 종류의 텍스트인지 | readme / code / issue | O |
| created_at | 생성 시간 | 2026-03-23 | O |

### Conversation
AI 대화 세션. 특정 저장소에 대한 질문을 그룹화.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | conv-001 | O |
| title | 대화 제목 (자동 생성) | vercel/ai 코드 분석 | O |
| repository_id | 관련 저장소 (없을 수 있음) | abc-123 | X |
| created_at | 시작 시간 | 2026-03-23 | O |

### Message
대화 안의 개별 메시지.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | msg-001 | O |
| conversation_id | 어떤 대화에 속하는지 | conv-001 | O |
| role | 누가 보냈는지 | user / assistant | O |
| content | 메시지 내용 | "이 프로젝트 인증 어떻게 돼?" | O |
| code_refs | 참조한 코드 파일/라인 | ["src/auth.ts:L10-L25"] | X |
| created_at | 보낸 시간 | 2026-03-23T10:05:00Z | O |

### SearchHistory
검색 기록. 이전 검색을 다시 실행하거나 트렌드를 파악.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | sh-001 | O |
| query | 검색 쿼리 | React 드래그앤드롭 라이브러리 | O |
| result_count | 결과 수 | 15 | O |
| filters | 적용한 필터 | {"language": "TypeScript"} | X |
| searched_at | 검색 시간 | 2026-03-23T09:30:00Z | O |

### AIProvider
AI 제공자 설정. 클라우드와 로컬 AI를 관리.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | ai-001 | O |
| name | 표시 이름 | OpenAI GPT-4 | O |
| type | 유형 | cloud / local | O |
| model | 모델 이름 | gpt-4o / llama3 | O |
| endpoint | API 엔드포인트 | https://api.openai.com | O |
| api_key | API 키 (암호화 저장) | sk-... | X |
| is_default | 기본 제공자인지 | true / false | O |

### SmartFolder (Phase 2)
자동 분류 규칙. 조건에 맞는 저장소를 자동으로 컬렉션에 추가.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | sf-001 | O |
| collection_id | 연결된 컬렉션 | col-001 | O |
| rules | 자동 분류 조건 (JSON) | {"language": "TypeScript", "min_stars": 500} | O |
| is_active | 규칙 활성화 여부 | true / false | O |
| created_at | 생성 시간 | 2026-03-23 | O |

### UserPreference (Phase 3)
사용자 행동 패턴 기록. 스마트 추천 엔진의 학습 데이터.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | up-001 | O |
| action_type | 행동 유형 | search / bookmark / view / compare | O |
| target_id | 대상 (저장소 등) | abc-123 | X |
| metadata | 추가 정보 (JSON) | {"query": "React table", "language": "TypeScript"} | X |
| created_at | 행동 시간 | 2026-03-23T10:00:00Z | O |

### TrendingSnapshot (Phase 3)
GitHub 트렌딩 스냅샷. 매일 저장하여 트렌드 변화 추적.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 | ts-001 | O |
| date | 스냅샷 날짜 | 2026-03-23 | O |
| category | 분류 | daily / weekly / language | O |
| repositories | 트렌딩 저장소 목록 (JSON) | [{"full_name": "vercel/ai", "stars_today": 150}] | O |
| ai_summary | AI 요약 | "오늘은 AI 에이전트 프레임워크가..." | X |

---

## 관계 정리

- Collection 1개에 여러 CollectionItem이 포함됨 (폴더 안에 여러 저장소)
- Collection 1개에 SmartFolder 규칙 1개가 연결될 수 있음 (자동 분류)
- Repository 1개가 여러 CollectionItem에 포함될 수 있음 (한 저장소가 여러 폴더에)
- Repository 1개에 여러 Embedding이 연결됨 (README, 코드, 이슈별 벡터)
- Repository에 health_score 필드 추가 (Phase 2, 건강도 점수)
- Conversation 1개에 여러 Message가 포함됨 (대화 안의 질문/답변)
- Conversation은 선택적으로 Repository 1개와 연결됨
- UserPreference는 독립 테이블 (행동 로그)
- TrendingSnapshot은 독립 테이블 (일별 스냅샷)

---

## 왜 이 구조인가

- **확장성**: Phase 2에서 SmartFolder/건강도, Phase 3에서 추천/트렌딩을 추가해도 기존 테이블 구조가 변하지 않음. 새 테이블만 추가하면 됨
- **단순성**: 개인 사용이므로 User 테이블 불필요. 모든 데이터가 로컬 SQLite 한 파일에 저장되어 백업 간편
- **성능**: Embedding을 별도 테이블로 분리하여 벡터 검색 성능 최적화. sqlite-vss 확장으로 로컬 벡터 검색 지원
- **학습**: UserPreference를 별도 테이블로 두어 추천 엔진이 검색/북마크 패턴을 효율적으로 분석 가능

---

## 결정된 사항

- [x] Embedding 벡터 차원 수: **모델별 자동 처리** (OpenAI=1536, Ollama=모델별 상이). DB 스키마에서 vector 컬럼은 가변 길이로 설계
- [x] Repository 캐시 만료 정책: **7일 자동 갱신 + 수동 새로고침** (last_synced 기준 7일 경과 시 백그라운드 갱신)
- [x] 대화 기록 보관 기간: **무제한** (로컬 SQLite 저장, 사용자가 수동 삭제 가능)
