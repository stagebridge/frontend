import { useEffect, useMemo, useState } from "react";
import SidebarNav from "./mypage/SidebarNav";
import SectionCard from "./mypage/SectionCard";
import { useSectionSpy } from "../hooks/useSectionSpy";
import { defaultSettings, loadSettings, saveSettings } from "../app/storage/mypageStorage";
import type { MySettings } from "../types/mypage";

const SECTIONS = [
  { id: "profile", label: "프로필" },
  { id: "favorites", label: "선호 아티스트" },
  { id: "notifications", label: "알림 설정" },
  { id: "privacy", label: "개인정보 공개" },
  { id: "orders", label: "주문/예매 내역" },
  { id: "support", label: "문의/공지" },
];

export default function MyPage() {
  const [data, setData] = useState<MySettings>(loadSettings() ?? defaultSettings());
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useSectionSpy(ids);

  useEffect(() => saveSettings(data), [data]);

  // 폼 핸들러 유틸
  const toggle = (path: keyof MySettings["notifications"]) =>
    setData((d) => ({ ...d, notifications: { ...d.notifications, [path]: !d.notifications[path] } }));

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">마이페이지</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
        <SidebarNav items={SECTIONS} active={active} />

        <div className="space-y-6">
          {/* 프로필 */}
          <SectionCard id="profile" title="프로필">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex items-center gap-4">
                <img
                  src={data.profile.avatarUrl || "https://placehold.co/96x96?text=Avatar"}
                  alt="avatar"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                />
                <div>
                  <label className="inline-block cursor-pointer rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                    아바타 변경
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        setData((d) => ({ ...d, profile: { ...d.profile, avatarUrl: url } }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <form className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-neutral-600">닉네임</label>
                  <input
                    value={data.profile.nickname}
                    onChange={(e) => setData((d) => ({ ...d, profile: { ...d.profile, nickname: e.target.value } }))}
                    className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-neutral-600">이메일</label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) => setData((d) => ({ ...d, profile: { ...d.profile, email: e.target.value } }))}
                    className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-neutral-600">언어</label>
                  <select
                    value={data.profile.language}
                    onChange={(e) =>
                      setData((d) => ({ ...d, profile: { ...d.profile, language: e.target.value as "ko" | "ja" } }))
                    }
                    className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <option value="ko">한국어</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </form>
            </div>
          </SectionCard>

          {/* 선호 아티스트 */}
          <SectionCard id="favorites" title="선호 아티스트">
            <div className="flex flex-wrap gap-2">
              {data.favorites.length === 0 && (
                <p className="text-sm text-neutral-500">선호 아티스트가 아직 없습니다. 아래 입력으로 추가하세요.</p>
              )}
              {data.favorites.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm dark:border-neutral-700"
                >
                  {name}
                  <button
                    className="rounded-full px-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={() => setData((d) => ({ ...d, favorites: d.favorites.filter((x) => x !== name) }))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                placeholder="예: IVE, NewJeans"
                className="flex-1 rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = (e.currentTarget.value || "").trim();
                    if (!v) return;
                    setData((d) => ({ ...d, favorites: Array.from(new Set([...d.favorites, v])) }));
                    e.currentTarget.value = "";
                  }
                }}
              />
              <button
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
                onClick={(e) => {
                  const input = (e.currentTarget.previousSibling as HTMLInputElement) ?? null;
                  if (!input) return;
                  const v = input.value.trim();
                  if (!v) return;
                  setData((d) => ({ ...d, favorites: Array.from(new Set([...d.favorites, v])) }));
                  input.value = "";
                }}
              >
                추가
              </button>
            </div>
          </SectionCard>

          {/* 알림 설정 */}
          <SectionCard id="notifications" title="알림 설정">
            <ul className="space-y-3">
              {[
                ["email", "이메일 알림"],
                ["sms", "SMS 알림"],
                ["marketing", "프로모션/마케팅 수신"],
                ["remindBeforeShow", "공연 전 리마인드 알림"],
              ].map(([k, label]) => (
                <li key={k} className="flex items-center justify-between rounded-lg border p-3 dark:border-neutral-800">
                  <span>{label}</span>
                  <label className="inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={(data.notifications as any)[k]}
                      onChange={() => toggle(k as any)}
                      className="peer sr-only"
                    />
                    <span className="h-6 w-11 rounded-full bg-neutral-300 peer-checked:bg-indigo-600 transition relative after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
                  </label>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* 개인정보 공개범위 */}
          <SectionCard id="privacy" title="개인정보 공개">
            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-lg border p-3 dark:border-neutral-800">
                <span>프로필 공개</span>
                <input
                  type="checkbox"
                  checked={data.privacy.showProfilePublic}
                  onChange={(e) =>
                    setData((d) => ({ ...d, privacy: { ...d.privacy, showProfilePublic: e.target.checked } }))
                  }
                />
              </label>
              <label className="flex items-center justify-between rounded-lg border p-3 dark:border-neutral-800">
                <span>위시리스트 공개</span>
                <input
                  type="checkbox"
                  checked={data.privacy.showWishlist}
                  onChange={(e) =>
                    setData((d) => ({ ...d, privacy: { ...d.privacy, showWishlist: e.target.checked } }))
                  }
                />
              </label>
            </div>
          </SectionCard>

          {/* 주문/예매 요약 (목업) */}
          <SectionCard
            id="orders"
            title="주문/예매 내역"
            extra={<button className="text-sm underline">전체 보기</button>}
          >
            <ul className="divide-y dark:divide-neutral-800">
              {[
                { id: "ORD-2025-1101-001", title: "IVE THE 1ST WORLD TOUR", date: "2025-12-20 (토) 18:00", status: "결제완료" },
                { id: "ORD-2025-1028-014", title: "NewJeans Fan Meeting", date: "2025-11-30 (일) 15:00", status: "취소완료" },
              ].map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{o.title}</p>
                    <p className="text-xs text-neutral-500">{o.id} · {o.date}</p>
                  </div>
                  <span className="rounded-full border px-3 py-1 text-xs dark:border-neutral-700">{o.status}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* 고객지원/공지 (목업) */}
          <SectionCard id="support" title="문의/공지">
            <div className="space-y-3">
              <div className="rounded-lg border p-3 text-sm dark:border-neutral-800">
                <p className="font-medium">[공지] 시스템 점검 안내</p>
                <p className="text-neutral-500">12/03(수) 02:00~04:00 점검으로 일부 기능이 제한됩니다.</p>
              </div>
              <div className="rounded-lg border p-3 text-sm dark:border-neutral-800">
                <p className="font-medium">[문의] 예매 좌석 변경 관련</p>
                <p className="text-neutral-500">답변 완료 · 11/02 14:12</p>
              </div>
            </div>
          </SectionCard>

          {/* 저장/초기화 버튼 */}
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg border px-4 py-2 text-sm dark:border-neutral-700"
              onClick={() => setData(loadSettings() ?? defaultSettings())}
            >
              되돌리기
            </button>
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
              onClick={() => saveSettings(data)}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
