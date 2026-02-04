import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Country = "KR" | "JP";

type Props = {
  /** 선택된 국가를 외부에서 제어하는 경우(옵션) */
  value?: Country;
  /** 국가 변경 콜백(옵션) */
  onChange?: (country: Country) => void;
  /** query string(country=KR|JP)를 함께 관리할지 여부(기본 true) */
  syncQuery?: boolean;
  className?: string;
  [key: string]: unknown;
};

export default function CountryPickerV2({
  value,
  onChange,
  syncQuery = true,
  className = "",
}: Props) {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();

  const queryCountry = useMemo(() => {
    const raw = (params.get("country") ?? "").toUpperCase();
    return raw === "JP" ? "JP" : "KR";
  }, [params]);

  const selected: Country = value ?? (syncQuery ? queryCountry : "KR");

  const setCountry = (country: Country) => {
    onChange?.(country);

    if (!syncQuery) return;

    const next = new URLSearchParams(params);
    next.set("country", country);
    setParams(next, { replace: true });
  };

  const base =
    "inline-flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-sm ring-1 ring-black/5 backdrop-blur";

  const pillBase =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all";
  const pillActive = "bg-black text-white shadow";
  const pillIdle = "text-black/70 hover:bg-black/5";

  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-black/60">
            {t("home.country", "Country")}
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-black">
            {t("home.title", "StageBridge")}
          </h2>
        </div>

        <div className={base} role="tablist" aria-label={t("home.country", "Country")}>
          <button
            type="button"
            className={`${pillBase} ${selected === "KR" ? pillActive : pillIdle}`}
            onClick={() => setCountry("KR")}
            role="tab"
            aria-selected={selected === "KR"}
          >
            <span aria-hidden>🇰🇷</span>
            <span>{t("country.kr", "KR")}</span>
          </button>

          <button
            type="button"
            className={`${pillBase} ${selected === "JP" ? pillActive : pillIdle}`}
            onClick={() => setCountry("JP")}
            role="tab"
            aria-selected={selected === "JP"}
          >
            <span aria-hidden>🇯🇵</span>
            <span>{t("country.jp", "JP")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
