<template>
  <div>
    <h3 class="search-header en">sticker 검색</h3>
    <SearchForm :loading="loading" />
    <SearchList :lists="lists" :loading="loading" />
    <MoreSearchItem v-if="!!lists.length" />
  </div>
</template>

<script lang="ts">
import MoreSearchItem from "@/components/MoreSearchItem.vue";
import SearchForm from "@/components/SearchForm.vue";
import SearchList from "@/components/SearchList.vue";
import { store } from "@/store";
import { MutationTypes } from "@/store/mutations";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
  components: { SearchForm, SearchList, MoreSearchItem },
  setup() {
    const loading = computed(() => store.state.loading);
    const lists = computed(() => store.state.lists);
    onMounted(() => {
      store.commit(MutationTypes.SET_STATE, {
        lists: [],
        keywordsList: [],
      });
    });
    return { loading, lists };
  },
});
</script>

<style scoped>
.search-header {
  font-size: 35px;
  padding: 30px 0;
  font-weight: bold;
  color: #333;
}
</style>
