import { keywordItem, sticker, stickerItem } from "@/type";
import axios, { AxiosPromise } from "axios";

const instance = axios.create({
  baseURL: "https://api.giphy.com/v1/",
});

const API_KEY = "3veitOn3rVMzPMduGVEOxl31SHXXSfc1";

export const search = {
  // 검색
  fetchs(searchData: string, limit: string, offset = 0): AxiosPromise<stickerItem> {
    return axios.post(".netlify/functions/sticker", { searchData, limit, offset });
  },
  fetch(id: number): AxiosPromise<sticker> {
    return instance.get(`gifs/${id}?api_key=${API_KEY}`);
  },
};
export const keyword = {
  // 키워드 검색
  fetchs(searchData: string, limit: string): AxiosPromise<keywordItem> {
    return axios.post(".netlify/functions/keyword", { searchData, limit });
  },
};
