import { useMemo, useRef, useState } from "react";
import type { Genre, Region } from "../../types/ticket";


type Props = {
  initKeyword?: string;
  initRegion?: Region;
  initGenre?: Genre;
  initStart?: string; // YYYY-MM-DD
  initEnd?: string;   // YYYY-MM-DD
  onApply: (next: {
    q?: string;
    region?: Region;
    genre?: Genre;
    start?: string;
    end?: string;
  }) => void;
};

const GENRE_OPTIONS: { label: string; value: Genre }[] = [
  { label: "여성 아이돌/그룹", value: "IDOL_FEMALE" },
  { label: "남성 아이돌/그룹", value: "IDOL_MALE" },
  { label: "밴드", value: "BAND" },
  { label: "힙합", value: "HIPHOP" },
  { label: "재즈", value: "JAZZ" },
  { label: "클래식", value: "CLASSIC" },
  { label: "기타", value: "ETC" },
];

export default function FiltersSidebar({
  initKeyword,
  initRegion,
  initGenre,
  initStart,
  initEnd,
  onApply,
}: Props) {
  const [q, setQ] = useState(initKeyword ?? "");
  const [region, setRegion] = useState<Region | undefined>(initRegion);
  const [genre, setGenre] = useState<Genre | undefined>(initGenre);
  const [start, setStart] = useState(initStart ?? "");
  const [end, setEnd] = useState(initEnd ?? "");
  const [dateError, setDateError] = useState<string>(""); // 날짜 유효성 에러

  const endRef = useRef<HTMLInputElement>(null); // 종료일로 포커스 이동용

  const canReset = useMemo(
    () => !!(q || region || genre || start || end),
    [q, region, genre, start, end]
  );

  // 시작일 변경 시: 종료일이 더 이르면 초기화 & 안내
  const handleStartChange = (value: string) => {
    setStart(value);
    if (end && value && end < value) {
      setEnd("");
      setDateError("종료일은 시작일과 같거나 이후여야 합니다.");
      setTimeout(() => endRef.current?.focus(), 0);
    } else {
      setDateError("");
    }
  };

  // 종료일 변경 시: 시작일보다 이전이면 거부
  const handleEndChange = (value: string) => {
    if (start && value && value < start) {
      // 네이티브 피커에서 막더라도, 직접 입력을 대비해 2차 방지
      setDateError("종료일은 시작일과 같거나 이후여야 합니다.");
      // 값은 반영하지 않고 다시 선택 유도
      setTimeout(() => endRef.current?.focus(), 0);
      return;
    }
    setEnd(value);
    setDateError("");
  };

  // 검색 클릭 시 최종 검증
  const handleApply = () => {
    if (start && end && end < start) {
      setDateError("종료일은 시작일과 같거나 이후여야 합니다.");
      endRef.current?.focus();
      return;
    }
    onApply({ q, region, genre, start, end });
  };

  return (
    <aside className="sticky top-20 h-fit w-64 shrink-0 rounded-xl border p-4 overflow-hidden dark:border-neutral-800">
      <div className="space-y-4">
        {/* 키워드 */}
        <div>
          <label className="mb-1 block text-sm font-medium">키워드</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="예: cutie / yokohama"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        {/* 국가 */}
        <div>
          <label className="mb-1 block text-sm font-medium">국가</label>
        <div className="flex gap-2">
            <button
              onClick={() => setRegion(region === "KOREA" ? undefined : "KOREA")}
              className={`rounded-lg border px-3 py-1 text-sm dark:border-neutral-700 ${
                region === "KOREA" ? "bg-black text-white dark:bg-white dark:text-black" : ""
              }`}
            >
              Korea
            </button>
            <button
              onClick={() => setRegion(region === "JAPAN" ? undefined : "JAPAN")}
              className={`rounded-lg border px-3 py-1 text-sm dark:border-neutral-700 ${
                region === "JAPAN" ? "bg-black text-white dark:bg-white dark:text-black" : ""
              }`}
            >
              Japan
            </button>
          </div>
        </div>

        {/* 장르 */}
        <div>
          <label className="mb-1 block text-sm font-medium">장르</label>
          <select
            value={genre ?? ""}
            onChange={(e) => setGenre((e.target.value || undefined) as any)}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">전체</option>
            {GENRE_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* 날짜 (세로 스택: 시작일 → ~ → 종료일) */}
        <div>
          <label className="mb-1 block text-sm font-medium">날짜</label>
          <div className="space-y-2">
            <input
              type="date"
              value={start}
              onChange={(e) => handleStartChange(e.target.value)}
              // 시작/종료 상호 제한
              max={end || undefined}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
            <div className="flex items-center">
              <span className="mx-auto text-sm text-neutral-500">~</span>
            </div>
            <input
              ref={endRef}
              type="date"
              value={end}
              onChange={(e) => handleEndChange(e.target.value)}
              min={start || undefined}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              aria-invalid={!!dateError}
              aria-describedby={dateError ? "date-range-error" : undefined}
            />
            {dateError && (
              <p id="date-range-error" className="text-xs text-red-600">
                {dateError}
              </p>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleApply}
            className="flex-1 rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            검색
          </button>
          <button
            onClick={() => {
              setQ("");
              setRegion(undefined);
              setGenre(undefined);
              setStart("");
              setEnd("");
              setDateError("");
              onApply({ q: "", region: undefined, genre: undefined, start: "", end: "" });
            }}
            className="rounded-lg border px-3 py-2 text-sm dark:border-neutral-700"
            disabled={!canReset}
          >
            초기화
          </button>
        </div>
      </div>
    </aside>
  );
}
