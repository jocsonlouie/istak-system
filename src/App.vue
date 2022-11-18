<template>
  <component :is="resolveLayout" class="overflow-hidden">
    <router-view></router-view>
  </component>
</template>

<script>
import { computed } from "@vue/composition-api";
import { useRouter } from "@/utils";
import LayoutBlank from "@/layouts/Blank.vue";
import LayoutContent from "@/layouts/Content.vue";

export default {
  components: {
    LayoutBlank,
    LayoutContent,
  },
  setup() {
    const { route } = useRouter();

    const resolveLayout = computed(() => {
      // Handles initial route
      if (route.value.name === null) return null;

      if (route.value.meta.layout === "blank") return "layout-blank";

      return "layout-content";
    });

    return {
      resolveLayout,
    };
  },
};
</script>

<style>
.theme--dark.v-toolbar.v-sheet {
  background-color: #312d4c;
}

.photo-capture video {
  border-radius: 10px !important;
  overflow: hidden !important;
}
.photo-capture {
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}
.photo-capture h1 {
  display: none !important;
}
</style>
