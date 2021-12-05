<template>
  <div v-if="showMoreBtn">
    <button class="primary-btn more-btn" @click="moreSearch">더보기</button>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { ActionTypes } from "@/store/actions";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const offset = ref(0);
    const searchData = computed(() => store.state.searchData);
    const limit = computed(() => store.state.limit);
    const lists = computed(() => store.state.lists);
    const showMoreBtn = computed(() => {
      if ((lists.value && lists.value.length >= 100) || lists.value.length < 10) {
        return false;
      } else return true;
    });
    const moreSearch = () => {
      offset.value = Number(offset.value) + Number(limit.value);
      store.dispatch(ActionTypes.FETCH_SEARCH, {
        searchData: searchData.value,
        limit: limit.value,
        offset: offset.value,
      });
    };
    return { moreSearch, offset, showMoreBtn };
  },
});
</script>

<style scoped></style>
