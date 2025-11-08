export type Region = "KOREA" | "JAPAN";
export type Genre =
  | "IDOL_FEMALE"
  | "IDOL_MALE"
  | "BAND"
  | "HIPHOP"
  | "JAZZ"
  | "CLASSIC"
  | "ETC";

export interface Ticket {
  id: string;
  title: string;
  subTitle?: string;
  dateStart: string;
  dateEnd?: string;
  priceKRW?: number;
  priceJPY?: number;
  venue: string;
  region: Region;
  genre: Genre;
  cover: string;     // 이미지 URL
}
