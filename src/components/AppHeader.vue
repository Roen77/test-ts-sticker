<template>
  <header>
    <div class="inner">
      <h1 class="logo en">
        <router-link to="/">Sticker</router-link>
      </h1>
      <!-- 메뉴리스트 -->
      <ul class="haader-list">
        <li>
          <router-link to="/">홈</router-link>
        </li>
        <li>
          <router-link to="/profile">즐겨찾기 리스트</router-link>
        </li>
      </ul>
    </div>
  </header>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>
