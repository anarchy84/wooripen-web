// ─────────────────────────────────────────────
// 미디어 매니페스트 헬퍼
// - 이미지 슬롯 컴포넌트(MediaSlot)에서 사용
// - 원본 데이터: lib/media-manifest.json (scripts/image_pipeline/build_manifest.py가 생성)
// ─────────────────────────────────────────────

import manifestJson from './media-manifest.json'

// ── 타입 정의 ───────────────────────────────
export interface MediaManifestItem {
  /** 파일 확장자 (jpg/png/webp/svg 등) — webp_url 이 아닌 원본 */
  ext: string
  /** Supabase Storage 버킷 내부 경로 (ex: "torder/torder-logo-primary-01.png") */
  storage_path: string
  /** 공개 URL (원본) */
  public_url: string
  /** WebP 공개 URL (없을 수 있음) */
  webp_url?: string | null
  /** WebP 실제로 업로드됐는지 */
  webp_available: boolean
}

export interface MediaManifest {
  version: number
  generated_at: string | null
  note?: string
  items: Record<string, MediaManifestItem>
}

// ── 매니페스트 로드 ─────────────────────────
const manifest = manifestJson as MediaManifest

/**
 * 슬롯의 canonical key 생성
 * 예: makeMediaKey("wooripen","scene","hero-cafe","01") → "wooripen-scene-hero-cafe-01"
 *
 * 파일명 규칙 (이미지-파일명-규칙-v1.0.md 준수):
 *   {vendor}-{usage}-{subject}-{number}.{ext}
 */
export function makeMediaKey(
  vendor: string,
  usage: string,
  subject: string,
  number: string | number,
): string {
  const n = typeof number === 'number' ? String(number).padStart(2, '0') : number
  return `${vendor}-${usage}-${subject}-${n}`
}

/**
 * 매니페스트에서 이미지 찾기.
 * 아직 업로드 안 된 이미지는 undefined → MediaSlot에서 플레이스홀더 표시.
 */
export function resolveMedia(key: string): MediaManifestItem | undefined {
  return manifest.items[key]
}

/** 매니페스트에 등록된 전체 키 목록 (디버그용) */
export function getAllMediaKeys(): string[] {
  return Object.keys(manifest.items)
}

/** 매니페스트 메타 (생성 시각 등) */
export function getManifestMeta() {
  return {
    version: manifest.version,
    generated_at: manifest.generated_at,
    total: Object.keys(manifest.items).length,
  }
}
