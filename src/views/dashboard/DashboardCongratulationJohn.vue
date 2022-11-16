<template>
  <v-card class="greeting-card">
    <v-row class="ma-0 pa-0">
      <v-col cols="8">
        <v-card-title class="text-no-wrap pt-1 ps-2 font-weight-semibold">
          Welcome, {{ userDisplayName }}! 👋🏻
        </v-card-title>
        <v-card-subtitle class="text-no-wrap ps-2">
          Today is {{ timestamp }}
        </v-card-subtitle>
        <v-card-text class="d-flex align-center mt-2 pb-2 ps-2">
          <div>
            <!-- <p class=" font-weight-semibold primary--text mb-2">
              Explore Inventory
            </p>

            <v-btn small color="primary">
              View Inventory
            </v-btn> -->
            <v-chip class="mt-6" color="primary">
              Last Login:
              {{ last_login }}
            </v-chip>
          </div>
        </v-card-text>
      </v-col>

      <v-col cols="4">
        <v-img
          contain
          height="180"
          width="159"
          :src="
            require(`@/assets/images/misc/triangle-${
              $vuetify.theme.dark ? 'dark' : 'light'
            }.png`)
          "
          class="greeting-card-bg"
        ></v-img>
        <v-img
          contain
          height="108"
          max-width="83"
          class="greeting-card-trophy"
          src="@/assets/images/misc/trophy.png"
        ></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from "moment";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getDocs, collection, query } from "@firebase/firestore";
import { onMounted, ref } from "@vue/composition-api";
import db from "@/fb";

const isLoggedIn = ref(false);
const userDisplayName = ref();
const userPhoto = ref();
const last_login = ref("");
let auth;

export default {
  setup() {
    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const q = query(collection(db, "users"));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            if (user.uid === doc.id) {
              userDisplayName.value = doc.data().name;
              userDisplayName.value = userDisplayName.value.split(" ")[0];
              last_login.value = user.metadata.lastSignInTime;
              last_login.value = moment(last_login.value).format("MMM Do, ddd");
              userPhoto.value = doc.data().avatar;
              isLoggedIn.value = true;
            }
          });
        } else {
          isLoggedIn.value = false;
        }
      });
    });
    return {
      isLoggedIn,
      userDisplayName,
      auth,
      userPhoto,
      last_login,
    };
  },
  data() {
    return {
      timestamp: "",
    };
  },
  created() {
    setInterval(this.getNow, 1000);
  },
  methods: {
    getNow: function() {
      this.timestamp = moment().format("MMM Do, dddd");
    },
  },
};
</script>

<style lang="scss" scoped>
.greeting-card {
  position: relative;
  .greeting-card-bg {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .greeting-card-trophy {
    position: absolute;
    bottom: 10%;
    right: 8%;
  }
}
// rtl
.v-application {
  &.v-application--is-rtl {
    .greeting-card-bg {
      right: initial;
      left: 0;
      transform: rotateY(180deg);
    }
    .greeting-card-trophy {
      left: 8%;
      right: initial;
    }
  }
}
</style>
