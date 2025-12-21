export type SupportBoardKind = "notice" | "faq" | "inquiry";

export type SupportPostStatus = "접수" | "답변완료";

export type SupportPost = {
  id: string;
  kind: SupportBoardKind;
  title: string;
  content: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  /** 문의 전용 */
  status?: SupportPostStatus;
};

export type SupportSort = "latest";

export type ListSupportPostsParams = {
  kind: SupportBoardKind;
  page: number;
  size: number;
  q?: string;
  sort?: SupportSort;
};

export type ListSupportPostsResult = {
  items: SupportPost[];
  total: number;
  page: number;
  size: number;
};
