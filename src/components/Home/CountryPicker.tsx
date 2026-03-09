import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Country = "KR" | "JP";

export default function CountryPicker() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onPick = (country: Country) => {
    const qs = new URLSearchParams();
    qs.set("country", country);
    qs.set("tab", "all");
    qs.set("page", "1");
    navigate(`/search?${qs.toString()}`);
  };

  // ✅ 공통 카드 베이스
  const cardBase =
    "group relative overflow-hidden rounded-2xl border p-8 text-left transition focus:outline-none focus-visible:ring-2 sb-hover-lift";

  // ✅ 라이트 모드 카드
  const cardLight =
    "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-sky-500";

  // ✅ 다크 모드 카드(피그마 톤)
  const cardDark =
    "dark:border-white/10 dark:bg-[#121924] dark:shadow-none dark:hover:bg-[#151f2d] dark:hover:-translate-y-0.5 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] dark:focus-visible:ring-sky-400";

  return (
    <section className="pt-10">
      <header className="mb-6">
        {/* ✅ 다크에서 제목이 안 보이는 문제 해결 */}
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t("ui.home.countryPickerTitle")}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          {t("ui.home.countryPickerDescription")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* KR */}
        <button
          type="button"
          onClick={() => onPick("KR")}
          className={`${cardBase} ${cardLight} ${cardDark} sb-animate-rise sb-animate-delay-1`}
          aria-label={t("ui.home.countryPickerKrAria")}
        >
          {/* ✅ 피그마처럼 카드 내부 은은한 그라데이션(배경 패턴 X) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 bg-gradient-to-br from-sky-500/15 via-transparent to-indigo-500/15"
          />

          <div className="relative flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-extrabold text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:text-white dark:ring-white/10">
                KR
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300">
                  KOREA
                </p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {t("ui.home.countryKr")}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition group-hover:translate-x-0.5 dark:text-sky-400">
              {t("ui.home.viewShows")}
            </span>
          </div>
        </button>

        {/* JP */}
        <button
          type="button"
          onClick={() => onPick("JP")}
          className={`${cardBase} ${cardLight} ${cardDark} sb-animate-rise sb-animate-delay-2`}
          aria-label={t("ui.home.countryPickerJpAria")}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 bg-gradient-to-br from-rose-500/15 via-transparent to-fuchsia-500/15"
          />

          <div className="relative flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-extrabold text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:text-white dark:ring-white/10">
                JP
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300">
                  JAPAN
                </p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {t("ui.home.countryJp")}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition group-hover:translate-x-0.5 dark:text-rose-400">
              {t("ui.home.viewShows")}
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
