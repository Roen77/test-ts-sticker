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
    const route = useRoute();
    const checktagList = () => {
      const findvalue = tagList.value.find((tag) => {
        return tag.id == props.list.id;
      });
      console.log(findvalue, "??");
      if (findvalue) {
        ischeck.value = true;
      } else {
        ischeck.value = false;
      }
    };
    const onSaveList = () => {
      ischeck.value = true;
      store.commit(MutationTypes.SET_SAVE_LIST, props.list);
    };
    const onRemoveList = () => {
      if (route.name === "Home") ischeck.value = false;
      store.commit(MutationTypes.SET_REMOVE_LIST, props.list);
    };
    return { onSaveList, ischeck, checktagList, onRemoveList };
  },
  mounted() {
    this.checktagList();
  },
});
</script>

<style scoped></style>
