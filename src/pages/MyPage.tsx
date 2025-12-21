import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SectionCard from "./mypage/SectionCard";
import SidebarNav, { type MyPageSectionKey } from "./mypage/SidebarNav";
import ProfileSection from "./mypage/ProfileSection";
import TicketsSection from "./mypage/TicketsSection";
import SettingsSection from "./mypage/SettingsSection";
import SupportSection from "./mypage/SupportSection";

export default function MyPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState<MyPageSectionKey>("profile");

  const title = useMemo(() => {
    if (active === "profile")
      return {
        t: t("mypage.header.profileTitle"),
        d: t("mypage.header.profileDesc"),
      };
    if (active === "tickets")
      return {
        t: t("mypage.header.ticketsTitle"),
        d: t("mypage.header.ticketsDesc"),
      };
    if (active === "settings")
      return {
        t: t("mypage.header.settingsTitle"),
        d: t("mypage.header.settingsDesc"),
      };
    return {
      t: t("mypage.header.supportTitle"),
      d: t("mypage.header.supportDesc"),
    };
  }, [active, t]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside>
          <SidebarNav active={active} setActive={setActive} />
        </aside>

        <section className="min-w-0">
          <SectionCard title={title.t} description={title.d}>
            {active === "profile" ? (
              <ProfileSection />
            ) : active === "tickets" ? (
              <TicketsSection />
            ) : active === "settings" ? (
              <SettingsSection />
            ) : (
              <SupportSection />
            )}
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
