<template>
  <v-card>
    <v-card-title class="align-start">
      <span class="font-weight-semibold">Quick Statistics</span>
      <v-spacer></v-spacer>
      <v-btn icon small class="me-n3 mt-n2">
        <v-icon>
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle class="mb-5 mt-n5">
      <span class=" text--primary me-1">Statistics in a glance.</span>
    </v-card-subtitle>

    <v-card-text>
      <v-row>
        <v-col
          v-for="data in statisticsData"
          :key="data.title"
          cols="6"
          md="3"
          class="d-flex align-center"
        >
          <v-avatar
            size="44"
            :color="resolveStatisticsIconVariation(data.title).color"
            rounded
            class="elevation-1"
          >
            <v-icon dark color="white" size="30">
              {{ resolveStatisticsIconVariation(data.title).icon }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              {{ data.title }}
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ data.total }}
            </h3>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiAccountOutline,
  mdiCurrencyUsd,
  mdiTrendingUp,
  mdiDotsVertical,
  mdiLabelOutline,
  mdiPackage,
  mdiClipboardCheckMultiple,
  mdiPackageVariant,
  mdiTablePlus,
  mdiDog,
} from "@mdi/js";

export default {
  setup() {
    const statisticsData = [
      {
        title: "Inventories",
        total: "7",
      },
      {
        title: "Total Items",
        total: "658",
      },
      {
        title: "Total Stocks",
        total: "1444",
      },
      {
        title: "New Items",
        total: "7",
      },
    ];

    const resolveStatisticsIconVariation = (data) => {
      if (data === "Inventories") return { icon: mdiPackage, color: "primary" };
      if (data === "Total Items")
        return { icon: mdiClipboardCheckMultiple, color: "success" };
      if (data === "Total Stocks")
        return { icon: mdiPackageVariant, color: "warning" };
      if (data === "New Items") return { icon: mdiTablePlus, color: "info" };

      return { icon: mdiDog, color: "success" };
    };

    return {
      statisticsData,
      resolveStatisticsIconVariation,

      // icons
      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiPackage,
        mdiLabelOutline,
        mdiCurrencyUsd,
        mdiClipboardCheckMultiple,
        mdiPackageVariant,
        mdiTablePlus,
        mdiDog,
      },
    };
  },
};
</script>
