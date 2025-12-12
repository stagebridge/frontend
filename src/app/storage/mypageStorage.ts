import type { MySettings } from "../../types/mypage";

/** 초기 설정값 */
export function defaultSettings(): MySettings {
  return {
    profile: { nickname: "게스트", email: "guest@example.com", language: "ko" },
    notifications: {
      email: true,
      sms: false,
      marketing: false,
      remindBeforeShow: true,
    },
    favorites: [],
    privacy: { showProfilePublic: false, showWishlist: true },
    albums: [
      {
        id: "alb-1",
        title: "IVE THE 1ST WORLD TOUR",
        coverUrl: "https://placehold.co/180x240?text=IVE",
        tag: "구매",
      },
      {
        id: "alb-2",
        title: "NewJeans Fan Meeting",
        coverUrl: "https://placehold.co/180x240?text=NJ",
        tag: "보관",
      },
    ],
    regionLang: {
      regionKR: "KOREA",
      regionJP: "JAPAN",
      languagePref: "ko",
    },
  };
}

/** 저장 키 */
const STORAGE_KEY = "sb_mypage_settings";

/** 설정 불러오기 */
export function loadSettings(): MySettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MySettings;
    return parsed;
  } catch (err) {
    console.warn("loadSettings 실패:", err);
    return null;
  }
}

/** 설정 저장 */
export function saveSettings(data: MySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("saveSettings 실패:", err);
  }
}
