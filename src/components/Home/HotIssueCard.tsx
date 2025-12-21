// src/components/Home/HotIssueCard.tsx
import { Link } from "react-router-dom";

export type HotIssueView = {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  imageUrl: string;
};

export default function HotIssueCard({ item }: { item: HotIssueView }) {
  return (
    <Link
      to={`/concerts/${item.id}`}
      className="block shrink-0"
      style={{ width: 238 }}
    >
      {/* ✅ 카드 전체 크기 고정 */}
      <div
        className="overflow-hidden rounded-xl border bg-white shadow-sm"
        style={{ width: 238, height: 261 }}
      >
        {/* ✅ 이미지 영역 (고정 높이) */}
        <div
          className="relative w-full bg-slate-100"
          style={{ height: 160 }}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="px-3 py-2">
          <p className="line-clamp-2 text-sm font-semibold text-slate-900">
            {item.title}
          </p>

          {item.subtitle && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-1">
              {item.subtitle}
            </p>
          )}

          {item.period && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-1">
              {item.period}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
