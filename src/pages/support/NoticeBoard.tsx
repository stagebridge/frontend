import SectionCard from "../mypage/SectionCard";

const NOTICES = [
  {
    id: "n1",
    title: "[공지] 시스템 점검 안내",
    date: "2025-12-03",
    body: "12/03(수) 02:00~04:00 점검으로 일부 기능이 제한됩니다.",
  },
  {
    id: "n2",
    title: "[공지] 환불 정책 개정",
    date: "2025-11-20",
    body: "공연 취소/연기 시 자동 환불이 적용되며 카드사 사정에 따라 지연될 수 있습니다.",
  },
];

export default function NoticeBoard() {
  return (
    <SectionCard id="notice" title="공지사항">
      <ul className="divide-y dark:divide-neutral-800">
        {NOTICES.map((n) => (
          <li key={n.id} className="py-3">
            <p className="font-medium">{n.title}</p>
            <p className="text-xs text-neutral-500">{n.date}</p>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              {n.body}
            </p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
