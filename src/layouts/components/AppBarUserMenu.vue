
<template>
  <v-menu offset-y left nudge-bottom="14" min-width="230" content-class="user-profile-menu-content">
    <template v-slot:activator="{ on, attrs }">
      <v-badge bottom color="success" overlap offset-x="12" offset-y="12" class="ms-4" dot>
        <v-avatar size="40px" v-bind="attrs" v-on="on">
          <v-img :src="userPhoto" v-if="userPhoto"></v-img>
          <v-img src="https://assumptaclinic.com/wp-content/uploads/2022/10/profile-icon-default.jpeg" v-else></v-img>
        </v-avatar>
      </v-badge>
    </template>
    <v-list>
      <div class="pb-3 pt-2">
        <v-badge bottom color="success" overlap offset-x="12" offset-y="12" class="ms-4" dot>
          <v-avatar size="40px">
            <v-img :src="userPhoto" v-if="userPhoto"></v-img>
            <v-img src="https://assumptaclinic.com/wp-content/uploads/2022/10/profile-icon-default.jpeg" v-else></v-img>
          </v-avatar>
        </v-badge>
        <div class="d-inline-flex flex-column justify-center ms-3" style="vertical-align:middle">
          <span class="text--primary font-weight-semibold mb-n1">
            <div v-if="userDisplayName"> {{ userDisplayName }}</div>
            <div v-else> Clinic</div>
          </span>
          <!-- <small class="text--disabled text-capitalize">Admin</small> -->
        </div>
      </div>

      <v-divider></v-divider>

      <!-- Chat -->
      <v-list-item link @click="goToRegister">
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiAccountPlusOutline }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Register</v-list-item-title>
        </v-list-item-content>

        <!-- <v-list-item-action>
          <v-badge inline color="error" content="2">
          </v-badge>
        </v-list-item-action> -->
      </v-list-item>

      <!-- Settings -->
      <v-list-item link>
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiCogOutline }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>


      <!-- Logout -->
      <v-list-item @click="handleSignOut">
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiLogoutVariant }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script >
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { onMounted, ref } from '@vue/composition-api';
import db from '@/fb';

import {
  mdiAccountOutline,
  mdiEmailOutline,
  mdiCheckboxMarkedOutline,
  mdiChatOutline,
  mdiCogOutline,
  mdiCurrencyUsd,
  mdiHelpCircleOutline,
  mdiLogoutVariant,
  mdiAccountPlusOutline,
} from '@mdi/js';


const isLoggedIn = ref(false);
const userDisplayName = ref();
const userPhoto = ref();
let auth;


export default {
  setup() {
    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userDisplayName.value = user.displayName;
          userPhoto.value = user.photoURL;
          console.log(userPhoto.value);
          isLoggedIn.value = true;

        } else {
          isLoggedIn.value = false;
        }
      });
    });
    return {
      icons: {
        mdiAccountOutline,
        mdiEmailOutline,
        mdiCheckboxMarkedOutline,
        mdiChatOutline,
        mdiCogOutline,
        mdiCurrencyUsd,
        mdiHelpCircleOutline,
        mdiLogoutVariant,
        mdiAccountPlusOutline
      },
      isLoggedIn,
      userDisplayName,
      auth,
      userPhoto
    }
  },
  methods: {
    goToRegister() {
      const auth = getAuth();
      if (auth.currentUser !== null) {
        this.$router.push('/register');
      }
    },
    handleSignOut() {
      signOut(auth).then(() => {
        this.$router.push({ name: 'login', params: { logout: true } });

      });
    }
  },
}
</script>

<style lang="scss">
.user-profile-menu-content {
  .v-list-item {
    min-height: 2.5rem !important;
  }
}
</style>
