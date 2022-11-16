<template>
  <v-card style="height: 100%">
    <v-card-title class="align-start">
      <span class="font-weight-semibold">Expiry Analytics</span>

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
        type="bar"
        :options="chartOptions"
        :series="series"
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
    </v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
// eslint-disable-next-line object-curly-newline
import { mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd } from "@mdi/js";
import { getCurrentInstance } from "@vue/composition-api";
import { onMounted, ref } from "@vue/composition-api";

import db from "@/fb";
import {
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  collection,
  where,
  query,
  getCountFromServer,
} from "@firebase/firestore";
import moment from "moment";

const usersRef = collection(db, "users");
const mainInventoryRef = collection(db, "inventory");

export default {
  components: {
    VueApexCharts,
  },

  data: function() {
    return {
      series: [
        {
          name: "Days",
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ],
      chartOptions: {
        chart: {
          id: "vuechart-example",
          offsetX: -15,
          redrawOnParentResize: true,
        },
        xaxis: {
          categories: ["Vaccines", "Lab Tests", "Topical"],
          labels: {
            show: false,
            style: {
              fontSize: "10px",
            },
          },
        },
        dataLabels: {
          enabled: true,
        },
        plotOptions: {
          bar: {
            columnWidth: "40%",
            borderRadius: 8,
            startingShape: "rounded",
            endingShape: "rounded",
          },
        },
        grid: {
          strokeDashArray: 12,
          padding: {
            right: 0,
          },
        },
      },
    };
  },

  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      let customInventory = [];
      let mainInventory = [];
      let header = [];
      let data = [];
      onSnapshot(mainInventoryRef, (snapshot) => {
        header = [];
        data = [];
        mainInventory = [];
        snapshot.forEach((doc) => {
          let dateExpiry = moment(doc.data().expiry);
          let todaysDate = moment();

          let diff =
            dateExpiry.diff(todaysDate, "days") === 0
              ? dateExpiry.diff(todaysDate, "days")
              : dateExpiry.diff(todaysDate, "days") + 1;

          if (diff <= 10) {
            mainInventory.push({
              name: doc.data().itemname,
              expiry: diff,
              id: doc.id,
            });
          }
        });

        mainInventory.forEach((item) => {
          header.push(item.name);
          data.push(item.expiry);
        });

        this.series = [
          {
            data: data,
          },
        ];

        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories: header,
            },
          },
        };
      });
    },
  },
  setup() {
    return {
      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiCurrencyUsd,
      },
    };
  },
};
</script>
