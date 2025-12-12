import { AlbumItem } from "../../types/mypage";

export default function AlbumShelf({ items }: { items: AlbumItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((it) => (
        <div key={it.id} className="rounded-xl border p-2 dark:border-neutral-800">
          <div className="relative overflow-hidden rounded-lg">
            <img src={it.coverUrl} alt={it.title} className="aspect-[3/4] w-full object-cover" />
            {it.tag && (
              <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                {it.tag}
              </span>
            )}
          </div>
          <div className="mt-2 line-clamp-2 text-sm">{it.title}</div>
        </div>
      ))}
      {/* 빈 슬롯 두 개: 피그마의 '내용/내용' 플레이스홀더 느낌 */}
      <div className="flex items-center justify-center rounded-xl border text-sm text-neutral-400 dark:border-neutral-800">
        내용
      </div>
      <div className="flex items-center justify-center rounded-xl border text-sm text-neutral-400 dark:border-neutral-800">
        내용
      </div>
    </div>
  );
}
