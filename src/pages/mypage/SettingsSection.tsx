import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../../components/Navbar/ThemeToggle";
import RegionLanguagePicker from "./RegionLanguagePicker";
import NotificationRow from "./NotificationRow";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
} from "../../app/storage/mypageStorage";
import type { MySettings } from "../../types/mypage";

type Lang = "ko" | "ja" | "en";

function toLang(v: unknown): Lang {
  return v === "ja" || v === "en" ? v : "ko";
}

export default function SettingsSection() {
  const { i18n, t } = useTranslation();

  const [tick, setTick] = useState(0);

  const settings = useMemo<MySettings>(() => {
    const loaded = loadSettings();
    return loaded ?? defaultSettings();
  }, [tick]);

  const setNext = (next: MySettings) => {
    saveSettings(next);
    setTick((v) => v + 1);
  };

  const currentLang = toLang(i18n.language);

  // ✅ 전역 언어(i18n)와 설정 값이 어긋나면, 전역 언어를 기준으로 settings도 정합성 맞춤
  useEffect(() => {
    const saved = settings.regionLang?.languagePref;
    const savedLang = toLang(saved);

    if (saved && savedLang !== currentLang) {
      setNext({
        ...settings,
        regionLang: {
          ...(settings.regionLang ?? defaultSettings().regionLang!),
          languagePref: currentLang,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang]);

  const regionLang = useMemo(() => {
    const base = settings.regionLang ?? defaultSettings().regionLang!;
    return {
      ...base,
      languagePref: currentLang, // ✅ UI 언어는 전역 언어가 기준
    };
  }, [settings.regionLang, currentLang]);

  return (
    <div className="space-y-6">
      {/* 테마 */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {t("mypage.settings.themeTitle")}
            </p>
            <p className="mt-1 text-xs sb-text-muted">
              {t("mypage.settings.themeDesc")}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* 알림 */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
          {t("mypage.settings.notifyTitle")}
        </p>
        <p className="mt-1 text-xs sb-text-muted">
          {t("mypage.settings.notifyDesc")}
        </p>

        <div className="mt-4 space-y-2">
          <NotificationRow
            title={t("mypage.settings.notifyEmailTitle")}
            desc={t("mypage.settings.notifyEmailDesc")}
            checked={settings.notifications.email}
            onChange={(v) =>
              setNext({
                ...settings,
                notifications: { ...settings.notifications, email: v },
              })
            }
          />

          <NotificationRow
            title={t("mypage.settings.notifySmsTitle")}
            desc={t("mypage.settings.notifySmsDesc")}
            checked={settings.notifications.sms}
            onChange={(v) =>
              setNext({
                ...settings,
                notifications: { ...settings.notifications, sms: v },
              })
            }
          />

          <NotificationRow
            title={t("mypage.settings.notifyMarketingTitle")}
            desc={t("mypage.settings.notifyMarketingDesc")}
            checked={settings.notifications.marketing}
            onChange={(v) =>
              setNext({
                ...settings,
                notifications: { ...settings.notifications, marketing: v },
              })
            }
          />

          <NotificationRow
            title={t("mypage.settings.notifyRemindTitle")}
            desc={t("mypage.settings.notifyRemindDesc")}
            checked={settings.notifications.remindBeforeShow}
            onChange={(v) =>
              setNext({
                ...settings,
                notifications: { ...settings.notifications, remindBeforeShow: v },
              })
            }
          />
        </div>
      </section>

      {/* 지역 및 언어 */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
          {t("mypage.settings.regionLangTitle")}
        </p>
        <p className="mt-1 text-xs sb-text-muted">
          {t("mypage.settings.regionLangDesc")}
        </p>

        <div className="mt-4">
          <RegionLanguagePicker
            value={regionLang}
            onChange={async (v) => {
              const nextLang = toLang(v.languagePref);

              // ✅ 전역 언어 변경(즉시 UI 반영)
              if (nextLang !== currentLang) {
                await i18n.changeLanguage(nextLang);
              }

              // ✅ 설정에도 저장(정합성 유지)
              setNext({
                ...settings,
                regionLang: {
                  ...(settings.regionLang ?? defaultSettings().regionLang!),
                  regionKR: v.regionKR,
                  regionJP: v.regionJP,
                  languagePref: nextLang,
                },
              });
            }}
          />
        </div>
      </section>
    </div>
  );
}
