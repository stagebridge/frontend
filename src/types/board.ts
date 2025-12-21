export type BoardKind = "reviews" | "expectations" | "qa";

export type BoardPost = {
  id: string;
  performanceId: string;
  kind: BoardKind;
  title: string;
  content: string;
  author: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  likeCount: number;
  viewCount: number;
};

export type BoardSort = "latest" | "popular";

export type ListBoardPostsParams = {
  performanceId: string;
  kind: BoardKind;
  page: number;
  size: number;
  q?: string;
  sort?: BoardSort;
};

export type ListBoardPostsResult = {
  items: BoardPost[];
  total: number;
  page: number;
  size: number;
};
