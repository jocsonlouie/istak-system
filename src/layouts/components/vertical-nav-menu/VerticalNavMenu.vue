<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="(val) => $emit('update:is-drawer-open', val)"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <v-img
          :src="require('@/assets/images/logos/assumpta-logo-text.png')"
          max-height="50px"
          max-width="200px"
          alt="logo"
          contain
          eager
          class="app-logo me-3"
        ></v-img>
      </router-link>
    </div>

    <!-- Navigation Items -->
    <v-list expand shaped class="vertical-nav-menu-items pr-5">
      <nav-menu-link
        title="Dashboard"
        :to="{ name: 'dashboard' }"
        :icon="icons.mdiHomeOutline"
      ></nav-menu-link>
      <!-- <nav-menu-group title="Pages" :icon="icons.mdiFileOutline">
        <nav-menu-link title="Login" :to="{ name: 'pages-login' }" target="_blank"></nav-menu-link>
        <nav-menu-link title="Register" :to="{ name: 'pages-register' }" target="_blank"></nav-menu-link>
        <nav-menu-link title="Error" :to="{ name: 'error-404' }" target="_blank"></nav-menu-link>
      </nav-menu-group> -->
      <nav-menu-link
        title="Inventories"
        :to="{ name: 'CustomInventory' }"
        :icon="icons.mdiWarehouse"
      ></nav-menu-link>
      <nav-menu-link
        title="Barcode"
        :to="{ name: 'barcode-management' }"
        :icon="icons.mdiBarcodeScan"
      ></nav-menu-link>
      <nav-menu-link
        title="Suppliers"
        :to="{ name: 'SupplierList' }"
        :icon="icons.mdiTruckFast"
      ></nav-menu-link>
      <nav-menu-link
        v-if="isAdmin"
        title="User Roles"
        :to="{ name: 'user-roles' }"
        :icon="icons.mdiAccountLock"
      ></nav-menu-link>

      <!-- <nav-menu-link
        title="Form Layouts"
        :to="{ name: 'form-layouts' }"
        :icon="icons.mdiFormSelect"
      ></nav-menu-link> -->
      <nav-menu-section-title title="ACCOUNT"></nav-menu-section-title>
      <nav-menu-link
        title="Account Settings"
        :to="{ name: 'account-settings' }"
        :icon="icons.mdiAccountCogOutline"
      >
      </nav-menu-link>
    </v-list>
    <a
      href="https://themeselection.com/products/materio-vuetify-vuejs-admin-template"
      target="_blank"
      rel="nofollow"
    >
    </a>
  </v-navigation-drawer>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiHomeOutline,
  mdiAlphaTBoxOutline,
  mdiEyeOutline,
  mdiCreditCardOutline,
  mdiTable,
  mdiFileOutline,
  mdiFormSelect,
  mdiAccountCogOutline,
  mdiLogout,
  mdiWarehouse,
  mdiBarcodeScan,
  mdiTruckFast,
  mdiAccountLock,
} from "@mdi/js";
import NavMenuSectionTitle from "./components/NavMenuSectionTitle.vue";
import NavMenuGroup from "./components/NavMenuGroup.vue";
import NavMenuLink from "./components/NavMenuLink.vue";

//user access
import { onMounted, ref } from "@vue/composition-api";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getDocs, collection, query } from "@firebase/firestore";
import db from "@/fb";
const isAdmin = ref(false);
let auth;

export default {
  components: {
    NavMenuSectionTitle,
    NavMenuGroup,
    NavMenuLink,
  },
  props: {
    isDrawerOpen: {
      type: Boolean,
      default: null,
    },
  },
  setup() {
    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const q = query(collection(db, "users"));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            if (user.uid === doc.id) {
              //console.log(doc.data().role)
              if (doc.data().role == "Inventory Admin") {
                isAdmin.value = true;
              } else {
                isAdmin.value = false;
              }
            }
          });
        }
      });
    });
    return {
      icons: {
        mdiHomeOutline,
        mdiAlphaTBoxOutline,
        mdiEyeOutline,
        mdiCreditCardOutline,
        mdiTable,
        mdiFileOutline,
        mdiFormSelect,
        mdiAccountCogOutline,
        mdiLogout,
        mdiWarehouse,
        mdiBarcodeScan,
        mdiTruckFast,
        mdiAccountLock,
      },
      isAdmin,
    };
  },
};
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;

  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, "background");
}

.app-navigation-menu {
  .v-list-item {
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}
</style>
