// src/pages/mypage/SupportSection.tsx
import SupportInbox from "./SupportInbox";

type SupportItem = {
  id: string;
  title: string;
  body: string;
  date?: string;
};

const SUPPORT_ITEMS: SupportItem[] = [
  {
    id: "faq-001",
    title: "회원가입/로그인이 되지 않습니다.",
    body:
      "이메일과 비밀번호를 다시 확인해 주세요. 브라우저 캐시 문제일 수 있으므로 시크릿 모드로 재시도해 주세요. 문제가 지속되면 고객지원에서 문의 내용을 남겨 주시면 확인하겠습니다.",
    date: "상시",
  },
  {
    id: "faq-002",
    title: "예매 내역은 어디에서 확인할 수 있나요?",
    body:
      "마이페이지의 '예매 내역'에서 확인할 수 있습니다. 예매 완료 시 저장된 내역이 해당 화면에 표시됩니다.",
    date: "상시",
  },
  {
    id: "faq-003",
    title: "환불/취소는 어떻게 하나요?",
    body:
      "현재 버전에서는 예매 내역에서 개별 내역 삭제로 취소 처리할 수 있습니다. 실제 환불/취소 정책은 상용 연동 시 반영됩니다.",
    date: "상시",
  },
  {
    id: "faq-004",
    title: "공연 정보가 정확하지 않은 것 같습니다.",
    body:
      "공연 정보는 제공 API 및 수집 데이터에 따라 달라질 수 있습니다. 공연 상세 페이지의 공연명, 장소, 기간, 그리고 문제로 보이는 항목을 알려 주시면 점검하겠습니다.",
    date: "상시",
  },
  {
    id: "contact-001",
    title: "문의 방법",
    body:
      "문의가 필요하면 이메일 또는 GitHub Issue로 남겨 주세요.\n- 이메일: stagebridge.support@example.com\n- GitHub: 프로젝트 저장소 Issues 탭\n(포트폴리오 버전에서는 실제 고객지원 티켓 시스템을 연동하지 않습니다.)",
    date: "안내",
  },
];

export default function SupportSection() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
          고객 지원
        </p>
        <p className="mt-1 text-xs sb-text-muted">
          자주 묻는 질문을 확인하고, 문의 방법을 확인할 수 있습니다.
        </p>
      </div>

      <SupportInbox items={SUPPORT_ITEMS} />
    </div>
  );
}
