import { ActionContext, ActionTree } from "vuex";
import { Mutations, MutationTypes } from "./mutations";
import { State } from "./state";
import { keyword, search } from "@/api/index";
import { keywordType, sticker } from "@/type";

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
// keywordType[]
export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.FETCH_SEARCH]({ commit, state }, { searchData, limit, offset }) {
    commit(MutationTypes.SET_STATE, {
      ...state,
      loading: true,
    });
    try {
      const { data } = await search.fetchs(searchData, limit, offset);
      if (!offset) {
        commit(MutationTypes.SET_STATE, {
          ...state,
          lists: data.data,
          searchData,
          limit,
        });
      } else {
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
      commit(MutationTypes.SET_STATE, {
        ...state,
        loading: false,
        keywordsList: [],
      });
    }
  },
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
