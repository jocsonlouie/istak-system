<template>
  <v-card>
    <v-card-title class="align-start">
      <span class="font-weight-semibold text-subtitle-1 text-md-h6">Inventory Summaries</span>
      <v-spacer></v-spacer>
      <!-- <v-btn icon small class="me-n3 mt-n2">
        <v-icon>
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn> -->
    </v-card-title>

    <v-card-subtitle class="mb-5 mt-n5">
      <span class=" text--primary me-1">Total counts</span>
    </v-card-subtitle>

    <v-card-text>
      <v-row>
        <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="primary" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiPackage }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Inventories
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ totalCustomInventory }}
            </h3>
          </div>
        </v-col>
        <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="success" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiPackage }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Items
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ totalItems }}
            </h3>
          </div>
        </v-col>

        <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="info" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiPackage }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Display Stocks
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ displayStocks }}
            </h3>
          </div>
        </v-col>

        <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="warning" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiPackage }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Available Stocks
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ totalStocks }}
            </h3>
          </div>
        </v-col>

        <!-- <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="info" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiEmail }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Emails Sent
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ newItems }}
            </h3>
          </div>
        </v-col> -->
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
  mdiEmail,
} from "@mdi/js";
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

const customInventory = collection(db, "custom-inventory");
const mainInventoryColRef = collection(db, "inventory");
const emailRef = collection(db, "emails");

export default {
  data: () => ({
    totalCustomInventory: "-",
    displayStocks: "-",
    totalStocks: "-",
    newItems: "-",
    totalItems: "-"
  }),
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
        title: "Total Items",
        total: "7",
      },
      // {
      //   title: "New Items",
      //   total: "7",
      // },
    ];

    const resolveStatisticsIconVariation = (data) => {
      if (data === "Inventories") return { icon: mdiPackage, color: "primary" };
      if (data === "Items")
        return { icon: mdiClipboardCheckMultiple, color: "success" };
      if (data === "Display Stocks")
        return { icon: mdiPackageVariant, color: "warning" };
      
      // if (data === "New Items") return { icon: mdiTablePlus, color: "info" };

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
        mdiEmail,
      },
    };
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      onSnapshot(customInventory, (snapshot) => {
        let items = [];
        snapshot.forEach((doc) => {
          items.push({
            value: doc.data().name,
            id: doc.id,
          });
        });
        this.totalCustomInventory = items.length;
      });

      onSnapshot(emailRef, (snapshot) => {
        let items = [];
        snapshot.forEach((doc) => {
          items.push({
            value: doc.data().name,
            id: doc.id,
          });
        });
        this.newItems = items.length;
      });

      onSnapshot(mainInventoryColRef, (snapshot) => {
        let items2 = [];
        let sumAv = 0;
        let sumDis = 0;
        snapshot.forEach((doc) => {
          items2.push({
            ...doc.data(),
            id: doc.id,
          });

          sumAv += doc.data().available;
          sumDis += doc.data().display;
        });
        //TOTAL ITEMS, TOTAL AVAILABLE, TOTAL DISPLAY
        this.totalItems = items2.length;
        this.totalStocks = sumAv;
        this.displayStocks = sumDis;
      });
    },
  },
};
</script>
