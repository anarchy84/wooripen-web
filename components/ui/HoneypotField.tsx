// ─────────────────────────────────────────────
// HoneypotField — 봇 필터용 미끼 입력란
//
// 사람에겐 보이지 않고(스크린리더도 건너뜀), 폼을 기계적으로 채우는 봇만
// 값을 넣는다. 값이 차 있으면 /api/consultations 가 저장·CRM 전송 없이
// 성공처럼 응답한다 (봇에게 차단 사실을 알리지 않음).
//
// 상태 배선 불필요 — lib/useConsultation.ts 가 제출 시점에 DOM 에서 직접 읽는다.
// 폼에 이 컴포넌트를 넣기만 하면 된다.
//
// display:none 대신 위치 이동 + aria-hidden 을 쓰는 이유 :
//   요즘 봇은 display:none 필드를 건너뛰는 경우가 있어 탐지율이 떨어진다.
// ─────────────────────────────────────────────

export const HONEYPOT_FIELD_NAME = '_hp_wooripen'

export default function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      <label htmlFor={HONEYPOT_FIELD_NAME}>이 항목은 비워두세요</label>
      <input
        type="text"
        id={HONEYPOT_FIELD_NAME}
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  )
}
