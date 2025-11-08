export type NotificationPrefs = {
  email: boolean;
  sms: boolean;
  marketing: boolean;
  remindBeforeShow: boolean;
};

export type Profile = {
  nickname: string;
  email: string;
  language: "ko" | "ja";
  avatarUrl?: string;
};

export type MySettings = {
  profile: Profile;
  notifications: NotificationPrefs;
  favorites: string[]; // 선호 아티스트/그룹 ID or 이름
  privacy: {
    showProfilePublic: boolean;
    showWishlist: boolean;
  };
};
