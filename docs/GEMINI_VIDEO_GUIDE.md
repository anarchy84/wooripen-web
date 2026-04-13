# Gemini 영상 생성 → 히어로 섹션 적용 가이드

## 개요
Google Gemini AI로 히어로 섹션용 영상을 생성하고,
WebP 포맷으로 변환하여 우리편 웹사이트에 적용하는 워크플로우입니다.

---

## Step 1: Pinterest에서 레퍼런스 이미지 수집

1. https://pinterest.com 접속
2. 아래 키워드로 검색:
   - "modern office interior cozy"
   - "small business store aesthetic"
   - "korean cafe interior warm"
   - "abstract gradient mesh dark"
3. 마음에 드는 이미지 1장 선택 → 이미지 복사

---

## Step 2: Gemini에서 영상 생성

1. https://gemini.google.com 접속
2. **모델: Gemini Pro** 선택 (빠른 모델 X)
3. Pinterest에서 복사한 이미지 붙여넣기
4. 아래 프롬프트 중 하나 사용:

### 프롬프트 A: 매장 느낌 (추천)
```
이 이미지를 바탕으로, 따뜻한 조명의 소규모 매장 내부가 
천천히 카메라 패닝되는 영상을 16:9 비율로 생성해줘. 
부드러운 움직임으로 5초 정도.
```

### 프롬프트 B: 추상 그라데이션 (모던)
```
이 이미지를 바탕으로, 부드럽게 흘러가는 
추상적 그라데이션 메시 배경 영상을 16:9로 생성해줘. 
색상은 딥 네이비와 블루 톤으로, 천천히 움직이는 느낌.
```

### 프롬프트 C: 그라운드 뷰 회전 (임팩트)
```
이 요소가 중심점을 기준으로 천천히 돌아가는 
16:9 영상을 하나 만들어줘. 배경은 어두운 톤.
```

5. 생성된 영상 다운로드 (MP4)

---

## Step 3: WebP 변환 (터미널)

### ffmpeg 설치 (없을 경우)
```bash
brew install ffmpeg
```

### MP4 → WebP 변환
```bash
cd ~/Claud_Projects/AnarchyContentTeam/wooripen-web/public

# 영상을 WebP 애니메이션으로 변환 (120프레임, 10fps)
ffmpeg -i ~/Downloads/gemini_video.mp4 \
  -vf "scale=1920:-1,fps=10" \
  -loop 0 -quality 80 \
  hero-video.webp

# 또는 단순히 MP4를 public에 복사
cp ~/Downloads/gemini_video.mp4 hero-video.mp4
```

> **참고:** WebP 애니메이션은 파일이 클 수 있어서,
> MP4를 `<video>` 태그로 넣는 것이 성능상 더 좋습니다.

---

## Step 4: 코드에 적용

영상 파일을 `public/hero-video.mp4` 에 넣으면,
홈페이지 히어로에 자동으로 반영됩니다.
(이미 코드에 비디오 슬롯이 준비되어 있음)

---

## 추가 팁

- **Gemini 영상은 약 5~8초** 정도가 적당
- **루프 재생**이 자연스러운 장면을 선택
- **어두운 톤**의 영상이 텍스트 가독성에 유리
- 영상 위에 반투명 오버레이가 자동 적용됨
