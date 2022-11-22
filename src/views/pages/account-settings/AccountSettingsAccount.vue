<template>
  <v-card flat class="pa-3 mt-2">
    <v-card-text class="d-flex">
      <v-avatar rounded size="120" class="me-6">
        <v-img :src="userAvatar"></v-img>
      </v-avatar>

      <!-- snackbar -->
      <v-snackbar v-model="snackbar" :timeout="timeout" top>
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>

      <!-- upload photo -->
      <div>
        <v-btn
          color="primary"
          class="me-3 mt-5"
          @click="$refs.refInputEl.click()"
        >
          <v-icon class="d-sm-none">
            {{ uploadBtnTextMobile }}
          </v-icon>
          <span class="d-none d-sm-block">{{ uploadBtnText }}</span>
        </v-btn>

        <input
          ref="refInputEl"
          @change="uploadAvatar"
          type="file"
          accept=".jpeg,.png,.jpg"
          :hidden="true"
        />

        <p class="text-sm mt-5">
          Allowed JPG or PNG. Max size of 1MB
        </p>
      </div>
    </v-card-text>

    <v-card-text>
      <v-form class="multi-col-validation mt-6">
        <v-row>
          <v-col md="6" cols="12">
            <v-text-field
              v-model="userFName"
              label="Name"
              dense
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="userEmail"
              label="E-mail"
              dense
              outlined
              :disabled="userVerified"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="userRole"
              dense
              outlined
              label="Role"
              :items="status"
              disabled
            ></v-select>
          </v-col>

          <!-- alert -->
          <v-col cols="12" v-if="!userVerified">
            <v-alert color="warning" text class="mb-0">
              <div class="d-flex align-start">
                <v-icon color="warning">
                  {{ icons.mdiAlertOutline }}
                </v-icon>

                <div class="ms-3">
                  <p class="text-base font-weight-medium mb-1">
                    Your email is not confirmed. Please check your inbox.
                  </p>
                  <a
                    @click="resendEmailConfirmation"
                    class="text-decoration-none warning--text"
                  >
                    <span class="text-sm">Connect this account to Google</span>
                  </a>
                </div>
              </div>
            </v-alert>
          </v-col>

          <v-col cols="12" v-else>
            <v-alert color="primary" text class="mb-0">
              <div class="d-flex align-start">
                <v-icon color="primary">
                  {{ icons.mdiCheckCircle }}
                </v-icon>

                <div class="ms-3">
                  <p class="text-base font-weight-medium mb-1">
                    Your email is verified!
                  </p>
                </div>
              </div>
            </v-alert>
          </v-col>

          <v-col cols="12">
            <v-dialog v-model="dialog" persistent max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  class="me-3 mt-4"
                  v-bind="attrs"
                  v-on="on"
                >
                  Save changes
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h5">
                  Save changes?
                </v-card-title>
                <v-card-text
                  >Changes have been made to this account. <br />Do you want to
                  save these changes?
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="secondary"
                    outlined
                    text
                    @click="dialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    class="me-3"
                    @click="updateAccountDetails"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- <v-btn color="secondary" outlined class="mt-4" type="reset" @click.prevent="resetForm">
              Cancel
            </v-btn> -->
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  linkWithPopup,
} from "@firebase/auth";
import {
  mdiAlertOutline,
  mdiCloudUploadOutline,
  mdiCheckCircle,
  mdiProgressDownload,
} from "@mdi/js";
import { ref, onMounted } from "@vue/composition-api";
import db from "@/fb";
import {
  getStorage,
  uploadBytes,
  ref as ref_storage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getDocs,
  collection,
  where,
  query,
  doc,
  setDoc,
} from "@firebase/firestore";

const userFName = ref("");
const userEmail = ref("");
const userAvatar = ref(
  "https://assumptaclinic.com/wp-content/uploads/2022/10/default-assumpta.jpg"
);
const userRole = ref("Non-Inventory Staff");
const userVerified = ref(false);
const currentUserID = ref("");

export default {
  data() {
    return {
      dialog: false,
      loader: null,
      uploadLoading: false,
      uploadBtnText: "Upload new photo",
      uploadBtnTextMobile: this.icons.mdiCloudUploadOutline,
      snackbar: false,
      text: "",
      timeout: 3000,
    };
  },

  props: {
    accountData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const status = [
      "Inventory Admin",
      "Inventory Staff",
      "Non-Inventory Staff",
      "Can't Access",
    ];

    const accountDataLocale = ref(
      JSON.parse(JSON.stringify(props.accountData))
    );

    const resetForm = () => {
      accountDataLocale.value = JSON.parse(JSON.stringify(props.accountData));
    };

    onMounted(() => {
      let auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // console.log(user.uid)
          currentUserID.value = user.uid;

          const q = query(collection(db, "users"));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.data().email);
            userVerified.value = user.emailVerified;
            if (user.uid === doc.id) {
              userFName.value = doc.data().name;
              userEmail.value = doc.data().email;
              userRole.value = doc.data().role;
              userAvatar.value = doc.data().avatar;
            }
          });
        }
      });
    });

    return {
      status,
      userRole,
      userEmail,
      userAvatar,
      userFName,
      accountDataLocale,
      userVerified,
      resetForm,
      icons: {
        mdiAlertOutline,
        mdiCloudUploadOutline,
        mdiCheckCircle,
        mdiProgressDownload,
      },
    };
  },

  methods: {
    uploadAvatar(e) {
      let file = e.target.files[0];
      if (file.size > 1097152) {
        this.text = "File size must be under 1MB";
        this.snackbar = true;
      } else {
        const storage = getStorage();
        const storageRef = ref_storage(storage, "avatars/" + file.name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploadBtnText = "Uploading: " + progress.toFixed(0) + "%";
            this.uploadBtnTextMobile = this.icons.mdiProgressDownload;
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            this.uploadBtnText = "Photo uploaded successfully";
            this.uploadBtnTextMobile = this.icons.mdiCheckCircle;
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              userAvatar.value = downloadURL;
            });
          }
        );
      }
    },

    async updateAccountDetails() {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const docData = {
        name: userFName.value,
        avatar: userAvatar.value,
        email: userEmail.value,
        role: userRole.value,
      };

      const special = doc(db, "users/" + currentUserID.value);
      querySnapshot.forEach((data) => {
        if (currentUserID.value === data.id) {
          setDoc(special, docData).then(() => {
            this.text = "Changes saved successfully. ";
            this.snackbar = true;
            this.dialog = false;
          });
        }
      });
    },

    resendEmailConfirmation() {
      const googleProvider = new GoogleAuthProvider();
      let auth = getAuth();
      linkWithPopup(auth.currentUser, googleProvider)
        .then((result) => {
          // Accounts successfully linked.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;
          // ...
          this.text = "Account successfully linked. ";
          this.snackbar = true;
        })
        .catch((error) => {
          // Handle Errors here.
          // ...
          this.text = "There is something wrong: " + error;
          this.snackbar = true;
        });
      // sendEmailVerification(auth.currentUser).then(() => {
      //   this.text = "Email verification sent!";
      //   this.snackbar = true;
      // });
    },
  },
};
</script>
