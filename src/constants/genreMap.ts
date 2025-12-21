// src/constants/genreMap.ts

export const GENRE_API_MAP = {
  "뮤지컬": "뮤지컬",
  "연극": "연극",
  "서양음악(클래식)": "서양음악(클래식)",
  "한국음악(국악)": "한국음악(국악)",
  "대중음악": "대중음악",
  "서커스/마술": "서커스/마술",
  "복합": "복합",
} as const;

export type GenreLabel = keyof typeof GENRE_API_MAP;
