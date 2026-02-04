import { Link } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  posterUrl: string;
  period?: string;
  area?: string;
  badge?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 21s-7-4.6-9.4-8.7C.6 8.9 2.6 6 5.8 6c1.7 0 3.1.9 4.2 2 1.1-1.1 2.5-2 4.2-2 3.2 0 5.2 2.9 3.2 6.3C19 16.4 12 21 12 21z" />
    </svg>
  );
}

export default function ShowCardV2({
  id,
  title,
  posterUrl,
  period,
  area,
  badge,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const canFavorite = typeof onToggleFavorite === "function";

  return (
    <Link
      to={`/concerts/${id}`}
      className={[
        "group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        "dark:border-neutral-800 dark:bg-neutral-900",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
      ].join(" ")}
      aria-label={`${title} 상세 보기`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-neutral-800">
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {badge ? (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur dark:bg-neutral-900/80 dark:text-slate-50">
            {badge}
          </div>
        ) : null}

        {/* 즐겨찾기 버튼 */}
        {canFavorite ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(id);
            }}
            className={[
              "absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full",
              "bg-white/90 text-slate-900 shadow-md backdrop-blur transition",
              "hover:scale-105",
              "dark:bg-neutral-900/80 dark:text-slate-50",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
            ].join(" ")}
            aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          >
            <HeartIcon filled={isFavorite} />
          </button>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-white drop-shadow">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-4">
        {period ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">{period}</p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">일정 정보 없음</p>
        )}
        {area ? (
          <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{area}</p>
        ) : null}
      </div>
    </Link>
  );
}
