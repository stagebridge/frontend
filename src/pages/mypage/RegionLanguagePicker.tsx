import { RegionLanguage } from "../../types/mypage";

export default function RegionLanguagePicker({
  value,
  onChange,
}: {
  value: RegionLanguage;
  onChange: (v: RegionLanguage) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <select
        className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        value={value.regionKR}
        onChange={(e) => onChange({ ...value, regionKR: e.target.value as RegionLanguage["regionKR"] })}
      >
        <option value="KOREA">KOREA</option>
        <option value="NONE">NONE</option>
      </select>

      <select
        className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        value={value.regionJP}
        onChange={(e) => onChange({ ...value, regionJP: e.target.value as RegionLanguage["regionJP"] })}
      >
        <option value="JAPAN">JAPAN</option>
        <option value="NONE">NONE</option>
      </select>

      <select
        className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        value={value.languagePref}
        onChange={(e) => onChange({ ...value, languagePref: e.target.value as "ko" | "ja" })}
      >
        <option value="ko">한국어</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}
