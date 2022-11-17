<template>
  <v-card>
    <v-card-title class="align-start">
      <span class="font-weight-semibold text-subtitle-1">Other Summaries</span>
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
        <v-col cols="6" md="6" class="d-flex align-center">
          <v-avatar size="44" color="primary" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiAccount }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Users
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ totalUsers }}
            </h3>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" md="6" class="d-flex align-center">
          <v-avatar size="44" color="success" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiAccountStar }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Admins
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ totalAdmins }}
            </h3>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" md="6" class="d-flex align-center">
          <v-avatar size="44" color="info" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiBarcodeScan }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Barcode Scans
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ totalScans }}
            </h3>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" md="6" class="d-flex align-center">
          <v-avatar size="44" color="warning" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiEmail }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Emails Sent
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ totalEmails }}
            </h3>
          </div>
        </v-col>
      </v-row>


    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiAccount, mdiAccountStar, mdiEmail, mdiBarcodeScan } from "@mdi/js";
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

const usersColRef = collection(db, "users");
const emailRef = collection(db, "emails");
const barcodeRef = collection(db, "barcode-transactions");

export default {
  setup() {
    return {
      icons: {
        mdiAccount,
        mdiAccountStar,
        mdiEmail,
        mdiBarcodeScan
      },
    };
  },

  created() {
    this.initialize();
  },

  data: () => ({
    totalUsers: 0,
    totalAdmins: 0,
    totalScans: 0,
    totalEmails: 0,
  }),

  methods: {
    async initialize() {
      onSnapshot(usersColRef, (snapshot) => {
        let items = [];
        snapshot.forEach((doc) => {
          items.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.totalUsers = items.length;
      });

      const q1 = query(usersColRef, where("role", "==", "Inventory Admin"));
      onSnapshot(q1, (querySnapshot1) => {
        let uAdmins = [];
        querySnapshot1.forEach((doc) => {
          uAdmins.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.totalAdmins = uAdmins.length;
      });

      onSnapshot(emailRef, (snapshot) => {
        let emails = [];
        snapshot.forEach((doc) => {
          emails.push({
            value: doc.data().name,
            id: doc.id,
          });
        });
        this.totalEmails = emails.length;
      });

      const q2 = query(barcodeRef, where("scanorgen", "==", "Scan"));
      onSnapshot(q2, (snapshot) => {
        let scans = [];
        snapshot.forEach((doc) => {
          scans.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.totalScans = scans.length;
      });
    },
  },
};
</script>
