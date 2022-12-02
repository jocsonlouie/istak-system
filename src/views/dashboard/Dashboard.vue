<template>
  <v-row>
    <v-col cols="12" md="4">
      <dashboard-congratulation-john></dashboard-congratulation-john>
    </v-col>
    <v-col cols="12" md="8">
      <dashboard-statistics-card></dashboard-statistics-card>
    </v-col>

    <v-col cols="12" sm="4" md="2">
      <v-row class="match-height">
        <v-col cols="12" sm="12">
          <dashboard-small-card></dashboard-small-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" sm="8" md="5">
      <dashboard-total-items></dashboard-total-items>
    </v-col>
    <v-col cols="12" sm="6" md="5">
      <dashboard-weekly-overview></dashboard-weekly-overview>
    </v-col>

    <v-col cols="12" sm="6" md="6" xl="3">
      <dashboard-expiry></dashboard-expiry>
    </v-col>

    <v-col cols="12" sm="6" md="6" xl="3">
      <dashboard-most-consumed></dashboard-most-consumed>
    </v-col>

    <v-col cols="12" sm="6" md="6" xl="3">
      <dashboard-low-stocks></dashboard-low-stocks>
    </v-col>

    <v-col cols="12" sm="6" md="6" xl="3">
      <dashboard-user-roles></dashboard-user-roles>
    </v-col>

    <!-- <v-col cols="12" md="4" sm="6">
      <dashboard-card-total-earning></dashboard-card-total-earning>
    </v-col> -->

    <!-- <v-col cols="12" md="4">
      <v-row class="match-height">
        <v-col cols="12" sm="6">
          <statistics-card-vertical
            :change="totalProfit.change"
            :color="totalProfit.color"
            :icon="totalProfit.icon"
            :statistics="totalProfit.statistics"
            :stat-title="totalProfit.statTitle"
            :subtitle="totalProfit.subtitle"
          ></statistics-card-vertical>
        </v-col>
        <v-col cols="12" sm="6">
          <statistics-card-vertical
            :change="totalSales.change"
            :color="totalSales.color"
            :icon="totalSales.icon"
            :statistics="totalSales.statistics"
            :stat-title="totalSales.statTitle"
            :subtitle="totalSales.subtitle"
          ></statistics-card-vertical>
        </v-col>
        <v-col cols="12" sm="6">
          <statistics-card-vertical
            :change="newProject.change"
            :color="newProject.color"
            :icon="newProject.icon"
            :statistics="newProject.statistics"
            :stat-title="newProject.statTitle"
            :subtitle="newProject.subtitle"
          ></statistics-card-vertical>
        </v-col>

        <v-col cols="12" sm="6">
          <statistics-card-vertical
            :change="salesQueries.change"
            :color="salesQueries.color"
            :icon="salesQueries.icon"
            :statistics="salesQueries.statistics"
            :stat-title="salesQueries.statTitle"
            :subtitle="salesQueries.subtitle"
          ></statistics-card-vertical>
        </v-col>
      </v-row>
    </v-col> -->

    <!-- <v-col cols="12" md="4">
      <dashboard-card-sales-by-countries></dashboard-card-sales-by-countries>
    </v-col> -->
    <!-- <v-col cols="12">
      <dashboard-datatable></dashboard-datatable>
    </v-col>
    <v-col cols="12" md="8">
      <dashboard-card-deposit-and-withdraw></dashboard-card-deposit-and-withdraw>
    </v-col> -->
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiPackageVariant, mdiBarcodeScan } from "@mdi/js";
import StatisticsCardVertical from "@/components/statistics-card/StatisticsCardVertical.vue";

