<template>
  <v-card style="height: 100%">
    <v-card-title class="align-start">
      <span class="font-weight-semibold text-subtitle-1 text-md-h6"
        >Top Inventory Items</span
      >

      <!-- <v-spacer></v-spacer>

      <v-btn icon small class="mt-n2 me-n3">
        <v-icon size="22">
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn> -->
    </v-card-title>

    <v-card-text>
      <!-- Chart -->
      <vue-apex-charts
        type="line"
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
} from "@firebase/firestore";

const usersRef = collection(db, "users");
const mainInventoryRef = collection(db, "inventory");

export default {
  components: {
    VueApexCharts,
  },

  data: function() {
    return {
      chart_data: [30, 40, 45, 100],
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
      series: [
        {
          name: "Consume Amount",
          data: [4, 3, 10, 9, 29, 19, 100, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5],
        },
      ],
      chartOptions: {
        chart: {
          toolbar: {
            show: false,
          },
          height: 210,
          type: "line",
          offsetX: -15,
        },
        forecastDataPoints: {
          count: 7,
        },
        stroke: {
          width: 5,
          curve: "smooth",
        },
        xaxis: {
          type: "text",
          categories: [
            "1/11/2000",
            "2/11/2000",
            "3/11/2000",
            "4/11/2000",
            "5/11/2000",
            "6/11/2000",
            "7/11/2000",
            "8/11/2000",
            "9/11/2000",
            "10/11/2000",
            "11/11/2000",
            "12/11/2000",
            "1/11/2001",
            "2/11/2001",
            "3/11/2001",
            "4/11/2001",
            "5/11/2001",
            "6/11/2001",
          ],
          tickAmount: 10,
          labels: {
            show: true,
            style: {
              fontSize: "10px",
            },
          },
        },
        title: {
          align: "left",
          style: {
            fontSize: "10px",
            color: "#666",
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            gradientToColors: ["#FDD835"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
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
      let transactions = [];
      const totals = [];
      let header = [];
      let data = [];

      const querySnapshot = await getDocs(
        collection(db, "barcode-transactions")
      );
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().amount != null) {
          transactions.push({
            name: doc.data().itemname,
            amount: doc.data().amount,
            id: doc.data().code,
          });
        }
      });

      transactions.forEach((x) => {
        const obj = totals.find((o) => o.id === x.id);
        if (obj) {
          obj.amount = parseInt(obj.amount) + parseInt(x.amount);
        } else {
          totals.push(x);
        }
      });

      totals.forEach((item) => {
        header.push(item.name);
        data.push(parseInt(item.amount));
      });

      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          categories: header,
        },
      };

      this.series = [
        {
          data: data,
        },
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
