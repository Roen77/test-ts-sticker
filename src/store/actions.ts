import { ActionContext, ActionTree } from "vuex";
import { Mutations, MutationTypes } from "./mutations";
import { State } from "./state";
import { keyword, search } from "@/api/index";
import { keywordType, sticker } from "@/type";

// 액션 타입
export enum ActionTypes {
  FETCH_SEARCH = "FETCH_SEARCH",
  FETCH_KEYWORD = "FETCH_KEYWORD",
}

// action
type ActionAugments = Omit<ActionContext<State, State>, "commit"> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
};
export type Actions = {
  [ActionTypes.FETCH_SEARCH](
    { commit }: ActionAugments,
    payload: { searchData: string; limit: string; offset?: number }
  ): Promise<sticker[] | unknown>;
  [ActionTypes.FETCH_KEYWORD](
    { commit }: ActionAugments,
    payload: { searchData: string; limit: string }
  ): Promise<keywordType[] | unknown>;
};

export const actions: ActionTree<State, State> & Actions = {
  // gif 검색
  async [ActionTypes.FETCH_SEARCH]({ commit, state }, { searchData, limit, offset }) {
    // 로딩 시작
    commit(MutationTypes.SET_STATE, {
      ...state,
      loading: true,
    });
    try {
      // 검색 데이터 저장
      const { data } = await search.fetchs(searchData, limit, offset);
      if (!offset) {
        // 처음 검색 데이터 불러와서 저장
        commit(MutationTypes.SET_STATE, {
          ...state,
          lists: data.data,
          searchData,
          limit,
        });
      } else {
        // 다음 검색 데이터 불러와서 저장
        commit(MutationTypes.SET_STATE, {
          ...state,
          lists: state.lists.concat(data.data),
          searchData,
          limit,
        });
      }
      return data.data;
    } catch (error) {
      commit(MutationTypes.SET_STATE, {
        ...state,
        iserror: true,
      });
    } finally {
      // 로딩 종료
      commit(MutationTypes.SET_STATE, {
        ...state,
        loading: false,
        keywordsList: [],
      });
    }
  },
  // 추천 검색
  async [ActionTypes.FETCH_KEYWORD]({ commit, state }, { searchData, limit }) {
    try {
      const { data } = await keyword.fetchs(searchData, limit);
      commit(MutationTypes.SET_STATE, {
        ...state,
        keywordsList: data.data,
      });
      return data.data;
    } catch (error) {
      commit(MutationTypes.SET_STATE, {
        ...state,
        iserror: true,
      });
    }
  },
};
