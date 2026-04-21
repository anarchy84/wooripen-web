# 이미지 인벤토리 & 매핑표 (v1 · 2026-04-20)

구글드라이브 "홈페이지에 넣을 각종 이미지" 폴더 기준.
분류 규칙: `{vendor}-{usage}-{subject}-{variant}.{ext}`
저장: Supabase Storage `media/{vendor}/{usage}/...`

---

## 1. 토스플레이스 (vendor=`tossplace`) — 약 50장

| 원본 파일명 (패턴) | 개수 | 용도 | 새 파일명 규칙 | 홈페이지 활용처 |
|---|---|---|---|---|
| logo-place*.png (mono/reverse/simple 포함) | 11 | logo | `tossplace-logo-{variant}.png` | 제품 카드, 파트너 섹션, 푸터 |
| android_pos_*.png | 다수 | product | `tossplace-product-android-pos-{NN}.png` | 패키지 페이지 제품 컷 |
| place_pc_pos.png | 1 | product | `tossplace-product-pc-pos.png` | 패키지 페이지 제품 컷 |
| place-2024-brandcut-*.jpg | 12 | lifestyle | `tossplace-lifestyle-{subject}-{NN}.jpg` | 메인 히어로, OG 이미지 |
| place-original-bg-*.jpg | 13 | bg | `tossplace-bg-{subject}-{NN}.jpg` | 섹션 배경, 패럴랙스 |
| place-original-front2-black-no-bg-*.png | 8 | product (누끼) | `tossplace-product-front-{NN}.png` | 비교 이미지, 제품 상세 |
| place-kiosk-mockup-*.png | 1+ | mockup | `tossplace-mockup-kiosk-{NN}.png` | 키오스크 섹션 |
| place-original--printer-receipt-no-bg-*.png | 1 | product | `tossplace-product-printer-{NN}.png` | POS 주변기기 |

**주의**: 일부 원본 16~34MB 고해상도 → 리사이즈 필수(긴 변 2400px, WebP 품질 85).

---

## 2. 티오더 (vendor=`torder`) — 총 38장 (이미지 기준)

### 2-A. 티오더 로고 서브폴더 (8장 + PDF/AI)

| 원본 파일명 | 용도 | 새 파일명 | 활용처 |
|---|---|---|---|
| t'order_Brand_Logo_1.png | logo | `torder-logo-primary-01.png` | 제품 카드 |
| t'order_Brand_Logo_3.png | logo | `torder-logo-primary-02.png` | 대체 버전 |
| t'order_Brand_Logo_mono_1.png | logo | `torder-logo-mono-01.png` | 다크/단색 배경 |
| t'order_Brand_Logo_mono_2.png | logo | `torder-logo-mono-02.png` | 다크/단색 배경 |
| t'order_Brand_app-icon_512_512_1.png | icon | `torder-icon-app-01.png` | 앱 다운로드 섹션 |
| t'order_Brand_app-icon_512_512_2.png | icon | `torder-icon-app-02.png` | 앱 다운로드 섹션 |
| t'order_Brand_app-icon_512_512_3.png | icon | `torder-icon-app-03.png` | 앱 다운로드 섹션 |
| t'order_Brand_Logo_RGB.ai | (원본 보존) | Drive에만 보관 | 원본 |
| f4d29127-...pdf | (브랜드 가이드 추정) | Drive에만 보관 | 참고용 |
| KakaoTalk_20260112_152913532_*.png (3) | **중복/대체** | 채택 보류 | t'order_Brand_* 우선 |

### 2-B. 티오더 거치대 이미지 서브폴더 (13장)

| 원본 파일명 | 용도 | 새 파일명 | 활용처 |
|---|---|---|---|
| main-design-bnr1.jpg | lifestyle | `torder-lifestyle-banner-01.jpg` | 티오더 페이지 hero |
| main-design-bnr2.jpg | lifestyle | `torder-lifestyle-banner-02.jpg` | 기능 섹션 배경 |
| main-design-bnr3.jpg | lifestyle | `torder-lifestyle-banner-03.jpg` | 기능 섹션 배경 |
| main-design-bnr4.jpg | lifestyle | `torder-lifestyle-banner-04.jpg` | 기능 섹션 배경 |
| main-design-bnr7 (1).jpg | lifestyle | `torder-lifestyle-banner-07.jpg` | 기능 섹션 배경 |
| main-design-bnr9.jpg | lifestyle | `torder-lifestyle-banner-09.jpg` | 기능 섹션 배경 |
| main-design-bnr10.jpg | lifestyle | `torder-lifestyle-banner-10.jpg` | 기능 섹션 배경 |
| main-design-bnr11.jpg | lifestyle | `torder-lifestyle-banner-11.jpg` | 기능 섹션 배경 |
| torder_BBQ-0.png | case | `torder-case-bbq-01.png` | 도입 사례 섹션 |
| torder_craft-hans-0.png | case | `torder-case-craft-hans-01.png` | 도입 사례 섹션 |
| torder_forest-0.png | case | `torder-case-forest-01.png` | 도입 사례 섹션 |
| torder_mattna-0.png | case | `torder-case-mattna-01.png` | 도입 사례 섹션 |
| torder_thehago-0.png | case | `torder-case-thehago-01.png` | 도입 사례 섹션 |

