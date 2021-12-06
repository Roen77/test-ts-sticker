# stick 검색앱

## 버전
vue3 + typescript


## 사용 API
[GIFY](https://developers.giphy.com/docs/api#quick-start-guide)

- [GIF 검색](https://developers.giphy.com/docs/api/endpoint#search)
- [GIF 추천검색](https://developers.giphy.com/docs/api/endpoint#search-suggestions)
## STORE
> store 타입 정의

- index.ts
```ts
import {
  createStore,
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  createLogger,
} from "vuex";
import { State, state } from "./state";
import { Mutations, mutations } from "./mutations";
import { Actions, actions } from "./actions";
export type Store = Omit<VuexStore<State>, "getters" | "commit" | "dispatch"> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};

export const store = createStore({
  plugins: process.env.NODE_ENV === "development" ? [createLogger()] : [],
  state,
  mutations,
  actions,
});
export function useStore(): Store {
  return store as Store;
}


```

<br>

- action.ts
```ts
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

```
<br>
- mutations.ts

```ts
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
  // 공통으로 state 업데이트하는 mutation
  [MutationTypes.SET_STATE](state, payload) {
    Object.keys(payload).forEach((key) => {
      state[key] = payload[key];
    });
  },
  // 즐겨찾기 한 데이터 로컬스토리지에 저장
  [MutationTypes.SET_SAVE_LIST](state, payload) {
    const index = state.tagList.findIndex((sticker) => sticker.id === payload.id);
    if (index !== -1) return;
    state.tagList = [...state.tagList, payload];
    const parsed = JSON.stringify(state.tagList);
    localStorage.setItem(STORAGE_KEY, parsed);
  },
  // 즐겨찾기 한 데이터 로컬스토리지에서 삭제
  [MutationTypes.SET_REMOVE_LIST](state, payload) {
    const index = state.tagList.findIndex((sticker) => sticker.id === payload.id);
    state.tagList.splice(index, 1);

    const parsed = JSON.stringify(state.tagList);
    localStorage.setItem(STORAGE_KEY, parsed);
  },
};

```
<br>

- state.ts
```ts
import { keywordType, sticker } from "@/type";
const STORAGE_KEY = "STICKER-TAGlIST";
const getTagList = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
// state 타입
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
  // 로컬스토리지에 저장된 데이터 가져오기
  tagList: getTagList || [],
  keywordsList: [],
  searchData: "",
  limit: "",
  loading: false,
  iserror: false,
};

```
<br>

> 정의한 타입을 사용하여 아래처럼 store 사용
```ts
// ~/components/SearchItem.vue

import { store } from "@/store";
import { MutationTypes } from "@/store/mutations";
import { useRoute } from "vue-router";
import { sticker } from "@/type";
import { computed, defineComponent, PropType, ref } from "vue";

export default defineComponent({
  props: {
    list: {
      type: Object as PropType<sticker>,
      required: true,
    },
  },
  setup(props) {
    const tagList = computed(() => store.state.tagList);
    const ischeck = ref(false);
    const isActive = ref(false);
    const route = useRoute();

    // 설명 포맷
    const format = () => {
      const des = props.list.user && props.list.user.description;
      const desFomat = des.split("");
      if (desFomat.length < 100) return des;
      else return `${desFomat.splice(0, 101).join("")}...`;
    };
    // 즐겨찾기 했는지 유무 확인
    const checktagList = () => {
      const findvalue = tagList.value.find((tag) => {
        return tag.id == props.list.id;
      });
      if (findvalue) {
        ischeck.value = true;
      } else {
        ischeck.value = false;
      }
    };
    // 즐겨찾기 저장(로컬 스토리지에 저장)
    const onSaveList = () => {
      ischeck.value = true;
      // mutations을 사용하여 데이터 저장
      store.commit(MutationTypes.SET_SAVE_LIST, props.list);
    };
    // 즐겨찾기 삭제(로컬 스토리지에서 삭제)
    const onRemoveList = () => {
      if (route.name === "Home") ischeck.value = false;
      // mutations을 사용하여 데이터 삭제
      store.commit(MutationTypes.SET_REMOVE_LIST, props.list);
    };
    return { ischeck, isActive, format, onSaveList, checktagList, onRemoveList };
  },
  mounted() {
    this.checktagList();
  },
});
```

## type 정의
- api 확인하여 가져올 데이터 타입 확인

`type.ts`
```ts
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

```
<br>

## 배포 및 서버리스
- netlify를 사용하여 배포
- api 호출시 `api_key`가 노출되지 않도록
netlify 에서 제공하는 서버리스 사용

> [netlify 서버리스 참고자료](https://docs.netlify.com/functions/overview/)

- api/index.ts

```ts
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

```
<br>

- netlify/functions/sticker.ts
```ts
import { Handler } from "@netlify/functions";
import axios from "axios";
const handler: Handler = async (event) => {
  const payload = JSON.parse(event.body);
  const { searchData, limit, offset } = payload;

  const instance = await axios.create({
    baseURL: "https://api.giphy.com/v1/",
  });
  const API_KEY = process.env.VUE_APP_APIKEY;

  const url = offset
    ? `stickers/search?api_key=${API_KEY}&q=${searchData}&limit=${limit}&rating=g&lang=ko&offset=${offset}`
    : `stickers/search?api_key=${API_KEY}&q=${searchData}&limit=${limit}&rating=g&lang=ko}`;
  try {
    const { data } = await instance.get(url);
    if (data.meta.status === 400 || data.meta.status === 404) {
      return {
        statusCode: 400,
        body: data.meta.msg,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: error.message,
    };
  }
};

export { handler };

```

<br>

- netlify/functions/keyword.ts
```ts
import { Handler } from "@netlify/functions";
import axios from "axios";
const handler: Handler = async (event) => {
  const payload = JSON.parse(event.body);
  const { searchData, limit } = payload;

  const instance = await axios.create({
    baseURL: "https://api.giphy.com/v1/",
  });
  const API_KEY = process.env.VUE_APP_APIKEY;

  const url = `tags/related/${searchData}?api_key=${API_KEY}&limit=${limit}&rating=g`;
  try {
    const { data } = await instance.get(url);
    if (data.meta.status === 400 || data.meta.status === 404) {
      return {
        statusCode: 400,
        body: data.meta.msg,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: error.message,
    };
  }
};

export { handler };

```