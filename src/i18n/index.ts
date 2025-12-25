// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type Lang = "ko" | "ja" | "en";

const STORAGE_KEY = "sb_lang";

const resources = {
  ko: {
    translation: {
      common: {
        loading: "불러오는 중입니다.",
        empty: "조건에 맞는 결과가 없습니다.",
        pagination: { prev: "이전", next: "다음" },

        // ✅ 추가: 상단바/공통
        logout: "로그아웃",
        welcomeSuffix: "님 환영합니다",

        // ✅ 추가: 로그인 전/공통 라벨
        login: "로그인",
        signup: "회원가입",
      },

      // ✅ 추가: 언어/지역 공통
      language: {
        ko: "한국어",
        ja: "日本語",
        en: "English",
      },
      region: {
        KOREA: "대한민국",
        JAPAN: "일본",
      },

      // ✅ 추가: 국가(단일 선택 UI용)
      country: {
        korea: "한국",
        japan: "일본",
      },

      // ✅ 추가: 마이페이지
      mypage: {
        nav: {
          title: "마이페이지",
          profile: "프로필",
          tickets: "예매 내역",
          settings: "설정",
          support: "고객 지원",
        },
        header: {
          profileTitle: "프로필",
          profileDesc: "계정 정보를 확인하고, 개인 정보를 수정할 수 있습니다.",
          ticketsTitle: "예매 내역",
          ticketsDesc: "예매한 공연과 예약 정보를 확인할 수 있습니다.",
          settingsTitle: "설정",
          settingsDesc: "언어, 알림, 계정 관련 설정을 관리할 수 있습니다.",
          supportTitle: "고객 지원",
          supportDesc: "자주 묻는 질문을 확인하고, 문의 방법을 안내받을 수 있습니다.",
        },

        // ✅ 추가: 설정 페이지(키 노출 해결)
        settings: {
          themeTitle: "테마 설정",
          themeDesc: "라이트 모드와 다크 모드를 선택할 수 있습니다.",

          notifyTitle: "알림 설정",
          notifyDesc: "알림 수신 여부를 설정할 수 있습니다.",

          notifyEmailTitle: "이메일 알림",
          notifyEmailDesc: "이메일로 알림을 받습니다.",

          notifySmsTitle: "문자 알림",
          notifySmsDesc: "문자로 알림을 받습니다.",

          notifyMarketingTitle: "마케팅 알림",
          notifyMarketingDesc: "이벤트 및 프로모션 알림을 받습니다.",

          notifyRemindTitle: "공연 알림",
          notifyRemindDesc: "공연 시작 전 알림을 받습니다.",

          regionLangTitle: "지역 및 언어",
          regionLangDesc: "국가와 언어를 설정할 수 있습니다.",

          // ✅ 추가: 단일 국가/단일 언어 UI 라벨
          countryLabel: "국가",
          languageLabel: "언어",
        },
      },

      navbar: {
        searchPlaceholder: "한국과 일본의 콘서트를 검색하세요",
        searchAria: "공연 검색",
      },
      home: {
        countryPicker: {
          title: "국가를 선택하세요!",
          koreaAria: "대한민국 공연 보기",
          japanAria: "일본 공연 보기",
        },
        hotIssue: { title: "[실시간 핫이슈]" },
        ranking: {
          title: "랭킹",
          viewAll: "전체보기",
          byGenre: "장르별 랭킹",
          byRegion: "지역별 랭킹",
          genreEnrichNotice:
            "장르 정보가 목록에 포함되지 않아 상세 조회로 보강 중일 수 있습니다.",
        },
      },
      search: {
        filters: {
          title: "필터",
          country: "국가",
          countryKR: "한국",
          countryJP: "일본",
          keyword: "키워드",
          keywordPlaceholder: "공연명, 아티스트, 장소",
          genre: "장르",
          region: "지역",
          all: "전체",
          apply: "적용",
          reset: "초기화",
        },
        tabs: { all: "전체", genre: "장르", region: "지역" },
        sort: {
          aria: "정렬",
          latest: "최신순",
          popular: "인기순(더미)",
          priceAsc: "가격↑",
          priceDesc: "가격↓",
        },
        results: {
          totalPrefix: "총 ",
          totalSuffix: "건",
          enrichingGenre:
            "장르 정보가 목록에 없을 수 있어, 일부 항목을 상세 조회로 보강 중입니다.",
          empty: "조건에 맞는 공연이 없습니다.",
        },
        errors: {
          fetchFailed: "공연 정보를 불러오는 중 오류가 발생했습니다.",
          fetchFailedWith: "공연 정보를 불러오는 중 오류가 발생했습니다: {{error}}",
        },
      },
      reserve: {
        title: "예매",
        defaultTitle: "공연",
        date: "날짜",
        quantity: "인원",
        payment: "결제",
        selectedDate: "선택 날짜",
        complete: "예매 완료",
        payOnSite: "현장 결제",
        maxTen: "최대 열 명까지 선택할 수 있습니다.",
        note: "결제는 현장에서 진행됩니다. 예매 완료 후 예약 정보를 확인할 수 있습니다.",
        noPoster: "포스터 이미지가 없습니다.",
        loading: "공연 정보를 불러오는 중입니다.",
        redirectingToLogin: "로그인 페이지로 이동합니다.",
        errors: {
          noPerformanceId: "공연 ID가 없습니다.",
          fetchFailed: "공연 정보를 불러오지 못했습니다.",
          unavailable: "공연 정보를 표시할 수 없습니다.",
        },
      },
      reserveComplete: {
        title: "예매 완료",
        success: "예매가 완료되었습니다",
        noReservation: "표시할 예약 정보가 없습니다.",
        goHome: "홈으로",
        backToConcert: "공연으로 돌아가기",
        noImage: "이미지가 없습니다.",
        reservationId: "예약번호",
        date: "날짜",
        quantity: "인원",
        payment: "결제",
        payOnSite: "현장 결제",
      },
    },
  },

  ja: {
    translation: {
      common: {
        loading: "読み込み中です。",
        empty: "条件に一致する結果はありません。",
        pagination: { prev: "前へ", next: "次へ" },

        // ✅ 追加: 上部バー/共通
        logout: "ログアウト",
        welcomeSuffix: "さん、ようこそ",

        // ✅ 追加: ログイン前/共通ラベル
        login: "ログイン",
        signup: "会員登録",
      },

      // ✅ 追加: 言語/地域 共通
      language: {
        ko: "韓国語",
        ja: "日本語",
        en: "英語",
      },
      region: {
        KOREA: "韓国",
        JAPAN: "日本",
      },

      // ✅ 追加: 国(単一選択UI用)
      country: {
        korea: "韓国",
        japan: "日本",
      },

      // ✅ 追加: マイページ
      mypage: {
        nav: {
          title: "マイページ",
          profile: "プロフィール",
          tickets: "予約履歴",
          settings: "設定",
          support: "サポート",
        },
        header: {
          profileTitle: "プロフィール",
          profileDesc: "アカウント情報を確認し、個人情報を変更できます。",
          ticketsTitle: "予約履歴",
          ticketsDesc: "予約した公演と予約情報を確認できます。",
          settingsTitle: "設定",
          settingsDesc: "言語、通知、アカウント関連の設定を管理できます。",
          supportTitle: "サポート",
          supportDesc: "よくある質問を確認し、お問い合わせ方法をご案内します。",
        },

        // ✅ 追加: 設定ページ(キー表示の解消)
        settings: {
          themeTitle: "テーマ設定",
          themeDesc: "ライトモードとダークモードを選択できます。",

          notifyTitle: "通知設定",
          notifyDesc: "通知の受信可否を設定できます。",

          notifyEmailTitle: "メール通知",
          notifyEmailDesc: "メールで通知を受け取ります。",

          notifySmsTitle: "SMS通知",
          notifySmsDesc: "SMSで通知を受け取ります。",

          notifyMarketingTitle: "マーケティング通知",
          notifyMarketingDesc: "イベントやプロモーションの通知を受け取ります。",

          notifyRemindTitle: "公演リマインド",
          notifyRemindDesc: "公演開始前に通知を受け取ります。",

          regionLangTitle: "地域と言語",
          regionLangDesc: "国と言語を設定できます。",

          // ✅ 追加: 単一 国/言語 UI ラベル
          countryLabel: "国",
          languageLabel: "言語",
        },
      },

      navbar: {
        searchPlaceholder: "韓国と日本のコンサートを検索してください",
        searchAria: "公演検索",
      },
      home: {
        countryPicker: {
          title: "国を選択してください。",
          koreaAria: "韓国の公演を見る",
          japanAria: "日本の公演を見る",
        },
        hotIssue: { title: "[リアルタイム注目]" },
        ranking: {
          title: "ランキング",
          viewAll: "すべて見る",
          byGenre: "ジャンル別ランキング",
          byRegion: "地域別ランキング",
          genreEnrichNotice:
            "ジャンル情報が一覧に含まれない場合、詳細取得で補完されることがあります。",
        },
      },
      search: {
        filters: {
          title: "フィルター",
          country: "国",
          countryKR: "韓国",
          countryJP: "日本",
          keyword: "キーワード",
          keywordPlaceholder: "公演名、アーティスト、会場",
          genre: "ジャンル",
          region: "地域",
          all: "すべて",
          apply: "適用",
          reset: "リセット",
        },
        tabs: { all: "すべて", genre: "ジャンル", region: "地域" },
        sort: {
          aria: "並び替え",
          latest: "新着順",
          popular: "人気順（ダミー）",
          priceAsc: "価格↑",
          priceDesc: "価格↓",
        },
        results: {
          totalPrefix: "合計 ",
          totalSuffix: "件",
          enrichingGenre:
            "ジャンル情報が一覧にない可能性があるため、一部を詳細取得で補完しています。",
          empty: "条件に一致する公演はありません。",
        },
        errors: {
          fetchFailed: "公演情報の取得中にエラーが発生しました。",
          fetchFailedWith: "公演情報の取得中にエラーが発生しました: {{error}}",
        },
      },
      reserve: {
        title: "予約",
        defaultTitle: "公演",
        date: "日付",
        quantity: "人数",
        payment: "決済",
        selectedDate: "選択日",
        complete: "予約完了",
        payOnSite: "現地決済",
        maxTen: "最大十名まで選択できます。",
        note: "決済は現地で行います。予約完了後に予約情報を確認できます。",
        noPoster: "ポスター画像がありません。",
        loading: "公演情報を読み込み中です。",
        redirectingToLogin: "ログインページへ移動します。",
        errors: {
          noPerformanceId: "公演IDがありません。",
          fetchFailed: "公演情報を取得できませんでした。",
          unavailable: "公演情報を表示できません。",
        },
      },
      reserveComplete: {
        title: "予約完了",
        success: "予約が完了しました",
        noReservation: "表示できる予約情報がありません。",
        goHome: "ホームへ",
        backToConcert: "公演へ戻る",
        noImage: "画像がありません。",
        reservationId: "予約番号",
        date: "日付",
        quantity: "人数",
        payment: "決済",
        payOnSite: "現地決済",
      },
    },
  },

  en: {
    translation: {
      common: {
        loading: "Loading.",
        empty: "No results match the current filters.",
        pagination: { prev: "Previous", next: "Next" },

        // ✅ Added: top bar/common
        logout: "Log out",
        welcomeSuffix: ", welcome",

        // ✅ Added: pre-login/common labels
        login: "Log in",
        signup: "Sign up",
      },

      // ✅ Added: language/region common
      language: {
        ko: "Korean",
        ja: "Japanese",
        en: "English",
      },
      region: {
        KOREA: "Korea",
        JAPAN: "Japan",
      },

      // ✅ Added: country (single-select UI)
      country: {
        korea: "Korea",
        japan: "Japan",
      },

      // ✅ Added: My Page
      mypage: {
        nav: {
          title: "My Page",
          profile: "Profile",
          tickets: "Bookings",
          settings: "Settings",
          support: "Support",
        },
        header: {
          profileTitle: "Profile",
          profileDesc: "Review account details and update personal information.",
          ticketsTitle: "Bookings",
          ticketsDesc: "View booked performances and reservation details.",
          settingsTitle: "Settings",
          settingsDesc: "Manage language, notifications, and account preferences.",
          supportTitle: "Support",
          supportDesc: "Browse FAQs and find ways to contact support.",
        },

        // ✅ Added: Settings page (fixes key strings)
        settings: {
          themeTitle: "Theme",
          themeDesc: "Choose between light and dark mode.",

          notifyTitle: "Notifications",
          notifyDesc: "Manage notification preferences.",

          notifyEmailTitle: "Email notifications",
          notifyEmailDesc: "Receive notifications via email.",

          notifySmsTitle: "SMS notifications",
          notifySmsDesc: "Receive notifications via SMS.",

          notifyMarketingTitle: "Marketing notifications",
          notifyMarketingDesc: "Receive event and promotion updates.",

          notifyRemindTitle: "Performance reminders",
          notifyRemindDesc: "Get notified before a performance starts.",

          regionLangTitle: "Region and language",
          regionLangDesc: "Set your country and language.",

          // ✅ Added: single country/language UI labels
          countryLabel: "Country",
          languageLabel: "Language",
        },
      },

      navbar: {
        searchPlaceholder: "Search concerts in Korea and Japan",
        searchAria: "Search performances",
      },
      home: {
        countryPicker: {
          title: "Select a country.",
          koreaAria: "View performances in Korea",
          japanAria: "View performances in Japan",
        },
        hotIssue: { title: "[Trending Now]" },
        ranking: {
          title: "Ranking",
          viewAll: "View all",
          byGenre: "Ranking by genre",
          byRegion: "Ranking by region",
          genreEnrichNotice:
            "Some items may be enriched via detail fetch because genre may be missing in list results.",
        },
      },
      search: {
        filters: {
          title: "Filters",
          country: "Country",
          countryKR: "Korea",
          countryJP: "Japan",
          keyword: "Keyword",
          keywordPlaceholder: "Title, artist, venue",
          genre: "Genre",
          region: "Region",
          all: "All",
          apply: "Apply",
          reset: "Reset",
        },
        tabs: { all: "All", genre: "Genre", region: "Region" },
        sort: {
          aria: "Sort",
          latest: "Latest",
          popular: "Popular (dummy)",
          priceAsc: "Price ↑",
          priceDesc: "Price ↓",
        },
        results: {
          totalPrefix: "Total ",
          totalSuffix: "",
          enrichingGenre:
            "Some items may not include genre in the list response, so the app is enriching genre via detail fetch.",
          empty: "No performances match the current filters.",
        },
        errors: {
          fetchFailed: "An error occurred while loading performances.",
          fetchFailedWith: "An error occurred while loading performances: {{error}}",
        },
      },
      reserve: {
        title: "Reserve",
        defaultTitle: "Performance",
        date: "Date",
        quantity: "People",
        payment: "Payment",
        selectedDate: "Selected date",
        complete: "Complete reservation",
        payOnSite: "Pay on site",
        maxTen: "You can select up to ten people.",
        note: "Payment is made on site. After completion, reservation details will be available.",
        noPoster: "No poster image.",
        loading: "Loading performance details.",
        redirectingToLogin: "Redirecting to the login page.",
        errors: {
          noPerformanceId: "Missing performance ID.",
          fetchFailed: "Failed to load performance details.",
          unavailable: "Performance details are unavailable.",
        },
      },
      reserveComplete: {
        title: "Reservation complete",
        success: "Your reservation is complete.",
        noReservation: "No reservation details to display.",
        goHome: "Go to home",
        backToConcert: "Back to performance",
        noImage: "No image.",
        reservationId: "Reservation ID",
        date: "Date",
        quantity: "People",
        payment: "Payment",
        payOnSite: "Pay on site",
      },
    },
  },
} as const;

const getInitialLang = (): Lang => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "ko" || saved === "ja" || saved === "en") return saved;
  return "ko";
};

const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng;
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLang(),
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

syncHtmlLang(i18n.language);

i18n.on("languageChanged", (lng) => {
  const code = lng === "ko" || lng === "ja" || lng === "en" ? lng : "ko";
  localStorage.setItem(STORAGE_KEY, code);
  syncHtmlLang(code);
});

export default i18n;
