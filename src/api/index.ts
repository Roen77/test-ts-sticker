import { keywordItem, stickerItem } from "@/type";
import axios, { AxiosPromise } from "axios";

export const search = {
  // 검색
  fetchs(searchData: string, limit: string, offset = 0): AxiosPromise<stickerItem> {
    return axios.post(".netlify/functions/sticker", { searchData, limit, offset });
  },
};
export const keyword = {
  // 키워드 검색
  fetchs(searchData: string, limit: string): AxiosPromise<keywordItem> {
    return axios.post(".netlify/functions/keyword", { searchData, limit });
  },
};
