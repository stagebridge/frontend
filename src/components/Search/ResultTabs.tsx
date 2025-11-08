type Props = {
  active: "all" | "genre" | "region";
  onChange: (v: "all" | "genre" | "region") => void;
  sort: "latest" | "popular" | "priceAsc" | "priceDesc";
  onSortChange: (s: Props["sort"]) => void;
};

export default function ResultTabs({ active, onChange, sort, onSortChange }: Props) {
  const Tab = ({ id, label }: { id: Props["active"]; label: string }) => (
    <button
      onClick={() => onChange(id)}
      className={`rounded-full px-3 py-1 text-sm ${
        active === id ? "bg-black text-white dark:bg-white dark:text-black" : "border"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        <Tab id="all" label="전체 랭킹" />
        <Tab id="genre" label="장르별 랭킹" />
        <Tab id="region" label="지역별 랭킹" />
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as any)}
        className="rounded-lg border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <option value="latest">최신순</option>
        <option value="popular">인기순(더미)</option>
        <option value="priceAsc">가격↑</option>
        <option value="priceDesc">가격↓</option>
      </select>
    </div>
  );
}
