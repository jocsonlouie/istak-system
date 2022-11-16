<template>
  <v-card style="height: 100%">
    <v-card-title class="align-start">
      <span class="font-weight-semibold">Total Items Analytics</span>

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
        ref="myChart"
        type="pie"
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

const usersRef = collection(db, "users");
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
      chart_header: [
        "Inventory Admin",
        "Inventory Staff",
        "Non-Inventory Staff",
        "Can't Access",
      ],
      series: [44, 55, 13, 43, 22],
      chartOptions: {
        chart: {
          offsetX: -15,
          type: "pie",
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
                width: 200,
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
    async initialize() {
      let customInventory = [];
      let mainInventory = [];

      const querySnapshot = await getDocs(collection(db, "custom-inventory"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        customInventory.push({
          name: doc.data().name,
          id: doc.id,
        });
      });

      const querySnapshot2 = await getDocs(collection(db, "inventory"));
      querySnapshot2.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        mainInventory.push({
          name: doc.data().itemname,
          id: doc.data().inventory_id,
        });
      });

      const result = Object.entries(
        mainInventory.reduce((acc, { id, name }) => {
          acc[id] = (acc[id] || 0) + 1;
          acc[name] = name;
          return acc;
        }, {})
      ).map(([k, v]) => ({ id: k, count: v }));

      console.log(result);

      // console.log(customInventory, mainInventory);
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
