<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <router-link to="/" class="d-flex align-center">
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
        </v-card-title>

        <!-- title -->
        <v-card-text>
          <p
            class="text-2xl font-weight-semibold text--primary mb-2 text-center"
          >
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

        <!-- OTP  modal -->
        <v-dialog v-model="otpModal" max-width="550px">
          <v-card class="pa-5 d-flex flex-column justify-center">
            <v-chip
              color="primary"
              class="d-flex justify-center rounded-pill font-weight-bold text-h6 pa-5 "
              >Enter OTP
            </v-chip>
            <h4 class="mt-4 text-center">
              We have sent you a 6-digit code to
              {{ phoneNum ? phoneNum : "+639XXXXXXXXX" }}
            </h4>
            <v-card-title
              class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden"
            >
              <v-otp-input
                v-model="otp"
                :disabled="loading"
                @finish="onFinish"
                autofocus
              >
                <v-overlay absolute :value="loading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-overlay>
              </v-otp-input>
            </v-card-title>

            <v-card-actions class="mb-n5">
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="otpModal = false">Cancel</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- login form -->
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="number"
              label="Phone Number"
              maxlength="10"
              type="tel"
              prefix="+63"
              :rules="inputRules"
            >
            </v-text-field>

            <!-- <v-text-field
              v-model="password"
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="Password"
              placeholder="············"
              :append-icon="
                isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline
              "
              hide-details
              @click:append="isPasswordVisible = !isPasswordVisible"
              :rules="inputRules"
            ></v-text-field> -->

            <div class="d-flex align-center justify-space-between flex-wrap">
              <!-- <v-checkbox label="Remember Me" hide-details class="me-3 mt-1">
              </v-checkbox> -->

              <!-- forgot link -->
              <!-- <a href="javascript:void(0)" class="mt-1">
                Forgot Password?
              </a> -->
            </div>
            <div id="recaptcha-container" class="mt-2"></div>
            <v-btn
              id="sign-in-button"
              block
              color="primary"
              class="mt-6"
              @click="login"
            >
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
          <v-btn
            v-for="link in socialLink"
            :key="link.icon"
            icon
            class="ms-1"
            @click="signInWithGoogle"
          >
            <v-icon
              :color="$vuetify.theme.dark ? link.colorInDark : link.color"
            >
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
    <v-img
      class="auth-tree"
      width="252"
      height="252"
      src="@/assets/images/misc/clinic-left.png"
    ></v-img>

    <!-- image  -->
    <v-img
      class="auth-tree-3"
      width="252"
      height="252"
      src="@/assets/images/misc/clinic-right.png"
    ></v-img>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import db from "@/fb";
import { mdiGoogle, mdiEyeOutline, mdiEyeOffOutline, mdiPhone } from "@mdi/js";
import { onMounted, ref } from "@vue/composition-api";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

const isPasswordVisible = ref(false);
const number = ref("");
const password = ref("");
const errMsg = ref("");

export default {
  data: () => ({
    snackbar: false,
    otpModal: false,
    loading: false,
    otp: "",
    appVerifier: "",
    text: errMsg.value,
    timeout: 3000,
    recaptchaVerifier: "",
    phoneNum: null,
  }),
  setup() {
    const socialLink = [
      {
        icon: mdiGoogle,
        color: "#db4437",
        colorInDark: "#db4437",
      },
    ];

    return {
      isPasswordVisible,
      number,
      password,
      socialLink,
      phoneIcon: mdiPhone,
      errMsg,
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
        mdiPhone,
      },
      inputRules: [(v) => Boolean(v) || "This field is required"],
    };
  },

  mounted() {
    const auth = getAuth();
    if (auth.currentUser !== null) {
      this.$router.push("/dashboard");
    }
    if (this.$route.params.logout) {
      this.text = "Logout Sucessfully!";
      this.snackbar = true;
    }
    this.recaptchaVerifier = window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "normal" },
      auth
    );
    recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  },

  methods: {
    login() {
      const auth = getAuth();

      if (this.$refs.form.validate()) {
        let countryCode = "+63";
        this.phoneNum = countryCode + this.number;
        this.otpModal = true;
        signInWithPhoneNumber(auth, this.phoneNum, this.recaptchaVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // ...
            this.otpModal = true;
          })
          .catch((error) => {
            // Error; SMS not sent
            // ...
            this.text = "There is something wrong: " + error;
            this.snackbar = true;
          });

        // signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        //   .then(function(confirmationResult) {
        //     // SMS sent. Prompt user to type the code from the message, then sign the
        //     // user in with confirmationResult.confirm(code).
        //     window.confirmationResult = confirmationResult;
        //     //
        //     alert("SMS sent: " + confirmationResult);
        //   })
        //   .catch(function(error) {
        //     // Error; SMS not sent
        //     // ...
        //     alert("Error ! SMS not sent: " + error);
        //     console.log(error);
        //   });
        // signInWithEmailAndPassword(getAuth(), email.value, password.value)
        //   .then((data) => {
        //     console.log("Successfully login! " + data);
        //     console.log(auth.currentUser);
        //     this.$router.push("/dashboard");
        //   })
        //   .catch((error) => {
        //     console.log(error.code);
        //     switch (error.code) {
        //       case "auth/invalid-email":
        //         this.text = "Invalid Email";
        //         this.snackbar = true;
        //         break;
        //       case "auth/user-not-found":
        //         this.text =
        //           "The email or mobile number you entered isn’t connected to an account.";
        //         this.snackbar = true;
        //         break;
        //       case "auth/wrong-password":
        //         this.text = "Incorrect password";
        //         this.snackbar = true;
        //         break;
        //       default:
        //         this.text = "Email or Password was incorrect.";
        //         this.snackbar = true;
        //         break;
        //     }
        //   });
      }
    },

    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then((data) => {
          console.log("Successfully login! " + data);
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          this.text = "There is something wrong: " + error;
          this.snackbar = true;
        });
    },

    onFinish(rsp) {
      this.loading = true;
      confirmationResult
        .confirm(rsp)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          console.log("Successfully login! " + user);
          this.loading = false;
          this.otpModal = false;
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
          this.text = "Wrong OTP: " + error;
          this.loading = false;
          this.snackbar = true;
        });
    },
  },
};
</script>

<style lang="scss">
@import "~@/plugins/vuetify/default-preset/preset/pages/auth.scss";

.auth-wrapper {
  background: url("~@/assets/images/misc/bg-assumpta-dark.jpg") no-repeat center
    center fixed;
  background-size: cover;
}
</style>
