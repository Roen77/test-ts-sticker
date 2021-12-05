<template>
  <div class="empty not-found">해당 페이지는 존재하지 않습니다.</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped>
.not-found {
  margin: 30px 0;
}
</style>
