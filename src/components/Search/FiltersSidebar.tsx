import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GENRES, REGIONS } from "../../constants/ranking";

type Country = "KR" | "JP";

export default function FiltersSidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initial = useMemo(() => {
    const q = searchParams.get("q") ?? "";
    const country = (searchParams.get("country") as Country | null) ?? "KR";
    const genre = searchParams.get("genre") ?? "";
    const region = searchParams.get("region") ?? "";
    return { q, country, genre, region };
  }, [searchParams]);

  const [q, setQ] = useState(initial.q);
  const [country, setCountry] = useState<Country>(initial.country);
  const [genre, setGenre] = useState(initial.genre);
  const [region, setRegion] = useState(initial.region);

  const apply = () => {
    const qs = new URLSearchParams();

    if (q.trim()) qs.set("q", q.trim());
    if (country) qs.set("country", country);
    if (genre) qs.set("genre", genre);
    if (region) qs.set("region", region);

    // ✅ 필터를 쓰는 순간: 랭킹 초기화
    qs.set("tab", "all");
    qs.delete("rankGenre");
    qs.delete("rankRegion");

    qs.set("page", "1");
    navigate(`/search?${qs.toString()}`);
  };

  const reset = () => {
    setQ("");
    setCountry("KR");
    setGenre("");
    setRegion("");

    // ✅ 초기화도 랭킹 초기 상태로
    const qs = new URLSearchParams();
    qs.set("tab", "all");
    qs.set("page", "1");
    navigate(`/search?${qs.toString()}`);
  };

  return (
    <aside className="w-[260px] shrink-0">
      <div className="rounded-2xl border p-4">
        <div className="mb-4">
          <div className="text-sm font-semibold">필터</div>
          <div className="text-xs text-neutral-500">조건을 선택해 결과를 좁힐 수 있습니다.</div>
        </div>

        <div className="space-y-4">
          {/* 국가 */}
          <div>
            <div className="mb-2 text-xs font-medium text-neutral-600">국가</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  country === "KR" ? "bg-black text-white" : ""
                }`}
                onClick={() => setCountry("KR")}
              >
                한국
              </button>
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  country === "JP" ? "bg-black text-white" : ""
                }`}
                onClick={() => setCountry("JP")}
              >
                일본
              </button>
            </div>
          </div>

          {/* 키워드 */}
          <div>
            <div className="mb-2 text-xs font-medium text-neutral-600">키워드</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="공연명, 아티스트, 장소"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* 장르 */}
          <div>
            <div className="mb-2 text-xs font-medium text-neutral-600">장르</div>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">전체</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* 지역 */}
          <div>
            <div className="mb-2 text-xs font-medium text-neutral-600">지역</div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">전체</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* 버튼 */}
          <div className="space-y-2 pt-2">
            <button type="button" className="sb-btn-primary w-full" onClick={apply}>
              적용
            </button>
            <button type="button" className="sb-btn-outline w-full" onClick={reset}>
              초기화
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
