import { sticker } from "@/type";
import { MutationTree } from "vuex";
import { State } from "./state";
const STORAGE_KEY = "STICKER-TAGlIST";
export enum MutationTypes {
  SET_STATE = "SET_STATE",
  SET_SAVE_LIST = "SET_SAVE_LIST",
  SET_REMOVE_LIST = "SET_REMOVE_LIST",
}

// mutation Types
export type Mutations<S = State> = {
  [MutationTypes.SET_STATE](state: S, payload: State): void;
  [MutationTypes.SET_SAVE_LIST](state: S, payload: sticker): void;
};
export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_STATE](state, payload) {
    // (Object.keys(payload) as Array<keyof typeof payload>).forEach((key: keyof State) => {
    //   state[key] = payload[key];
    // });
    Object.keys(payload).forEach((key) => {
      state[key] = payload[key];
    });
  },
  [MutationTypes.SET_SAVE_LIST](state, payload) {
    const index = state.tagList.findIndex((sticker) => sticker.id === payload.id);
    if (index !== -1) return;
    state.tagList = [...state.tagList, payload];
    const parsed = JSON.stringify(state.tagList);
    localStorage.setItem(STORAGE_KEY, parsed);
  },
  [MutationTypes.SET_REMOVE_LIST](state, payload) {
    const index = state.tagList.findIndex((sticker) => sticker.id === payload.id);
    state.tagList.splice(index, 1);

    const parsed = JSON.stringify(state.tagList);
    localStorage.setItem(STORAGE_KEY, parsed);
  },
};
