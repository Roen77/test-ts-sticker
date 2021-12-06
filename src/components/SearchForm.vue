<template>
  <form class="search-form" @submit.prevent="getSearchList">
    <input
      @input.prevent="onInput"
      ref="searchInput"
      v-model="search"
      class="search-input bd"
      type="text"
      placeholder="검색할 스티커를 입력해주세요"
    />
    <div class="selects">
      <select v-model="currentFilter" name="갯수">
        <option :value="filter" v-for="(filter, index) in filterData" :key="index">
          {{ filter }}
        </option>
      </select>
    </div>
    <button
      :class="{ inactive: searachInputChk }"
      class="primary-btn search-btn"
      :disabled="searachInputChk"
    >
      검색
    </button>
  </form>
  <div class="search-list bd" v-if="!!keywordList.length && !loading">
    <h3>추천 검색어</h3>
    <li
      @click="onKeywordClick(keyword)"
      class="search-item"
      v-for="keyword in keywordList"
      :key="keyword.analytics_response_payload"
    >
      <a href="#">{{ keyword.name }}</a>
    </li>
  </div>
  <div class="current-search">{{ currentSearch }} 검색 결과</div>
</template>

<script lang="ts">
import { store } from "@/store";
import { ActionTypes } from "@/store/actions";
import { computed, defineComponent, onMounted, ref } from "vue";
import { debounce } from "lodash";
import { keywordType } from "@/type";
import { MutationTypes } from "@/store/mutations";
export default defineComponent({
  setup() {
    const search = ref("");
    const currentSearch = ref("");
    const searchInput = ref<HTMLInputElement | null>(null);
    const currentFilter = ref("10");
    const filterData = ref(["10", "20", "30"]);
    const searachInputChk = computed(() => search.value.length === 0);
    const keywordList = computed(() => store.state.keywordsList);
    const loading = computed(() => store.state.loading);

    const fetchList = (inputValue: string) => {
      store.dispatch(ActionTypes.FETCH_SEARCH, {
        searchData: inputValue,
        limit: currentFilter.value,
      });
      currentSearch.value = inputValue;
      search.value = "";
      if (!searchInput.value) return;
      searchInput.value.focus();
    };

    const getSearchList = () => {
      fetchList(search.value);
    };

    const getKeywordList = () => {
      store.dispatch(ActionTypes.FETCH_KEYWORD, {
        searchData: search.value,
        limit: "5",
      });
    };
    const onInput = debounce(() => {
      if (searachInputChk.value) {
        return store.commit(MutationTypes.SET_STATE, {
          keywordsList: [],
        });
      }
      getKeywordList();
    }, 200);

    const onKeywordClick = (inputKeyword: keywordType) => {
      fetchList(inputKeyword.name);
    };

    onMounted(() => {
      searchInput.value?.focus();
    });

    return {
      filterData,
      currentFilter,
      search,
      searachInputChk,
      searchInput,
      keywordList,
      currentSearch,
      onInput,
      loading,
      getSearchList,
      getKeywordList,
      onKeywordClick,
    };
  },
});
</script>

<style scoped>
.inactive {
  background-color: #ddd;
  cursor: pointer;
}
.current-search {
  font-weight: bold;
  padding: 10px 0;
}
</style>
