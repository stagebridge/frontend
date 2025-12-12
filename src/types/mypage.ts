export type AlbumItem = {
  id: string;
  title: string;
  coverUrl: string;
  tag?: string; // 예: "구매", "보관"
};

export type RegionLanguage = {
  regionKR: "KOREA" | "NONE";
  regionJP: "JAPAN" | "NONE";
  languagePref: "ko" | "ja";
};

export type MySettings = {
  profile: Profile;
  notifications: NotificationPrefs;
  favorites: string[];
  privacy: {
    showProfilePublic: boolean;
    showWishlist: boolean;
  };
  albums?: AlbumItem[];               // ⬅︎ 추가
  regionLang?: RegionLanguage;        // ⬅︎ 추가
};
