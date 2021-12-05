<template>
  <div>
    <AppHeader />
    <main>
      <div class="inner">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "./components/AppHeader.vue";

export default defineComponent({
  components: { AppHeader },
});
</script>
