// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  ko: {
    translation: {
      common: {
        appName: "StageBridge",
        login: "로그인",
        signup: "회원가입",
        logout: "로그아웃",
        favorites: "찜 목록",
        reserve: "예매하기",
        mypage: "마이페이지",

        searchPlaceholder: "한국과 일본의 콘서트를 검색하세요.",
        searchPlaceholderV2: "오페라의 유령, 뮤지컬, 콘서트 등 검색해보세요",

        empty: "조건에 맞는 공연이 없습니다.",
        loading: "불러오는 중...",
        country: "국가",
        sort: "정렬",
        keyword: "키워드",
        search: "검색",
        totalResults: "총 {{count}}개 결과",

        latest: "최신(기본)",
        oldest: "오래된순",
        close: "닫기",
        ok: "확인",

        paginationPrev: "이전",
        paginationNext: "다음",

        toHome: "홈으로 이동",
      },

      // ✅ Navbar 전용 키(상단바에서 navbar.login 같은 키가 사용될 때 대비)
      navbar: {
        login: "로그인",
        signup: "회원가입",
        logout: "로그아웃",
        concerts: "공연",
        notice: "공지사항",
        mypage: "마이페이지",
        favorites: "찜 목록",
        reserve: "예매하기",
      },

      language: {
        ko: "한국어",
        ja: "日本語",
        en: "English",
      },

      footer: {
        siteAria: "사이트 링크",
        about: "소개",
        terms: "이용약관",
        privacy: "개인정보처리방침",
        support: "고객센터",
        sns: "SNS",
        language: "언어",
        contact: "문의",
        copyright: "StageBridge © 2025",
        privacySettings: "개인정보 설정",
        cookie: "쿠키",
        toTop: "맨 위로",
      },

      notice: {
        title: "공지사항",
      },

      home: {
        heroTitle: "한국과 일본의 공연을 한 곳에서",
        heroDesc: "장르/지역별 랭킹, 핫이슈, 예매까지 StageBridge에서 한 번에.",
        hotIssue: {
          title: "[실시간 핫이슈]",
          description: "현재 주목받는 공연을 빠르게 확인해 보세요.",
          loadFailedTitle: "핫이슈를 불러올 수 없습니다.",
          loadFailedDesc: "핫이슈 데이터를 불러오지 못했습니다.",
          retry: "다시 시도",
          empty: "현재 표시할 핫이슈가 없습니다.",
          carouselAria: "핫이슈 캐러셀",
          favAddAria: "찜 추가",
          favRemoveAria: "찜 해제",
        },
        ranking: {
          title: "랭킹",
          description: "장르 또는 지역 기준으로 인기 공연을 확인할 수 있습니다.",
          viewAll: "전체보기",
          tabGenre: "장르별 랭킹",
          tabRegion: "지역별 랭킹",
          genreHint:
            "장르 정보가 목록에 포함되지 않아, 상세 조회로 보강 중일 수 있습니다.",
        },

        // ✅ 07/10: CountryPickerV2 섹션 i18n 키 추가
        countryPicker: {
          title: "국가별 공연 보기",
          description: "한국 또는 일본 공연을 빠르게 탐색할 수 있습니다.",
          koreaTitle: "한국 공연",
          koreaDesc: "지역, 장르, 기간 조건으로 공연을 찾아보세요.",
          japanTitle: "일본 공연",
          japanDesc: "공연 랭킹과 지역별 정보를 빠르게 확인해 보세요.",
          cta: "바로 보기",
          ariaKorea: "한국 공연 보기",
          ariaJapan: "일본 공연 보기",
        },
      },

      comingSoon: {
        title: "일본 공연 데이터 준비 중",
        description:
          "현재 일본 공연 데이터는 준비 중입니다. 한국 공연으로 전환해 확인해 보세요.",
        ctaToKr: "한국 공연 보러가기",
      },
    },
  },

  ja: {
    translation: {
      common: {
        appName: "StageBridge",
        login: "ログイン",
        signup: "会員登録",
        logout: "ログアウト",
        favorites: "お気に入り",
        reserve: "予約する",
        mypage: "マイページ",

        searchPlaceholder: "韓国と日本のコンサートを検索してください。",
        searchPlaceholderV2:
          "オペラの怪人、ミュージカル、コンサートなどを検索してみてください",

        empty: "条件に合う公演がありません。",
        loading: "読み込み中...",
        country: "国",
        sort: "並び替え",
        keyword: "キーワード",
        search: "検索",
        totalResults: "合計 {{count}} 件",

        latest: "新しい順(既定)",
        oldest: "古い順",
        close: "閉じる",
        ok: "OK",

        paginationPrev: "前へ",
        paginationNext: "次へ",

        toHome: "ホームへ",
      },

      // ✅ Navbar 전용 키
      navbar: {
        login: "ログイン",
        signup: "会員登録",
        logout: "ログアウト",
        concerts: "公演",
        notice: "お知らせ",
        mypage: "マイページ",
        favorites: "お気に入り",
        reserve: "予約する",
      },

      language: {
        ko: "한국어",
        ja: "日本語",
        en: "English",
      },

      footer: {
        siteAria: "サイトリンク",
        about: "紹介",
        terms: "利用規約",
        privacy: "プライバシーポリシー",
        support: "サポート",
        sns: "SNS",
        language: "言語",
        contact: "お問い合わせ",
        copyright: "StageBridge © 2025",
        privacySettings: "プライバシー設定",
        cookie: "Cookie",
        toTop: "トップへ",
      },

      notice: {
        title: "お知らせ",
      },

      home: {
        heroTitle: "韓国と日本の公演を一か所で",
        heroDesc: "ジャンル/地域別ランキング、ホットイシュー、予約まで一度に。",
        hotIssue: {
          title: "[リアルタイムホットイシュー]",
          description: "注目されている公演を素早く確認できます。",
          loadFailedTitle: "ホットイシューを読み込めません。",
          loadFailedDesc: "ホットイシューのデータを取得できませんでした。",
          retry: "再試行",
          empty: "表示できるホットイシューがありません。",
          carouselAria: "ホットイシューのカルーセル",
          favAddAria: "お気に入りに追加",
          favRemoveAria: "お気に入りを解除",
        },
        ranking: {
          title: "ランキング",
          description: "ジャンル、または地域の基準で人気公演を確認できます。",
          viewAll: "すべて見る",
          tabGenre: "ジャンル別ランキング",
          tabRegion: "地域別ランキング",
          genreHint:
            "ジャンル情報が一覧に含まれないため、詳細取得で補強中の可能性があります。",
        },

        // ✅ 07/10: CountryPickerV2 섹션 i18n 키 추가
        countryPicker: {
          title: "国別で公演を見る",
          description: "韓国、または日本の公演を素早く探せます。",
          koreaTitle: "韓国の公演",
          koreaDesc: "地域、ジャンル、期間の条件で公演を探せます。",
          japanTitle: "日本の公演",
          japanDesc: "ランキング、地域別情報を素早く確認できます。",
          cta: "すぐ見る",
          ariaKorea: "韓国の公演を見る",
          ariaJapan: "日本の公演を見る",
        },
      },

      comingSoon: {
        title: "日本の公演データを準備中",
        description:
          "現在、日本の公演データは準備中です。韓国の公演に切り替えてご確認ください。",
        ctaToKr: "韓国の公演を見る",
      },
    },
  },

  en: {
    translation: {
      common: {
        appName: "StageBridge",
        login: "Log in",
        signup: "Sign up",
        logout: "Log out",
        favorites: "Favorites",
        reserve: "Reserve",
        mypage: "My page",

        searchPlaceholder: "Search concerts in Korea and Japan.",
        searchPlaceholderV2: "Search Phantom of the Opera, musicals, concerts, etc.",

        empty: "No performances match the criteria.",
        loading: "Loading...",
        country: "Country",
        sort: "Sort",
        keyword: "Keyword",
        search: "Search",
        totalResults: "Total {{count}} results",

        latest: "Newest (default)",
        oldest: "Oldest",
        close: "Close",
        ok: "OK",

        paginationPrev: "Prev",
        paginationNext: "Next",

        toHome: "Go to home",
      },

      // ✅ Navbar 전용 키
      navbar: {
        login: "Log in",
        signup: "Sign up",
        logout: "Log out",
        concerts: "Concerts",
        notice: "Notices",
        mypage: "My page",
        favorites: "Favorites",
        reserve: "Reserve",
      },

      language: {
        ko: "한국어",
        ja: "日本語",
        en: "English",
      },

      footer: {
        siteAria: "Site links",
        about: "About",
        terms: "Terms",
        privacy: "Privacy policy",
        support: "Support",
        sns: "SNS",
        language: "Language",
        contact: "Contact",
        copyright: "StageBridge © 2025",
        privacySettings: "Privacy settings",
        cookie: "Cookie",
        toTop: "Back to top",
      },

      notice: {
        title: "Notices",
      },

      home: {
        heroTitle: "Discover Korea and Japan in one place",
        heroDesc: "Rankings, hot issues, and reservations—everything in StageBridge.",
        hotIssue: {
          title: "[Hot Issues]",
          description: "Check trending performances quickly.",
          loadFailedTitle: "Unable to load hot issues.",
          loadFailedDesc: "Failed to fetch hot issue data.",
          retry: "Retry",
          empty: "No hot issues to display.",
          carouselAria: "Hot issue carousel",
          favAddAria: "Add to favorites",
          favRemoveAria: "Remove from favorites",
        },
        ranking: {
          title: "Ranking",
          description: "View popular performances by genre or region.",
          viewAll: "View all",
          tabGenre: "Genre ranking",
          tabRegion: "Region ranking",
          genreHint:
            "Genre information may be enriched via detail fetching if it is missing from the list.",
        },

        // ✅ 07/10: CountryPickerV2 섹션 i18n 키 추가
        countryPicker: {
          title: "Browse by country",
          description: "Quickly explore performances in Korea or Japan.",
          koreaTitle: "Korea",
          koreaDesc: "Find performances by region, genre, and date range.",
          japanTitle: "Japan",
          japanDesc: "Check rankings and regional information quickly.",
          cta: "View now",
          ariaKorea: "View Korea performances",
          ariaJapan: "View Japan performances",
        },
      },

      comingSoon: {
        title: "Japan data coming soon",
        description:
          "Japan performance data is not available yet. Switch to Korea to continue browsing.",
        ctaToKr: "Browse Korea",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export default i18n;
