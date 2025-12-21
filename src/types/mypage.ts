// src/types/mypage.ts
export type AlbumItem = {
  id: string;
  title: string;
  coverUrl: string;
  tag?: string; // 예: "구매", "보관"
};

export type Profile = {
  nickname: string;
  email: string;
  phone?: string;
  language: "ko" | "ja" | "en";
};

export type NotificationPrefs = {
  email: boolean;
  sms: boolean;
  marketing: boolean;
  remindBeforeShow: boolean;
};

export type RegionLanguage = {
  regionKR: "KOREA" | "NONE";
  regionJP: "JAPAN" | "NONE";
  languagePref: "ko" | "ja" | "en";
};

export type MySettings = {
  profile: Profile;
  notifications: NotificationPrefs;
  favorites: string[];
  privacy: {
    showProfilePublic: boolean;
    showWishlist: boolean;
  };
  albums?: AlbumItem[];
  regionLang?: RegionLanguage;
};
