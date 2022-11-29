<template>
  <v-app style="overflow: hidden;">
    <vertical-nav-menu :is-drawer-open.sync="isDrawerOpen"></vertical-nav-menu>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      fixed
      floating
      hide-overlay
      temporary
      right
      width="350"
    >
      <v-list-item>
        <v-list-item-icon>
          <v-btn
            color="primary"
            elevation="2"
            class="mr-2"
            fab
            small
            @click="drawer = !drawer"
          >
            <v-icon>{{ mdiBellOutline }}</v-icon>
          </v-btn>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-xl font-weight-semibold"
            >Notifications</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id + notification.barcode"
          class="ma-0"
          min-height="0"
        >
          <v-alert
            border="left"
            class="text-sm ma-0 mb-2"
            elevation="2"
            :type="notification.level"
            prominent
            dismissible
            v-if="!notification.isExpiry"
            @input="dismissAlert(notification.id)"
          >
            The item "{{ notification.itemname }}" has only
            <strong>{{ notification.available }} stock </strong> left.
          </v-alert>

          <v-alert
            border="left"
            class="text-sm ma-0 mb-2"
            elevation="2"
            :type="notification.level"
            prominent
            dismissible
            v-if="notification.isExpiry"
            @input="dismissAlert(notification.id)"
          >
            <div v-if="notification.expiry > 0">
              The item "{{ notification.itemname }}" has only
              <strong>{{ notification.expiry }} days </strong>
              left.
            </div>
            <div v-else>EXPIRED ITEM: "{{ notification.itemname }}"</div>
          </v-alert>
        </v-list-item>

        <v-list-item class="mt-1" v-if="isEmptyNotif">
          <v-alert
            border="left"
            class="text-sm "
            elevation="2"
            type="success"
            prominent
            width="100%"
          >
            No notification for today!
          </v-alert>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat absolute color="transparent">
      <div class="boxed-container w-full">
        <div class="d-flex align-center mx-6">
          <!-- Left Content -->
          <v-app-bar-nav-icon
            class="d-block d-lg-none me-2"
            @click="isDrawerOpen = !isDrawerOpen"
          ></v-app-bar-nav-icon>
          <v-text-field
            rounded
            dense
            outlined
            v-model="search"
            v-on:keyup="searchDialog = true"
            placeholder="Search an item..."
            :prepend-inner-icon="icons.mdiMagnify"
            class="app-bar-search flex-grow-0 hidden-xs-only"
            hide-details
          ></v-text-field>

          <!-- <v-autocomplete
            v-model="search"
            :items="searchItems"
            :loading="isLoading"
            dense
            rounded
            hide-details
            filled
            v-on:keyup.enter="onEnter"
            outlined
            :prepend-inner-icon="icons.mdiMagnify"
          ></v-autocomplete> -->

          <!-- Search modal -->
          <v-dialog v-model="searchDialog" max-width="550px">
            <v-card class="pa-5 d-flex flex-column w-full">
              <v-chip
                color="primary"
                class="d-flex justify-center rounded-pill font-weight-bold text-h6 pa-5 "
                >Search Item
              </v-chip>
              <v-card-title
                class="-d-flex w-full flex-column justify-center align-content-stretch  pa-0 rounded-lg my-3 overflow-hidden"
                style="align-items: stretch;"
              >
                <ais-instant-search
                  index-name="inventory"
                  :search-client="searchClient"
                  :query="search"
                >
                  <ais-search-box
                    placeholder="Search an item..."
                    v-model="search"
                    :show-loading-indicator="true"
                    v-show="false"
                  />
                  <v-text-field
                    rounded
                    dense
                    outlined
                    autofocus
                    v-model="search"
                    placeholder="Search an item..."
                    :prepend-inner-icon="icons.mdiMagnify"
                    class="app-bar-search flex-grow-0 hidden-xs-only"
                    hide-details
                  ></v-text-field>
                  <!-- <ais-index index-name="inventory" :query="search"> </ais-index> -->

                  <ais-hits
                    style="max-height: 250px; width: 100%;"
                    class="overflow-y-auto"
                  >
                    <template slot="item" slot-scope="{ item }">
                      <v-list>
                        <v-list-item :key="item.itemname">
                          <v-list-item-avatar>
                            <v-img :src="item.image"></v-img>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>
                              <ais-highlight :hit="item" attribute="itemname"
                            /></v-list-item-title>

                            <v-list-item-subtitle>
                              <ais-highlight :hit="item" attribute="barcode" />
                            </v-list-item-subtitle>
                          </v-list-item-content>
                          <v-btn
                            class="primary mx-4"
                            @click="
                              gotoInventory(item.inventory_id, item.itemname)
                            "
                            color="white"
                            elevation="2"
                            fab
                            small
                            outlined
                          >
                            <v-icon>
                              {{ mdiArrowRight }}
                            </v-icon>
                          </v-btn>
                        </v-list-item>
                      </v-list>
                      <v-divider></v-divider>
                    </template>
                  </ais-hits>
                </ais-instant-search>
              </v-card-title>

              <v-card-actions class="mb-n5">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="searchDialog = false"
                  >Cancel</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>

          <v-btn
            class="primary mx-4 hidden-xs-only"
            to="/barcode-management"
            v-if="this.$route.name !== 'barcode-management'"
          >
            Barcode Scan
            <v-icon right dark>
              {{ barcodeIcon }}
            </v-icon>
          </v-btn>

          <v-btn
            class="primary mx-4 hidden-sm-and-up"
            to="/barcode-management"
            color="white"
            elevation="2"
            fab
            small
            outlined
            v-if="this.$route.name !== 'barcode-management'"
          >
            <v-icon>
              {{ barcodeIcon }}
            </v-icon>
          </v-btn>

          <theme-switcher></theme-switcher>

          <v-badge
            color="error"
            bottom
            dot
            offset-x="10"
            offset-y="10"
            overlap
            :value="!isEmptyNotif"
          >
            <v-btn icon small class="ms-3" @click.stop="drawer = !drawer">
              <v-icon>
                {{ icons.mdiBellOutline }}
              </v-icon>
            </v-btn>
          </v-badge>

          <!-- <v-menu bottom offset-y left>
            <template v-slot:activator="{ on, attrs }">
              <v-badge color="error" bottom dot offset-x="10" offset-y="10">
                <v-btn icon small v-bind="attrs" v-on="on" class="ms-3">
                  <v-icon>
                    {{ icons.mdiBellOutline }}
                  </v-icon>
                </v-btn>
              </v-badge>
            </template>

            <v-list class="pt-6">
              <v-list-item>
                <v-alert dense border="left" type="warning">
                  I'm a dense alert with the <strong>border</strong> prop and a
                  <strong>type</strong> of warning
                </v-alert>
              </v-list-item>
              <v-list-item>
                <v-alert dense border="left" type="warning">
                  I'm a dense alert with the <strong>border</strong> prop and a
                  <strong>type</strong> of warning
                </v-alert>
              </v-list-item>
            </v-list>
          </v-menu> -->
          <app-bar-user-menu></app-bar-user-menu>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <div class="app-content-container boxed-container pa-6">
        <slot></slot>
      </div>
    </v-main>

    <v-footer app inset color="transparent" absolute height="56" class="px-0">
      <div class="boxed-container w-full">
        <div class="mx-6 d-flex justify-space-between">
          <span>
            &copy; 2022
            <a
              href="https://assumptaclinic.com/"
              class="text-decoration-none"
              target="_blank"
              >ISTAK IMS</a
            ></span
          >
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import { ref } from "@vue/composition-api";
import {
  mdiMagnify,
  mdiBellOutline,
  mdiGithub,
  mdiAlertCircle,
  mdiAlertOctagon,
  mdiBarcodeScan,
  mdiArrowRight,
} from "@mdi/js";
import VerticalNavMenu from "./components/vertical-nav-menu/VerticalNavMenu.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import AppBarUserMenu from "./components/AppBarUserMenu.vue";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
} from "@firebase/firestore";
import db from "@/fb";
import moment from "moment";
import { _ } from "@/utils";
import algoliasearch from "algoliasearch";
import { AisAutocomplete } from "vue-instantsearch";
import { AisInstantSearch } from "vue-instantsearch";
import { AisIndex } from "vue-instantsearch";
import { AisStateResults } from "vue-instantsearch";

