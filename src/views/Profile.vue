<template>
  <div class="profile">
    <h3>Tag Sticker</h3>
    <SearchList :lists="lists" :loading="loading" />
  </div>
</template>

<script lang="ts">
import SearchList from "@/components/SearchList.vue";
import { store } from "@/store";
import { computed, defineComponent } from "vue";

export default defineComponent({
  components: { SearchList },
  setup() {
    const loading = computed(() => store.state.loading);
    const lists = computed(() => store.state.tagList);
    return { loading, lists };
  },
});
</script>

<style scoped>
.profile {
  padding: 20px 0;
}
.profile h3 {
  padding: 20px 0;
}
</style>
