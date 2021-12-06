import { keywordType, sticker } from "@/type";
const STORAGE_KEY = "STICKER-TAGlIST";
const getTagList = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
export type State = {
  lists: sticker[];
  tagList: sticker[];
  keywordsList: keywordType[];
  searchData: string;
  limit: string;
  loading: boolean;
  iserror: boolean;
  [key: string]: null | string | boolean | sticker[] | sticker | keywordType[];
};

export const state: State = {
  lists: [],
  tagList: getTagList || [],
  keywordsList: [],
  searchData: "",
  limit: "",
  loading: false,
  iserror: false,
};
