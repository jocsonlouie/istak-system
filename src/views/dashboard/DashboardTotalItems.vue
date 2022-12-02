<template>
  <v-card style="height: 100%">
    <v-card-title class="align-start">
      <span class="font-weight-semibold text-subtitle-1 text-md-h6"
        >Total Items Per Inventory</span
      >
      <!-- <v-btn icon small class="mt-n2 me-n3">
        <v-icon size="22">
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn> -->
    </v-card-title>

    <div class="d-flex justify-center my-2">
      <!-- Chart -->
      <vue-apex-charts
        type="pie"
        :width="chartOptions.chart.width"
        :options="chartOptions"
        :series="series"
      ></vue-apex-charts>

      <!-- <div class="d-flex align-center">
        <h3 class="text-2xl font-weight-semibold me-4">
          45%
        </h3>
        <span
          >Your sales perfomance in 45% 🤩 better compare to last month</span
        >
      </div> -->
    </div>
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

const customInventoryRef = collection(db, "custom-inventory");
const mainInventoryRef = collection(db, "inventory");

export default {
  components: {
    VueApexCharts,
  },

  data: function() {
    return {
      chart_data: [30, 40, 45],
      countAdmin: 0,
      countNonStaff: 0,
      countStaff: 0,
      countBlock: 0,
      series: [44, 55, 13, 43, 22, 22, 43],
      chartOptions: {
        chart: {
          width: 400,
          offsetX: -15,
          type: "pie",
        },
        theme: {
          monochrome: {
            enabled: false,
          },
        },
        labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
        legend: {
          position: "bottom",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 350,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },

  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      let customInventory = [];
      let mainInventory = [];
      let header = [];
      let data = [];

      // const querySnapshot = await getDocs(collection(db, "custom-inventory"));
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   customInventory.push({
      //     name: doc.data().name,
      //     id: doc.id,
      //   });
      // });

      onSnapshot(customInventoryRef, (snapshot) => {
        customInventory = [];
        mainInventory = [];
        header = [];
        data = [];
        snapshot.forEach((doc) => {
          customInventory.push({
            name: doc.data().name,
            id: doc.id,
          });
        });

        onSnapshot(mainInventoryRef, (snapshot2) => {
          snapshot2.forEach((doc) => {
            mainInventory.push({
              name: doc.data().itemname,
              id: doc.data().inventory_id,
            });
          });

          header = [];
          data = [];

          const result = Object.entries(
            mainInventory.reduce((acc, { id }) => {
              acc[id] = (acc[id] || 0) + 1;

              return acc;
            }, {})
          ).map(([k, v]) => ({ id: k, count: v }));

          let arr3 = result.map((item, i) =>
            Object.assign({}, item, customInventory[i])
          );

          arr3.forEach((item) => {
            header.push(item.name);
            data.push(item.count);
          });

          this.chartOptions = {
            ...this.chartOptions,
            labels: header,
          };

          this.series = data;
        });
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
