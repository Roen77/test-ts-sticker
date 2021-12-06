<template>
  <div class="main-list">
    <Loadingbar v-if="loading" />
    <div class="empty bd" v-if="!listchk">데이터가 없습니다.</div>
    <div v-else class="sticker-items">
      <div class="sticker-item" v-for="(list, index) in lists" :key="index">
        <SearchItem :list="list" />
      </div>
    </div>
    <div class="loading-bg" v-if="loading"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Loadingbar from "./Loadingbar.vue";
import SearchItem from "./SearchItem.vue";

export default defineComponent({
  components: { Loadingbar, SearchItem },
  props: {
    lists: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    listchk() {
      return this.lists && this.lists.length > 0;
    },
  },
});
</script>
