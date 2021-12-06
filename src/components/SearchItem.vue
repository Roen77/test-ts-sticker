<template>
  <div>
    <!-- 스티커사진 -->
    <div class="stickers bd">
      <img :src="list.images.original.url" alt="" />
    </div>
    <div class="des bd">
      <p>{{ list.title }}</p>
      <p class="username" v-if="list.username">by {{ list.username }}</p>
    </div>
    <span v-if="!ischeck" class="tag add" @click.prevent="onSaveList"></span>
    <span v-else class="tag remove" @click.prevent="onRemoveList"></span>
  </div>
  <div v-if="list.user" class="user-info" :class="{ active: isActive }">
    <div>
      <div class="user-header">
        <img v-if="list.user.avatar_url" :src="list.user.avatar_url" alt="#" />
        <div>
          <p>{{ list.user.username }}</p>
        </div>
      </div>
      <div class="description">
        {{ format() }}
      </div>
      <div class="social">
        <div v-if="list.user.instagram_url" class="instar">
          <a :href="list.user.instagram_url" target="_blank"></a>
        </div>
        <a v-if="list.user.website_url" :href="list.user.website_url" target="_blank"></a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
</script>

<style>
.sticker-item:hover .user-info {
  top: 0;
}
</style>
