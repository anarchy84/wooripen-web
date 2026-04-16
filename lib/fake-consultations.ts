// 가상 상담 신청 데이터 50건
// 런칭 전 LiveTicker 데모용. 실데이터 전환 시 이 파일은 비활성화됨
// LIVE_TICKER_USE_REAL 환경변수로 전환 제어

const NAMES = [
  '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
  '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍',
]

const CATEGORIES = [
  '인터넷', '결제단말기', 'CCTV', '키오스크', '렌탈', '인터넷+CCTV', '인터넷+단말기', '패키지',
]

const STATUSES = ['pending', 'contacted', 'in_progress', 'completed']

const PHONES_PREFIX = ['010', '010', '010', '010', '011']

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(daysBack: number): string {
  const now = Date.now()
  const past = now - daysBack * 24 * 60 * 60 * 1000
  return new Date(past + Math.random() * (now - past)).toISOString()
}

export interface FakeConsultation {
  id: string
  masked_name: string
  masked_phone: string
  product_category: string
  status: string
  created_at: string
}

// 50건 고정 생성 (매 호출 시 동일 시드 X, 서버 재시작 시 갱신)
let _cache: FakeConsultation[] | null = null

export function getFakeConsultations(): FakeConsultation[] {
  if (_cache) return _cache

  _cache = Array.from({ length: 50 }, (_, i) => ({
    id: `fake-${String(i + 1).padStart(3, '0')}`,
    masked_name: `${rand(NAMES)}**`,
    masked_phone: `${rand(PHONES_PREFIX)}-****-****`,
    product_category: rand(CATEGORIES),
    status: rand(STATUSES),
    created_at: randomDate(14),
  })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return _cache
}
