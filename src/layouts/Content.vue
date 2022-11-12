<template>
  <v-app>
    <vertical-nav-menu :is-drawer-open.sync="isDrawerOpen"></vertical-nav-menu>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      fixed
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
          :key="notification.id"
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
            @input="dismissAlert(notification.id)"
          >
            The item "{{ notification.itemname }}" has only
            <strong>{{ notification.available }} stock </strong> left
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
            :prepend-inner-icon="icons.mdiMagnify"
            class="app-bar-search flex-grow-0"
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>

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
} from "@firebase/firestore";
import db from "@/fb";

export default {
  components: {
    VerticalNavMenu,
    ThemeSwitcher,
    AppBarUserMenu,
  },

  data() {
    return {
      drawer: null,
      isEmptyNotif: false,
      notifications: [],
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

  methods: {
    async initialize() {
      const notificationRef = collection(db, "inventory");
      const q = query(
        notificationRef,
        where("state", "==", "open"),
        where("available", "<=", 50)
      );
      const notifSnapshot = await getDocs(q);
      if (notifSnapshot.empty) {
        this.isEmptyNotif = true;
      } else {
        notifSnapshot.forEach((doc) => {
          this.notifications.push({
            ...doc.data(),
            id: doc.id,
          });
        });
      }
    },

    async dismissAlert(id) {
      console.log("im clicked! id:  " + id);
      await updateDoc(
        doc(db, "inventory", id),
        {
          state: "dismissed",
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
