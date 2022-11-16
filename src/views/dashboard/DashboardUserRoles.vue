<template>
  <v-card>
    <v-card-title class="align-start">
      <span class="font-weight-semibold">User Roles</span>

      <v-spacer></v-spacer>

      <v-btn icon small class="mt-n2 me-n3">
        <v-icon size="22">
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <!-- Chart -->
      <vue-apex-charts
        :options="chartOptions"
        :series="chartData"
        height="210"
      ></vue-apex-charts>

      <!-- <div class="d-flex align-center">
        <h3 class="text-2xl font-weight-semibold me-4">
          45%
        </h3>
        <span
          >Your sales perfomance in 45% 🤩 better compare to last month</span
        >
      </div> -->

      <v-btn block color="primary" class="mt-3" outlined>
        Details
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
// eslint-disable-next-line object-curly-newline
import { mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd } from "@mdi/js";
import { getCurrentInstance } from "@vue/composition-api";
import { onMounted, ref } from "@vue/composition-api";

export default {
  components: {
    VueApexCharts,
  },
  setup() {
    const ins = getCurrentInstance()?.proxy;
    const $vuetify = ins && ins.$vuetify ? ins.$vuetify : null;

    const chartOptions = {
      colors: [
        $vuetify.theme.currentTheme.primary,
        $vuetify.theme.currentTheme.primary,
        $vuetify.theme.currentTheme.primary,
        $vuetify.theme.currentTheme.primary,
        $vuetify.theme.currentTheme.success,
        $vuetify.theme.currentTheme.primary,
        $vuetify.theme.currentTheme.primary,
      ],
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
        offsetX: -15,
        redrawOnParentResize: true,
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          distributed: true,
          borderRadius: 8,
          startingShape: "rounded",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          "Vaccines",
          "Lab Tests",
          "Topical",
          "Steroids",
          "Medications",
          "Oral Antibiotics",
          "Foods",
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        tickPlacement: "on",
        labels: {
          show: true,
          style: {
            fontSize: "10px",
          },
        },
      },
      yaxis: {
        show: true,
        tickAmount: 4,
        labels: {
          offsetY: 3,
          formatter: (value) => `${value}`,
        },
      },
      stroke: {
        width: [2, 2],
      },
      grid: {
        strokeDashArray: 12,
        padding: {
          right: 0,
        },
      },
    };

    const chartData = [
      {
        data: [40, 60, 50, 60, 75, 60, 50],
      },
    ];

    return {
      chartOptions,
      chartData,

      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiCurrencyUsd,
      },
    };
  },
};
</script>
