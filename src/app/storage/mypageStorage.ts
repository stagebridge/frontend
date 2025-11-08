import type { MySettings } from "../../types/mypage";

const KEY = "sb_mypage_settings";

export function loadSettings(): MySettings | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MySettings) : null;
  } catch {
    return null;
  }
}

export function saveSettings(s: MySettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function defaultSettings(): MySettings {
  return {
    profile: { nickname: "게스트", email: "guest@example.com", language: "ko" },
    notifications: { email: true, sms: false, marketing: false, remindBeforeShow: true },
    favorites: [],
    privacy: { showProfilePublic: false, showWishlist: true },
  };
}
