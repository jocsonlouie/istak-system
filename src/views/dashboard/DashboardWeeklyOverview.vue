<template>
  <v-card style="height: 100%">
    <v-card-title class="align-start">
      <span class="font-weight-semibold text-subtitle-1 text-md-h6"
        >Total Stocks Per Inventory</span
      >

      <!-- <v-spacer></v-spacer>

      <v-btn icon small class="mt-n2 me-n3">
        <v-icon size="22">
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn> -->
    </v-card-title>

    <div class="d-flex justify-center my-2 align-content-center h-100">
      <!-- Chart -->
      <vue-apex-charts
        type="bar"
        :options="chartOptions"
        :series="series"
        class="w-100 bg-primary"
        height="300"
      ></vue-apex-charts>
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

const customInventoryRef = collection(db, "custom-inventory");
const mainInventoryRef = collection(db, "inventory");

export default {
  components: {
    VueApexCharts,
  },

  data: function() {
    return {
      chart_data: [30, 40, 45],
      chart_header: ["Vaccines", "Lab Tests", "Topical"],
      chartOptions: {
        chart: {
          toolbar: {
            show: false,
          },
          id: "vuechart-example",
          offsetX: -15,
          redrawOnParentResize: true,
          //width: 400
        },
        xaxis: {
          categories: ["Vaccines", "Lab Tests", "Topical"],
          labels: {
            show: true,
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

      series: [
        {
          name: "Stock",
          data: [30, 40, 45],
        },
      ],
    };
  },

  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      onSnapshot(customInventoryRef, (snapshot1) => {
        let itemsCInventory = [];
        let itemsInventory = [];
        let header = [];
        let data = [];

        snapshot1.forEach((doc) => {
          itemsCInventory.push({
            name: doc.data().name,
            id: doc.id,
          });
        });
        this.customInventories = itemsCInventory;

        onSnapshot(mainInventoryRef, (snapshot2) => {
          header = [];
          data = [];
          let stocks = [];
          snapshot2.forEach((doc) => {
            itemsCInventory.forEach((item) => {
              if (doc.data().inventory_id === item.id) {
                stocks.push({
                  name: item.name,
                  stock: doc.data().totalstocks,
                  id: item.id,
                });
              }
            });

            itemsInventory.push({
              name: doc.data().itemname,
              id: doc.data().inventory_id,
            });
          });

          let res = stocks.reduce((ac, a) => {
            let ind = ac.findIndex((x) => x.id === a.id);
            ind === -1 ? ac.push(a) : (ac[ind].stock += a.stock);
            return ac;
          }, []);
          // console.log(stocks, res);

          res.forEach((item) => {
            header.push(item.name);
            data.push(item.stock);
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
      });
    },
  },
  setup() {
    // const ins = getCurrentInstance()?.proxy;
    // const $vuetify = ins && ins.$vuetify ? ins.$vuetify : null;
    // let chart_header = [];
    // let chart_data = [];
    // let itemsCustomInventory = [];
    // let itemsInventory = [];
    // let itemsStocksInventory = [];
    // onSnapshot(customInventoryRef, (snapshot) => {
    //   snapshot.forEach((doc) => {
    //     itemsCustomInventory.push({
    //       name: doc.data().name,
    //       id: doc.id,
    //     });
    //   });
    //   // console.log(itemsCustomInventory);
    // });

    // onSnapshot(mainInventoryRef, (snapshot) => {
    //   let stocks = [];
    //   snapshot.forEach((doc) => {
    //     itemsCustomInventory.forEach((item) => {
    //       if (doc.data().inventory_id === item.id) {
    //         stocks.push({
    //           name: item.name,
    //           stock: doc.data().totalstocks,
    //           id: item.id,
    //         });
    //       }
    //     });
    //     itemsInventory.push({
    //       name: doc.data().itemname,
    //       id: doc.data().inventory_id,
    //     });
    //   });

    //   let res = stocks.reduce((ac, a) => {
    //     let ind = ac.findIndex((x) => x.id === a.id);
    //     ind === -1 ? ac.push(a) : (ac[ind].stock += a.stock);
    //     return ac;
    //   }, []);

    //   res.forEach((item) => {
    //     chart_header.push(item.name);
    //     chart_data.push(item.stock);
    //   });

    //   console.log(chart_header);
    //   console.log(["chart_header", "test", "Test"]);
    // });

    // const chartOptions = {
    //   colors: [
    //     $vuetify.theme.currentTheme.primary,
    //     $vuetify.theme.currentTheme.info,
    //     $vuetify.theme.currentTheme.warning,
    //   ],
    //   chart: {
    //     type: "bar",
    //     toolbar: {
    //       show: false,
    //     },
    //     offsetX: -15,
    //     redrawOnParentResize: true,
    //   },
    //   plotOptions: {
    //     bar: {
    //       columnWidth: "40%",
    //       distributed: true,
    //       borderRadius: 8,
    //       startingShape: "rounded",
    //       endingShape: "rounded",
    //     },
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   legend: {
    //     show: false,
    //   },
    //   xaxis: {
    //     categories: chart_header,
    //     axisBorder: {
    //       show: false,
    //     },
    //     axisTicks: {
    //       show: false,
    //     },
    //     tickPlacement: "on",
    //     labels: {
    //       show: true,
    //       style: {
    //         fontSize: "10px",
    //       },
    //     },
    //   },
    //   yaxis: {
    //     show: true,
    //     tickAmount: 4,
    //     labels: {
    //       offsetY: 3,
    //       formatter: (value) => `${value}`,
    //     },
    //   },
    //   stroke: {
    //     width: [2, 2],
    //   },
    //   grid: {
    //     strokeDashArray: 12,
    //     padding: {
    //       right: 0,
    //     },
    //   },
    // };

    // const chartData = [
    //   {
    //     data: chart_data,
    //   },
    // ];

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
