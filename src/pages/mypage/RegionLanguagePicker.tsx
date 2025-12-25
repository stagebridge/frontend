import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { RegionLanguage } from "../../types/mypage";

type Country = "KOREA" | "JAPAN";
type Lang = "ko" | "ja" | "en";

function toCountry(v: RegionLanguage): Country {
  return v.regionJP === "JAPAN" ? "JAPAN" : "KOREA";
}

function toRegionLanguage(country: Country, languagePref: Lang): RegionLanguage {
  return {
    regionKR: country === "KOREA" ? "KOREA" : "NONE",
    regionJP: country === "JAPAN" ? "JAPAN" : "NONE",
    languagePref,
  };
}

export default function RegionLanguagePicker({
  value,
  onChange,
}: {
  value: RegionLanguage;
  onChange: (v: RegionLanguage) => void;
}) {
  const { t } = useTranslation();

  const country = useMemo(() => toCountry(value), [value]);
  const lang = (value.languagePref ?? "ko") as Lang;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <label className="block text-xs font-semibold sb-text-muted">
          {t("mypage.settings.countryLabel")}
        </label>
        <select
          className="sb-input"
          value={country}
          onChange={(e) => {
            const nextCountry = (e.target.value as Country) || "KOREA";
            onChange(toRegionLanguage(nextCountry, lang));
          }}
          aria-label={t("mypage.settings.countryLabel")}
        >
          <option value="KOREA">{t("country.korea")}</option>
          <option value="JAPAN">{t("country.japan")}</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold sb-text-muted">
          {t("mypage.settings.languageLabel")}
        </label>
        <select
          className="sb-input"
          value={lang}
          onChange={(e) => {
            const nextLang = (e.target.value as Lang) || "ko";
            onChange(toRegionLanguage(country, nextLang));
          }}
          aria-label={t("mypage.settings.languageLabel")}
        >
          <option value="ko">{t("language.ko")}</option>
          <option value="ja">{t("language.ja")}</option>
          <option value="en">{t("language.en")}</option>
        </select>
      </div>
    </div>
  );
}