// demos
import DashboardCongratulationJohn from "./DashboardCongratulationJohn.vue";
import DashboardStatisticsCard from "./DashboardStatisticsCard.vue";
import DashboardCardTotalEarning from "./DashboardCardTotalEarning.vue";
import DashboardCardDepositAndWithdraw from "./DashboardCardDepositAndWithdraw.vue";
import DashboardCardSalesByCountries from "./DashboardCardSalesByCountries.vue";
import DashboardWeeklyOverview from "./DashboardWeeklyOverview.vue";
import DashboardDatatable from "./DashboardDatatable.vue";
import DashboardSmallCard from "./DashboardSmallCard.vue";
import DashboardUserRoles from "./DashboardUserRoles.vue";
import DashboardMostConsumed from "./DashboardMostConsumed.vue";
import DashboardTotalItems from "./DashboardTotalItems.vue";
import DashboardLowStocks from "./DashboardLowStocks.vue";
import DashboardExpiry from "./DashboardExpiry.vue";

import db from "@/fb";
import {
  addDoc,
  getDocs,
  doc as docFB,
  deleteDoc,
  onSnapshot,
  updateDoc,
  setDoc,
  collection,
  where,
  query,
  Timestamp,
} from "@firebase/firestore";

import schedule from "node-schedule";
import moment from "moment";

const mainInventoryColRef = collection(db, "inventory");
const barcodeRef = collection(db, "barcode-transactions");
const inventoriesFilterRef = collection(db, "inventory");

export default {
  components: {
    StatisticsCardVertical,
    DashboardCongratulationJohn,
    DashboardStatisticsCard,
    DashboardCardTotalEarning,
    DashboardCardDepositAndWithdraw,
    DashboardCardSalesByCountries,
    DashboardWeeklyOverview,
    DashboardDatatable,
    DashboardSmallCard,
    DashboardUserRoles,
    DashboardMostConsumed,
    DashboardTotalItems,
    DashboardLowStocks,
    DashboardExpiry,
  },

  data() {
    return {
      inventoryItems: [],
      totalInventory: {
        name: "Total items",
        value: "-",
        footer: "Inventory Analytics",
        icon: mdiPackageVariant,
      },
      scanInventory: {
        name: "Barcode scans",
        value: "-",
        footer: "Scan Analytics",
        icon: mdiBarcodeScan,
      },
    };
  },

  async created() {
    // schedule.scheduleJob("30 8 * * *", async () => {
    const querySnapshot = await getDocs(inventoriesFilterRef);
    let items = [];
    if (querySnapshot.empty) {
      this.items = items;
      this.loadingTable = false;
    } else {
      querySnapshot.forEach(async (doc) => {
        if (doc.data().stateDate != undefined) {
          if (
            moment(Timestamp.now().toDate()).format("MMM Do, ddd") !=
            moment(doc.data().stateDate.toDate()).format("MMM Do, ddd")
          ) {
            try {
              await setDoc(
                docFB(db, "inventory", doc.id),
                {
                  level:
                    parseInt(doc.data().totalstocks) <=
                    parseInt(doc.data().reorderlevel)
                      ? "error"
                      : "info",
                  state: "open",
                },
                { merge: true }
              );
            } catch (e) {
              console.log(e);
            }
          }
        } else if (doc.data().stateDate === undefined) {
          try {
            await setDoc(
              docFB(db, "inventory", doc.id),
              {
                level:
                  parseInt(doc.data().totalstocks) <=
                  parseInt(doc.data().reorderlevel)
                    ? "error"
                    : "info",
                state: "open",
                stateDate: Timestamp.now(),
              },
              { merge: true }
            );
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
    // });

    this.initialized();
  },

  methods: {
    async initialized() {
      onSnapshot(mainInventoryColRef, (snapshot) => {
        let items = [];
        snapshot.forEach((doc) => {
          items.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.totalInventory.value = "" + items.length;
      });
      const q2 = query(barcodeRef, where("scanorgen", "==", "Scan"));
      onSnapshot(q2, (snapshot) => {
        let items = [];
        snapshot.forEach((doc) => {
          items.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.scanInventory.value = "" + items.length;
      });
    },
  },
};
</script>