const mainInventoryRef = collection(db, "inventory");

export default {
  components: {
    VerticalNavMenu,
    ThemeSwitcher,
    AppBarUserMenu,
    AisAutocomplete,
    AisInstantSearch,
    AisIndex,
    AisStateResults,
  },

  data() {
    return {
      searchClient: algoliasearch(
        "NDCGZS2QZA",
        "314955d293e61fc8b1f7c19faa7d7e97"
      ),
      drawer: null,
      isEmptyNotif: false,
      notifications: [],
      searchDialog: false,
      barcodeIcon: mdiBarcodeScan,
      isLoading: false,
      searching: null,
      search: "",
      searchItems: ["Press enter to search item"],
      items: [
        { title: "Home", icon: "mdi-view-dashboard" },
        { title: "About", icon: "mdi-forum" },
      ],
    };
  },
  setup() {
    const isDrawerOpen = ref(null);

    return {
      isDrawerOpen,
      mdiBellOutline,
      mdiAlertCircle,
      mdiAlertOctagon,
      mdiArrowRight,
      // Icons
      icons: {
        mdiMagnify,
        mdiBellOutline,
        mdiGithub,
      },
    };
  },

  created() {
    // to fetch data
    this.initialize();
  },

  computed: {
    itemsData() {
      return Array.from({ length: this.length }, (k, v) => v + 1);
    },
    length() {
      return 7000;
    },
  },
  methods: {
    onEnter: async function() {
      console.log(this.search);
      const q = query(
        collection(db, "inventory"),
        where("itemname", ">=", this.search),
        where("itemname", "<=", this.search + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    },
    async initialize() {
      // const notificationRef = collection(db, "inventory");
      // const q = query(
      //   notificationRef,
      //   where("state", "==", "open"),
      //   where("available", "<=", 50)
      // );
      // const notifSnapshot = await getDocs(q);
      // if (notifSnapshot.empty) {
      //   this.isEmptyNotif = true;
      // } else {
      //   notifSnapshot.forEach((doc) => {
      //     this.notifications.push({
      //       ...doc.data(),
      //       id: doc.id,
      //     });
      //   });
      // }

      const q = query(mainInventoryRef, where("state", "==", "open"));
      onSnapshot(q, (snapshot) => {
        this.notifications = [];
        this.isEmptyNotif = false;
        snapshot.forEach((doc) => {
          let dateExpiry = moment(doc.data().expiry);
          let todaysDate = moment();

          let diff =
            dateExpiry.diff(todaysDate, "days") === 0
              ? dateExpiry.diff(todaysDate, "days")
              : dateExpiry.diff(todaysDate, "days") + 1;
          if (
            parseInt(doc.data().totalstocks) <=
              parseInt(doc.data().reorderlevel) &&
            moment(doc.data().stateDate.toDate()).format("MMM Do, ddd") !=
              moment(Timestamp.now().toDate()).format("MMM Do, ddd")
          ) {
            this.notifications.push({
              ...doc.data(),
              id: doc.id,
            });
          } else if (diff <= 10) {
            this.notifications.push({
              ...doc.data(),
              isExpiry: true,
              expiry: diff,
              id: doc.id,
            });
          }
        });

        if (this.notifications.length === 0) {
          this.isEmptyNotif = true;
        }
      });
    },
    gotoInventory(id, name) {
      this.$router.push("/inventory-list?filter=" + id + "&" + "name=" + name);
      this.searchDialog = false;
    },

    async dismissAlert(id) {
      console.log("im clicked! id:  " + id);
      await updateDoc(
        doc(db, "inventory", id),
        {
          state: "dismissed",
          stateDate: Timestamp.now(),
        }
        // { merge: true }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.v-app-bar ::v-deep {
  .v-toolbar__content {
    padding: 0;

    .app-bar-search {
      .v-input__slot {
        padding-left: 18px;
      }
    }
  }
}

.boxed-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}
</style>

<style>
ul,
ol {
  list-style: none;
  padding-left: 0 !important;
}
</style>
