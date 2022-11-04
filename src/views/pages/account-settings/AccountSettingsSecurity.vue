<template>
  <v-card flat class="mt-5">
    <!-- snackbar -->
    <v-snackbar v-model="snackbar" :timeout="timeout" top>
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-form ref="form">
      <div class="px-3">
        <v-card-title class="flex-nowrap">
          <v-icon class="text--primary">
            {{ icons.mdiLockOpenOutline }}
          </v-icon>
          <span class="text-break">Change/Set Password</span>
        </v-card-title>
        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="12" sm="8" md="6">
              <!-- current password -->
              <!-- <v-text-field
                v-model="currentPassword"
                :type="isCurrentPasswordVisible ? 'text' : 'password'"
                :append-icon="isCurrentPasswordVisible ? icons.mdiEyeOffOutline:icons.mdiEyeOutline"
                label="Current Password"
                outlined
                dense
                @click:append="isCurrentPasswordVisible = !isCurrentPasswordVisible"
              ></v-text-field> -->

              <!-- new password -->

              <v-text-field
                v-model="newPassword"
                :type="isNewPasswordVisible ? 'text' : 'password'"
                :append-icon="
                  isNewPasswordVisible
                    ? icons.mdiEyeOffOutline
                    : icons.mdiEyeOutline
                "
                label="New Password"
                outlined
                dense
                hint="Make sure it's at least 8 characters."
                persistent-hint
                :rules="inputRules"
                @click:append="isNewPasswordVisible = !isNewPasswordVisible"
              ></v-text-field>

              <!-- confirm password -->
              <v-text-field
                v-model="cPassword"
                :type="isCPasswordVisible ? 'text' : 'password'"
                :append-icon="
                  isCPasswordVisible
                    ? icons.mdiEyeOffOutline
                    : icons.mdiEyeOutline
                "
                label="Confirm New Password"
                outlined
                dense
                class="mt-3"
                :rules="inputRules"
                @click:append="isCPasswordVisible = !isCPasswordVisible"
              ></v-text-field>
            </v-col>

            <!-- <v-col
              cols="12"
              sm="4"
              md="6"
              class="d-none d-sm-flex justify-center position-relative"
            >
              <v-img
                contain
                max-width="170"
                src="@/assets/images/3d-characters/pose-m-1.png"
                class="security-character"
              ></v-img>
            </v-col> -->
          </v-row>
        </v-card-text>
      </div>

      <!-- divider -->
      <v-divider></v-divider>

      <div class="pa-3">
        <!-- <v-card-title class="flex-nowrap">
          <v-icon class="text--primary me-3">
            {{ icons.mdiKeyOutline }}
          </v-icon>
          <span class="text-break">Two-factor authentication</span>
        </v-card-title>

        <v-card-text class="two-factor-auth text-center mx-auto">
          <v-avatar color="primary" class="primary mb-4" rounded>
            <v-icon size="25" color="white">
              {{ icons.mdiLockOpenOutline }}
            </v-icon>
          </v-avatar>
          <p class="text-base text--primary font-weight-semibold">
            Two factor authentication is not enabled yet.
          </p>
          <p class="text-sm text--primary">
            Two-factor authentication adds an additional layer of security to
            your account by requiring more than just a password to log in. Learn
            more.
          </p>
        </v-card-text> -->

        <v-card-text>
          <v-btn color="primary" class="me-3 mt-3" @click="handlePassword">
            Save changes
          </v-btn>
          <v-btn color="secondary" outlined class="mt-3">
            Cancel
          </v-btn>
        </v-card-text>
      </div>
    </v-form>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiKeyOutline,
  mdiLockOpenOutline,
  mdiEyeOffOutline,
  mdiEyeOutline,
} from "@mdi/js";
import { ref } from "@vue/composition-api";
import { getAuth, updatePassword } from "firebase/auth";

export default {
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 3000,
    };
  },
  setup() {
    const isCurrentPasswordVisible = ref(false);
    const isNewPasswordVisible = ref(false);
    const isCPasswordVisible = ref(false);
    const newPassword = ref("");
    const cPassword = ref("");

    return {
      isCurrentPasswordVisible,
      isNewPasswordVisible,
      isCPasswordVisible,
      newPassword,
      cPassword,
      icons: {
        mdiKeyOutline,
        mdiLockOpenOutline,
        mdiEyeOffOutline,
        mdiEyeOutline,
      },
      inputRules: [(v) => v.length >= 8 || "Minimum length is 8 characters"],
    };
  },

  methods: {
    handlePassword() {
      if (this.$refs.form.validate()) {
        const auth = getAuth();

        const user = auth.currentUser;
        console.log(this.newPassword, this.cPassword);
        if (this.newPassword != this.cPassword) {
          this.text = "Passwords did not match.";
          this.snackbar = true;
        } else {
          updatePassword(user, this.newPassword)
            .then(() => {
              this.text = "Password set successfully";
              this.snackbar = true;
            })
            .catch((error) => {
              this.text = "Error: " + error;
              this.snackbar = true;
            });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.two-factor-auth {
  max-width: 25rem;
}
.security-character {
  position: absolute;
  bottom: -0.5rem;
}
</style>
