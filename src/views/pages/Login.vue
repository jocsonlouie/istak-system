<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <router-link to="/" class="d-flex align-center">
            <v-img :src="require('@/assets/images/logos/assumpta-logo-text.png')" max-height="50px" max-width="200px"
              alt="logo" contain eager class="app-logo me-3"></v-img>
          </router-link>
        </v-card-title>

        <!-- title -->
        <v-card-text>
          <p class="text-2xl font-weight-semibold text--primary mb-2 text-center">
            Welcome! 🐶🐱
          </p>
          <p class="mb-2">
            Please sign-in to your account and start your session
          </p>
        </v-card-text>

        <!-- snackbar -->
        <v-snackbar v-model="snackbar" :timeout="timeout" top>
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <!-- login form -->
        <v-card-text>
          <v-form ref="loginForm">
            <v-text-field v-model="email" outlined label="Email" placeholder="john@example.com" hide-details
              :rules="inputRules" class="mb-3"></v-text-field>

            <v-text-field v-model="password" outlined :type="isPasswordVisible ? 'text' : 'password'" label="Password"
              placeholder="············" :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
              hide-details @click:append="isPasswordVisible = !isPasswordVisible" :rules="inputRules"></v-text-field>

            <div class="d-flex align-center justify-space-between flex-wrap">
              <v-checkbox label="Remember Me" hide-details class="me-3 mt-1">
              </v-checkbox>

              <!-- forgot link -->
              <a href="javascript:void(0)" class="mt-1">
                Forgot Password?
              </a>
            </div>

            <v-btn block color="primary" class="mt-6" @click="login">
              Login
            </v-btn>
          </v-form>
        </v-card-text>

        <!-- create new account
        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <span class="me-2">
            New on our platform?
          </span>
          <router-link :to="{name:'pages-register'}">
            Create an account
          </router-link>
        </v-card-text> -->

        <!-- divider -->
        <v-card-text class="d-flex align-center mt-2">
          <v-divider></v-divider>
          <span class="mx-5">or</span>
          <v-divider></v-divider>
        </v-card-text>

        <!-- social links -->
        <v-card-actions class="d-flex justify-center">
          <v-btn v-for="link in socialLink" :key="link.icon" icon class="ms-1" @click="signInWithGoogle">
            <v-icon :color="$vuetify.theme.dark ? link.colorInDark : link.color">
              {{ link.icon }}
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!-- background triangle shape  -->
    <!-- <img class="auth-mask-bg" height="173"
      :src="require(`@/assets/images/misc/mask-${$vuetify.theme.dark ? 'dark':'light'}.png`)"> -->

    <!-- image -->
    <v-img class="auth-tree" width="252" height="252" src="@/assets/images/misc/clinic-left.png"></v-img>

    <!-- image  -->
    <v-img class="auth-tree-3" width="252" height="252" src="@/assets/images/misc/clinic-right.png"></v-img>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import db from '@/fb';
import { mdiGoogle, mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const isPasswordVisible = ref(false)
const email = ref('')
const password = ref('')
const errMsg = ref('');


export default {

  mounted() {
    console.log(this.$route.params.logout)
    if (this.$route.params.logout) {
      this.text = "Logout Sucessfully!";
      this.snackbar = true;
    }
  },
  data: () => ({
    snackbar: false,
    text: errMsg.value,
    timeout: 3000,
  }),
  setup() {

    const socialLink = [
      {
        icon: mdiGoogle,
        color: '#db4437',
        colorInDark: '#db4437',
      },
    ];

    return {
      isPasswordVisible,
      email,
      password,
      socialLink,
      errMsg,
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
      inputRules: [
        v => v.length >= 3 || 'Minimum length is 3 characters'
      ],

    }
  },
  methods: {
    login() {
      // if (this.$refs.form.validate()) {
      const auth = getAuth();
      signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
          console.log("Successfully login! " + data);
          console.log(auth.currentUser);
          this.$router.push('/dashboard');
        })
        .catch((error) => {
          console.log(error.code);
          switch (error.code) {
            case "auth/invalid-email":
              this.text = "Invalid Email"
              this.snackbar = true;
              break;
            case "auth/user-not-found":
              this.text = "The email or mobile number you entered isn’t connected to an account.";
              this.snackbar = true;
              break;
            case "auth/wrong-password":
              this.text = "Incorrect password";
              this.snackbar = true;
              break;
            default:
              this.text = "Email or Password was incorrect.";
              this.snackbar = true;
              break;
          }
        });
      // }

    },

    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then((data) => {
          console.log("Successfully login! " + data);
          this.$router.push('/dashboard');
        })
        .catch((error) => {
          this.text = "There is something wrong: " + error;
          this.snackbar = true;
        });
    }

  }
}

</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';

.auth-wrapper {
  background: url('~@/assets/images/misc/bg-assumpta-dark.jpg') no-repeat center center fixed;
  background-size: cover;
}
</style>
