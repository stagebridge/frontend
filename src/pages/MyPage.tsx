import { useEffect, useMemo, useState, useLayoutEffect } from "react";
import SidebarNav from "./mypage/SidebarNav";
import SectionCard from "./mypage/SectionCard";
import { useSectionSpy } from "../hooks/useSectionSpy";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
} from "../app/storage/mypageStorage";
import type { MySettings } from "../types/mypage";
import NotificationRow from "./mypage/NotificationRow";
import AlbumShelf from "./mypage/AlbumShelf";
import RegionLanguagePicker from "./mypage/RegionLanguagePicker";
import AutoRefundInfo from "./mypage/AutoRefundInfo";
import SupportInbox from "./mypage/SupportInbox";

const SECTIONS = [
  { id: "profile", label: "프로필" },
  { id: "albums", label: "앨범 보관" },
  { id: "favorites", label: "선호 아티스트" },
  { id: "region", label: "선호 지역/언어" },
  { id: "notifications", label: "알림 설정" },
  { id: "privacy", label: "개인정보 공개" },
  { id: "orders", label: "주문/예매 내역" },
  { id: "refund", label: "자동 환불 안내" },
  { id: "support", label: "고객 지원" },
];

export default function MyPage() {
  const [data, setData] = useState<MySettings>(
    loadSettings() ?? defaultSettings()
  );
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useSectionSpy(ids);

  // 헤더 실제 높이를 CSS 변수(--header-h)에 반영 (섹션 잘림 방지)
  useLayoutEffect(() => {
  const header = document.querySelector("header");
  const h = header?.getBoundingClientRect().height ?? 96;
  document.documentElement.style.setProperty("--header-h", `${Math.round(h + 8)}px`);
}, []);

  useEffect(() => saveSettings(data), [data]);

  // 토글 핸들러
  const toggle = (path: keyof MySettings["notifications"]) =>
    setData((d) => ({
      ...d,
      notifications: { ...d.notifications, [path]: !d.notifications[path] },
    }));

  // regionLang 안전 기본값
  const regionLang =
    data.regionLang ?? {
      regionKR: "KOREA",
      regionJP: "JAPAN",
      languagePref: "ko" as const,
    };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 overflow-visible">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">마이페이지</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[14rem_minmax(0,1fr)] items-start">
        <SidebarNav items={SECTIONS} active={active} />

        <div className="space-y-6">
          {/* 프로필 */}
          <SectionCard id="profile" title="프로필">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex items-center gap-4">
                <img
                  src={
                    data.profile.avatarUrl ||
                    "https://placehold.co/96x96?text=Avatar"
                  }
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
                        setData((d) => ({
                          ...d,
                          profile: { ...d.profile, avatarUrl: url },
                        }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <form className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-neutral-600">
                    닉네임
                  </label>
                  <input
                    value={data.profile.nickname}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        profile: {
                          ...d.profile,
                          nickname: e.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-neutral-600">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        profile: { ...d.profile, email: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-neutral-600">
                    언어
                  </label>
                  <select
                    value={data.profile.language}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        profile: {
                          ...d.profile,
                          language: e.target
                            .value as MySettings["profile"]["language"],
                        },
                      }))
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

          {/* 앨범 보관 */}
          <SectionCard id="albums" title="앨범 보관">
            <AlbumShelf items={data.albums ?? []} />
          </SectionCard>

          {/* 선호 아티스트 */}
          <SectionCard id="favorites" title="선호 아티스트">
            <div className="flex flex-wrap gap-2">
              {data.favorites.length === 0 && (
                <p className="text-sm text-neutral-500">
                  선호 아티스트가 아직 없습니다. 아래 입력으로 추가하세요.
                </p>
              )}
              {data.favorites.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm dark:border-neutral-700"
                >
                  {name}
                  <button
                    className="rounded-full px-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        favorites: d.favorites.filter((x) => x !== name),
                      }))
                    }
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
                    setData((d) => ({
                      ...d,
                      favorites: Array.from(new Set([...d.favorites, v])),
                    }));
                    (e.currentTarget as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
                onClick={(e) => {
                  const input =
                    (e.currentTarget.previousSibling as HTMLInputElement) ??
                    null;
                  if (!input) return;
                  const v = input.value.trim();
                  if (!v) return;
                  setData((d) => ({
                    ...d,
                    favorites: Array.from(new Set([...d.favorites, v])),
                  }));
                  input.value = "";
                }}
              >
                추가
              </button>
            </div>
          </SectionCard>

          {/* 선호 지역/언어 */}
          <SectionCard id="region" title="선호 지역/언어">
            <RegionLanguagePicker
              value={regionLang}
              onChange={(v) => setData((d) => ({ ...d, regionLang: v }))}
            />
          </SectionCard>

          {/* 알림 설정 */}
          <SectionCard id="notifications" title="알림 설정">
            <div className="space-y-3">
              <NotificationRow
                title="공연 정보 메일"
                desc="관심 아티스트의 신규 공연, 일정 변경 등 이메일로 받아봅니다."
                checked={data.notifications.email}
                onChange={() => toggle("email")}
              />
              <NotificationRow
                title="SMS 알림"
                desc="예매 일정, 당일 티켓 안내 등을 문자로 받아봅니다."
                checked={data.notifications.sms}
                onChange={() => toggle("sms")}
              />
              <NotificationRow
                title="프로모션/마케팅"
                desc="이벤트, 할인, 스폰서 프로모션 정보를 수신합니다."
                checked={data.notifications.marketing}
                onChange={() => toggle("marketing")}
              />
              <NotificationRow
                title="공연 전 리마인드 알림"
                desc="공연 3일 전·당일 안내를 받아봅니다."
                checked={data.notifications.remindBeforeShow}
                onChange={() => toggle("remindBeforeShow")}
              />
            </div>
          </SectionCard>

          {/* 개인정보 공개 */}
          <SectionCard id="privacy" title="개인정보 공개">
            <div className="space-y-3">
              <label className="flex items-start justify-between rounded-lg border p-4 dark:border-neutral-800">
                <div className="pr-4">
                  <div className="font-medium">프로필 공개</div>
                  <p className="mt-1 text-sm text-neutral-500">
                    닉네임과 프로필 이미지가 전체에 공개됩니다.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={data.privacy.showProfilePublic}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      privacy: {
                        ...d.privacy,
                        showProfilePublic: e.target.checked,
                      },
                    }))
                  }
                />
              </label>

              <label className="flex items-start justify-between rounded-lg border p-4 dark:border-neutral-800">
                <div className="pr-4">
                  <div className="font-medium">위시리스트 공개</div>
                  <p className="mt-1 text-sm text-neutral-500">
                    관심 공연 목록을 친구에게 공유할 수 있습니다.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={data.privacy.showWishlist}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      privacy: {
                        ...d.privacy,
                        showWishlist: e.target.checked,
                      },
                    }))
                  }
                />
              </label>
            </div>
          </SectionCard>

          {/* 주문/예매 내역 */}
          <SectionCard
            id="orders"
            title="주문/예매 내역"
            extra={<button className="text-sm underline">전체 보기</button>}
          >
            <ul className="divide-y dark:divide-neutral-800">
              {[
                {
                  id: "ORD-2025-1101-001",
                  title: "IVE THE 1ST WORLD TOUR",
                  date: "2025-12-20 (토) 18:00",
                  status: "결제완료",
                },
                {
                  id: "ORD-2025-1028-014",
                  title: "NewJeans Fan Meeting",
                  date: "2025-11-30 (일) 15:00",
                  status: "취소완료",
                },
              ].map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{o.title}</p>
                    <p className="text-xs text-neutral-500">
                      {o.id} · {o.date}
                    </p>
                  </div>
                  <span className="rounded-full border px-3 py-1 text-xs dark:border-neutral-700">
                    {o.status}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* 자동 환불 안내 */}
          <SectionCard id="refund" title="자동 환불 안내">
            <AutoRefundInfo />
          </SectionCard>

          {/* 고객 지원 */}
          <SectionCard id="support" title="고객 지원">
            <SupportInbox
              items={[
                {
                  id: "s1",
                  title: "[공지] 시스템 점검 안내",
                  body: "12/03(수) 02:00~04:00 점검으로 일부 기능이 제한됩니다.",
                  date: "12/03",
                },
                {
                  id: "s2",
                  title: "[문의] 예매 좌석 변경 관련",
                  body: "좌석 변경은 공연사의 정책에 따라 제한될 수 있습니다.",
                  date: "11/02",
                },
                {
                  id: "s3",
                  title: "[FAQ] 예매 티켓 확인 방법",
                  body: "마이페이지 > 주문/예매에서 확인 가능합니다.",
                },
              ]}
            />
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

          {/* 바닥 여유: 마지막 섹션도 상단까지 스크롤되도록 */}
          <div aria-hidden className="h-[calc(100vh-var(--header-h))]" />
        </div>
      </div>
    </main>
  );
}
