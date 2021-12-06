// 이미지 정보
export type ImageItem = {
  original: {
    url: string;
  };
};
// 사용자 정보
export type userInfo = {
  avatar_url: string;
  banner_image: string;
  banner_ur: string;
  profile_url: string;
  username: string;
  display_name: string;
  description: string;
  instagram_url: string;
  website_url: string;
  is_verified: boolean;
};
// 검색 시 가져온 데이터 타입 정보
export type sticker = {
  type: string;
  id: string;
  url: string;
  title: string;
  images: ImageItem;
  user: userInfo;
};
// 검색 시 가져온 페이지 정보
export type paginationInfo = {
  total_count: number;
  count: number;
  offset: number;
};
// 검색 시 가져온 페이지 메타 정보
export type metaInfo = {
  status: number;
  msg: string;
  response_id: string;
};
// 검색 시 가져온 데이터 리스트
export type stickerItem = {
  data: sticker[];
  pagination: paginationInfo;
  meta: metaInfo;
};
// 추천 검색시 가져온 데이터
export type keywordType = {
  name: string;
};
// 추천 검색시 가져온 데이터 리스트
export type keywordItem = {
  data: keywordType[];
};
