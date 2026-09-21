# 새벽 감성

늦은 시간에도 갈 수 있는 24시 카페만 모아 보여주는 지도입니다. cafe-24를 기능 기준으로 새로 만들었고, 데이터와 화면은 이번 Firebase 프로젝트에 맞춰 다시 잡았습니다.

## 로컬 실행

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local`에 Firebase, 네이버맵, 관리자 UID를 넣습니다. 키가 없어도 UI 미리보기(목 매장)는 열립니다.

## Firestore 구조

테이블/인터넷/단체석은 수집이 어려워 빼 두었습니다. 주차·화장실은 유지하고, 이후 구글맵 연동을 위해 `googlePlaceId`를 남겨 두었습니다.

### `stores/{id}`

- `name`, `type` (`일반` | `무인`)
- `address`, `latitude`, `longitude`
- `phone`
- `parking` (`가능` | `불가` | `""`)
- `toilet` (`있음` | `없음` | `""`)
- `googlePlaceId?`
- `createdAt`, `updatedAt` (epoch ms)

사진: Storage `stores/{id}/...`

### `reports/{id}`

매장과 같은 핵심 필드 + `additional`, `status` (`pending` | `approved` | `rejected`), `createdAt`

### `users/{uid}`

`name`, `email`, `uid`, `favorites: string[]`

### `admins/{uid}`

문서가 있으면 관리자입니다. Firebase 콘솔에서 본인 Google UID로 빈 문서를 만들어 주세요.

### `meta/update`

`ymd`: 마지막 매장 수정일

규칙 파일은 `firebase/firestore.rules`, `firebase/storage.rules`입니다.
