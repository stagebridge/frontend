type Props = {
  page: number;           // 1-base
  total: number;          // 총 개수
  perPage: number;
  onChange: (next: number) => void;
};

export default function Pagination({ page, total, perPage, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const canPrev = page > 1;
  const canNext = page < pages;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
        disabled={!canPrev}
        onClick={() => onChange(page - 1)}
      >
        이전
      </button>
      <span className="px-2 text-sm">
        {page} / {pages}
      </span>
      <button
        className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
        disabled={!canNext}
        onClick={() => onChange(page + 1)}
      >
        다음
      </button>
    </div>
  );
}
