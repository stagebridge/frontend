import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n, t } = useTranslation();

  const setLang = async (code: "ko" | "ja" | "en") => {
    await i18n.changeLanguage(code);
  };

  return (
    <footer className="mt-16 border-t bg-white/70 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              StageBridge©2025
            </div>
          </div>

          <nav aria-label={t("footer.siteAria")} className="text-sm">
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li><a className="hover:underline" href="#">{t("footer.about")}</a></li>
              <li><a className="hover:underline" href="#">{t("footer.terms")}</a></li>
              <li><a className="hover:underline" href="#">{t("footer.privacy")}</a></li>
              <li><a className="hover:underline" href="#">{t("footer.support")}</a></li>
            </ul>
          </nav>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div className="text-sm">
              <div className="mb-2 font-medium text-slate-800 dark:text-slate-100">
                {t("footer.sns")}
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  <a className="inline-flex items-center gap-2 hover:underline" href="#">
                    <span aria-hidden>🅕</span> facebook
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 hover:underline" href="#">
                    <span aria-hidden>📸</span> Instagram
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 hover:underline" href="#">
                    <span aria-hidden>▶️</span> Youtube
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-sm">
              <div className="mb-2 font-medium text-slate-800 dark:text-slate-100">
                {t("footer.language")}
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => setLang("ko")}
                    className="hover:underline"
                  >
                    {t("language.ko")}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLang("ja")}
                    className="hover:underline"
                  >
                    {t("language.ja")}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className="hover:underline"
                  >
                    {t("language.en")}
                  </button>
                </li>
              </ul>
            </div>

            <div className="text-sm sm:col-span-1 col-span-2">
              <div className="mb-2 font-medium text-slate-800 dark:text-slate-100">
                {t("footer.contact")}
              </div>
              <a
                className="text-slate-700 hover:underline dark:text-slate-300"
                href="mailto:stagebridge@info.com"
              >
                stagebridge@info.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t pt-4 text-xs text-slate-500 dark:border-neutral-800 dark:text-slate-400 sm:flex-row">
          <p>{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">
              {t("footer.privacySettings")}
            </a>
            <a className="hover:underline" href="#">
              {t("footer.cookie")}
            </a>
            <a className="hover:underline" href="#top">
              {t("footer.toTop")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
