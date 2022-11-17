<template>
  <v-card style="height: 100%">
    <v-card-title class="align-start">
      <span class="font-weight-semibold text-subtitle-1 text-md-h6">Total Users Per Roles</span>
<!-- 
      <v-spacer></v-spacer>

      <v-btn icon small class="mt-n2 me-n3">
        <v-icon size="22">
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn> -->
    </v-card-title>

    <div class="d-flex justify-center my-2" >
      <!-- Chart -->
      <vue-apex-charts
        class="w-100"
        ref="myChart"
        type="donut"
        :options="chartOptions"
        :series="series"
        :width="chartOptions.chart.width"
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
      chartOptions: {
        labels: [
          "Inventory Admin",
          "Inventory Staff",
          "Non-Inventory Staff",
          "Can't Access",
        ],
        chart: {
          width: 320,
          type: "donut",
          offsetX: -15,
        },
        plotOptions: {
          donut: {
            // size: "120%",
          },
        },
        legend: {
          position: "bottom",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 320,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },

      series: [44, 55, 41, 17, 15],
    };
  },

  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      let users = [];

      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        users.push({
          name: doc.data().name,
          id: doc.id,
        });

        if (doc.data().role == "Inventory Admin") {
          this.countAdmin++;
        }

        if (doc.data().role == "Inventory Staff") {
          this.countStaff++;
        }

        if (doc.data().role == "Non-Inventory Staff") {
          this.countNonStaff++;
        }

        if (doc.data().role == "Can't Access") {
          this.countBlock++;
        }
      });

      this.series = [
        this.countAdmin,
        this.countStaff,
        this.countNonStaff,
        this.countBlock,
      ];
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
