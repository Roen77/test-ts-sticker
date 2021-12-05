export type ImageItem = {
  original: {
    url: string;
  };
};

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
export type sticker = {
  type: string;
  id: string;
  url: string;
  title: string;
  images: ImageItem;
  user: userInfo;
};
export type paginationInfo = {
  total_count: number;
  count: number;
  offset: number;
};

export type metaInfo = {
  status: number;
  msg: string;
  response_id: string;
};

export type stickerItem = {
  data: sticker[];
  pagination: paginationInfo;
  meta: metaInfo;
};
export type keywordType = {
  name: string;
};
export type keywordItem = {
  data: keywordType[];
};
