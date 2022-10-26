<template>
  <v-fade-transition mode="out-in">
    <v-icon :key="this.$vuetify.theme.dark" @click="toggle_dark_mode">
      {{ this.$vuetify.theme.dark ? icons.mdiWeatherSunny : icons.mdiWeatherNight }}
    </v-icon>
  </v-fade-transition>
</template>

<script>
import { mdiWeatherNight, mdiWeatherSunny } from '@mdi/js'

export default {
  setup() {
    return {
      icons: {
        mdiWeatherNight,
        mdiWeatherSunny,
      },
    }
  },
  mounted() {
    const theme = localStorage.getItem("dark_theme");
    if (theme) {
      if (theme === "true") {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.$vuetify.theme.dark = true;
      localStorage.setItem(
        "dark_theme",
        this.$vuetify.theme.dark.toString()
      );
    }
  },
  methods: {
    toggle_dark_mode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
      return localStorage.getItem("dark_theme");
    }
  }
}
</script>

<style>

</style>
