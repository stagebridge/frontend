// src/pages/mypage/ProfileSection.tsx
import { useState } from "react";
import ProfileOverview from "./ProfileOverview";
import ProfilePersonalInfo from "./ProfilePersonalInfo";

type TabKey = "overview" | "personal";

type Props = {
  onProfileChanged?: () => void;
};

export default function ProfileSection({ onProfileChanged }: Props) {
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            tab === "overview"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "sb-btn-outline"
          }`}
        >
          프로필
        </button>

        <button
          type="button"
          onClick={() => setTab("personal")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            tab === "personal"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "sb-btn-outline"
          }`}
        >
          개인정보 수정
        </button>
      </div>

      {tab === "overview" ? (
        <ProfileOverview />
      ) : (
        <ProfilePersonalInfo onChanged={onProfileChanged} />
      )}
    </div>
  );
}