**참고**: `bnr5, 6, 8` 누락. 필요하면 티오더 본사에 추가 요청.
**제안**: `case`는 기존 용도 분류에 추가 → **고객사/도입 사례 이미지 전용**.

### 2-C. 상품소개 최상위 (14장 + PDF)

| 원본 파일명 | 용도 | 새 파일명 | 활용처 |
|---|---|---|---|
| 티오더_서비스소개서_채널영업팀_2025-05-15.pdf | brochure | `torder-brochure-service-2025-05.pdf` | 자료실 다운로드 |
| 홍보물_티오더01.png | lifestyle | `torder-lifestyle-promo-01.png` | 소셜/블로그 |
| 홍보물_티오더02.png | lifestyle | `torder-lifestyle-promo-02.png` | 소셜/블로그 |
| table-order-section4-fix-pre.png | mockup | `torder-mockup-tablet-fixed.png` | 거치대 섹션 (고정형) |
| table-order-section4-move-pre.png | mockup | `torder-mockup-tablet-mobile.png` | 거치대 섹션 (이동형) |
| KakaoTalk_20260413_114428895_01~09.png + _.png | **원본 촬영 추정** | 각 파일 내용 확인 후 분류 | 대부분 lifestyle/product로 재분류 필요 |

→ **KakaoTalk 파일 10장은 한 번 썸네일 보고 대웅이 분류 확정 필요**. 용량 격차(640KB~9.4MB)로 봐서 연출컷·매장컷·디테일컷 혼재 가능성.

### 2-D. AI 광고 소재 (12장) — **마케팅 전용, 제품 페이지 X**

| 원본 파일명 | 용도 | 새 파일명 | 활용처 |
|---|---|---|---|
| 이_이미지에_있는_*.png (5) | ad-creative | `torder-ad-visual-{01~05}.png` | 광고 소재 (어드민 X) |
| 이_제품은_테이블_*.png (5) | ad-creative | `torder-ad-product-{01~05}.png` | 광고 소재 (어드민 X) |
| 제목을 입력해주세요. (6).png, (7).png | ad-creative | `torder-ad-untitled-{06,07}.png` | 광고 소재 (어드민 X) |

→ **AI 생성물**이라 홈페이지 제품/브랜드 이미지로 쓰는 건 비추. 광고 전용으로만 쓰고, Supabase에 올리지 말고 별도 광고 아카이브(구글드라이브)에 남겨두는 게 깔끔.

---

## 3. 신규 용도 추가 제안

기존 8개 용도(logo/product/lifestyle/bg/mockup/icon/diagram/thumb)에 2개 추가:

- `case` — 고객사/도입 사례 이미지 (브랜드 로고와 연관)
- `brochure` — 서비스 소개서 PDF 등 다운로드 자료

`ad-creative`는 등록 **안 함** (광고 전용, 사이트 리소스 아님).

---

## 4. 최종 용도 요약 (10개)

| 코드 | 설명 | Storage 경로 |
|---|---|---|
| logo | 로고 | `media/{vendor}/logo/` |
| product | 제품 단독컷 (누끼/투명배경 포함) | `media/{vendor}/product/` |
| lifestyle | 연출/홍보/배너컷 (인물·매장 포함) | `media/{vendor}/lifestyle/` |
| bg | 배경/풀샷 | `media/{vendor}/bg/` |
| mockup | 태블릿/키오스크/PC 화면 목업 | `media/{vendor}/mockup/` |
| icon | 기능 아이콘, 앱 아이콘 | `media/{vendor}/icon/` |
| diagram | 설치도·시스템 구성도 | `media/{vendor}/diagram/` |
| thumb | 썸네일 | `media/{vendor}/thumb/` |
| **case** 🆕 | 고객사 도입 사례 | `media/{vendor}/case/` |
| **brochure** 🆕 | 자료실 PDF | `media/{vendor}/brochure/` |

---

## 5. 수량 서머리

| 벤더 | 실제 사용 예상 | 원본만 보존 | 총 |
|---|---|---|---|
| tossplace | ~50 | - | 50 |
| torder | 21 (로고7 + 거치대13 + 제품소개14에서 핵심 5~8 + AI 광고 0) + 브로셔1 | AI 광고 12 + 중복 3 + ai원본 1 | 38+ |
| **합계** | **~70장** | **~16장** | |

---

## 6. 다음 스텝 (대웅 OK 받을 것)

1. 신규 용도 2개(`case`, `brochure`) 추가 확정
2. KakaoTalk_20260413_114428895_*.png 10장 — 썸네일 보고 분류 확정 필요 (대웅 수동 검토)
3. AI 광고 소재 12장 — 사이트 업로드 **제외** 확정
4. 위 매핑표대로 업로드 파이프라인 스크립트 작성 진행

업로드 파이프라인 순서:
```
구글드라이브 수동 다운로드 → 로컬 staging/
→ 파이썬 스크립트 실행 (이름 변경 + sharp 리사이즈 + WebP 생성)
→ Supabase Storage 업로드 (media 버킷)
→ 공개 URL CSV 출력
→ 어드민에서 각 제품/섹션에 URL 꽂기 (수동 검수)
```
