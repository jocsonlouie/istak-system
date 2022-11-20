<template>
  <div>
    <!-- snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      top
      color="primary"
      outlined
      rounded="pill"
    >
      {{ text }}

      <template v-slot:action="{ attrs2 }">
        <v-spacer></v-spacer>
        <v-btn color="primary" text v-bind="attrs2" @click="snackbar = false">
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>

    <div class="upper-btns mb-5 d-flex">
      <v-row no-gutters class="d-flex justify-center align-center">
        <v-col cols="12" sm="5" md="3" class="pa-1" v-if="isNonInventoryStaff">
          <v-dialog v-model="addDialog" persistent max-width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-card
                class=" bg-white d-flex justify-center align-center flex-column"
                height="200"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon x-large class="mb-2" color="primary">{{
                  addIcon
                }}</v-icon>
                <p>New Inventory</p>
              </v-card>
            </template>
            <!-- Add inventory -->
            <v-card class="pa-5 d-flex justify-center flex-column">
              <v-chip
                color="primary"
                class="d-flex justify-center font-weight-bold text-h6 pa-5 mb-4"
                >New Inventory
              </v-chip>
              <v-img
                :src="itemImage"
                height="150px"
                class="rounded mb-4"
              ></v-img>
              <v-form ref="form">
                <div class="text-center">
                  <v-btn
                    color="primary"
                    class="me-3 mt-2"
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
                    accept=".jpeg,.png,.jpg,GIF"
                    :hidden="true"
                    :rules="fieldRules"
                  />

                  <p class="caption mt-2">
                    Allowed JPG, GIF or PNG. Max size of 1MB
                  </p>
                </div>
                <v-text-field
                  label="Inventory Name"
                  :rules="fieldRules"
                  clearable
                  filled
                  class="mb-4"
                  v-model="inventory_name"
                ></v-text-field>
              </v-form>

              <v-card-actions class="mx-auto">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="addDialog = false">
                  Cancel
                </v-btn>
                <v-btn color="primary" @click="saveInventory"> Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Update Inventory -->
          <v-dialog v-model="updateDialog" persistent max-width="500">
            <v-card class="pa-5 d-flex justify-center flex-column">
              <v-chip
                color="primary"
                class="d-flex justify-center font-weight-bold text-h6 pa-5 mb-4"
              >
                Update Inventory
              </v-chip>
              <v-img
                :src="itemImageEdit"
                height="150px"
                class="rounded mb-4"
              ></v-img>
              <v-form ref="editForm">
                <div class="text-center">
                  <v-btn
                    color="primary"
                    class="me-3 mt-2"
                    @click="$refs.refInputElEdit.click()"
                  >
                    <v-icon class="d-sm-none">
                      {{ uploadBtnTextMobile }}
                    </v-icon>
                    <span class="d-none d-sm-block">{{ uploadBtnText }}</span>
                  </v-btn>

                  <input
                    ref="refInputElEdit"
                    @change="uploadAvatar"
                    type="file"
                    accept=".jpeg,.png,.jpg,GIF"
                    :hidden="true"
                    :rules="fieldRules"
                  />

                  <p class="caption mt-2">
                    Allowed JPG, GIF or PNG. Max size of 1MB
                  </p>
                </div>
                <v-text-field
                  label="Inventory Name"
                  :rules="fieldRules"
                  clearable
                  filled
                  class="mb-4"
                  v-model="edit_inventory_name"
                ></v-text-field>
              </v-form>

              <v-card-actions class="mx-auto">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="updateDialog = false">
                  Cancel
                </v-btn>
                <v-btn color="primary" @click="editInventory"> Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Delete Inventory-->
          <v-dialog v-model="deleteDialog" persistent max-width="500">
            <v-card class="pa-5 d-flex justify-center flex-column pa-md-10">
              <v-chip
                color="error"
                class="d-flex justify-center  font-weight-bold text-h5 pa-5"
                >Delete Inventory
              </v-chip>
              <v-card-title class="text-center"
                >Are you sure you want to delete this inventory?
              </v-card-title>
              <p class="text-center font-weight-bold text-h5">
                {{ deleteInventoryName }}
              </p>

              <v-card-actions class="mx-auto">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="deleteDialog = false">
                  Cancel
                </v-btn>
                <v-btn color="error" @click="deleteInventory"> Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pa-1">
          <v-card
            class=" bg-primary d-flex flex-column pa-4 justify-center align-center"
            height="200"
            @click="gotoAllInventory"
          >
            <p class="">All Inventories</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4" md="3" class="pa-1 ">
          <v-card class="d-flex justify-center mb-2" height="95">
            <v-row no-gutters class="pa-2 text-center text-sm-start">
              <v-col
                cols="12"
                xs="1"
                sm="3"
                md="3"
                class="d-flex justify-center flex-column"
              >
                <v-icon class="" color="primary">{{ tInventoryIcon }}</v-icon>
              </v-col>
              <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                <p class="text-caption mb-n1 mt-4">Total Inventories</p>
                <p class="text-subtitle-1">{{ totalinvt }} inventories</p>
              </v-col>
            </v-row>
          </v-card>
          <v-card class="d-flex justify-center" height="95">
            <v-row no-gutters class="pa-2 text-center text-sm-start">
              <v-col
                cols="12"
                xs="1"
                sm="3"
                md="3"
                class="d-flex justify-center flex-column"
              >
                <v-icon class="" color="primary">{{ tStocksIcon }}</v-icon>
              </v-col>
              <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                <p class="text-caption mb-n1 mt-4">Total Available Stocks</p>
                <p class="text-subtitle-1">{{ totalavstk }} stocks</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4" md="3" class="pa-1 ">
          <v-card class="d-flex justify-center mb-2" height="95">
            <v-row no-gutters class="pa-2 text-center text-sm-start">
              <v-col
                cols="12"
                xs="1"
                sm="3"
                md="3"
                class="d-flex justify-center flex-column"
              >
                <v-icon class="" color="primary">{{ tItemIcon }}</v-icon>
              </v-col>
              <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                <p class="text-caption mb-n1 mt-4">Total Items</p>
                <p class="text-subtitle-1">{{ totalitms }} items</p>
              </v-col>
            </v-row>
          </v-card>
          <v-card class="d-flex justify-center" height="95">
            <v-row no-gutters class="pa-2 text-center text-sm-start">
              <v-col
                cols="12"
                xs="1"
                sm="3"
                md="3"
                class="d-flex justify-center flex-column"
              >
                <v-icon class="" color="primary">{{ nItemIcon }}</v-icon>
              </v-col>
              <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                <p class="text-caption mb-n1 mt-4">Total On Display Stocks</p>
                <p class="text-subtitle-1">{{ totaldspstk }} stocks</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div class="inventories">
      <v-row no-gutters class="d-flex justify-start align-center">
        <v-col
          cols="13"
          xs="16"
          sm="6"
          md="3"
          class="pa-1"
          v-for="inventory in custom_inventories"
          :key="inventory.id"
        >
          <!--  @click="gotoInventory" -->
          <v-card @click="gotoInventory(inventory.id, inventory.name)">
            <v-img :src="inventory.image" height="150" />
            <v-menu bottom left>
              <template
                v-slot:activator="{ on, attrs }"
                v-if="isNonInventoryStaff"
              >
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  absolute
                  right
                  top
                  style="background-color: rgba(255,255,255,0.5);"
                >
                  <v-icon>
                    {{ settingsIcon }}
                  </v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item v-if="isInventoryStaff">
                  <v-btn
                    color="error"
                    outlined
                    small
                    block
                    class="me-2 mb-2"
                    @click="
                      deleteInventoryConfirm(inventory.id, inventory.name)
                    "
                  >
                    <v-icon>{{ deleteIcon }}</v-icon>
                    Delete
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    color="primary"
                    outlined
                    small
                    block
                    @click="
                      editInventoryConfirm(
                        inventory.id,
                        inventory.name,
                        inventory.image
                      )
                    "
                  >
                    <v-icon>{{ editIcon }}</v-icon>
                    Edit
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-card-title>
              {{ inventory.name }}
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-subtitle
              >{{ inventory.count == null ? "0" : inventory.count }}
              items,
              {{ inventory.stock == null ? "0" : inventory.stock }}
              stocks</v-card-subtitle
            >
            <!-- <v-card-actions>

                            <div class="d-flex justify-start flex-wrap">
                                <v-btn color="error" fab outlined x-small class="me-2 mb-2"
                                    @click="deleteDialog = !deleteDialog">
                                    <v-icon>{{ deleteIcon }}</v-icon>
                                </v-btn>
                                <v-btn color="primary" fab outlined x-small @click="updateDialog = !updateDialog">
                                    <v-icon>{{ editIcon }}</v-icon>
                                </v-btn>
                            </div>

                        </v-card-actions> -->
          </v-card>

          <!-- <div class="justify-end d-flex mt-4 " >
                            <v-btn color="error"  fab outlined  x-small class="mr-1"  @click="deleteDialog = !deleteDialog">
                                <v-icon>{{ deleteIcon }}</v-icon>
                            </v-btn>
                            <v-btn color="primary" fab outlined x-small @click="updateDialog = !updateDialog">
                                <v-icon>{{ editIcon }}</v-icon>
                            </v-btn>
                        </div>
                    <v-card class=" bg-white d-flex justify-center flex-column pa-4 " height="200"  @click="gotoInventory">
                        <div class="d-flex justify-center flex-column text-center py-10">
                            <p class="text-subtitle-1">{{ inventory.name }}</p>
                        </div>
                        <div class="mt-4">
                            <p class="text-caption mt-n5">{{ inventory.totalitems }} items, {{ inventory.totalstocks }}
                                stocks</p>
                        </div>

                    </v-card> -->
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import {
  mdiDatabase,
  mdiPackage,
  mdiPackageVariant,
  mdiPackageVariantClosed,
  mdiPlus,
  mdiDelete,
  mdiPencil,
  mdiDotsVertical,
  mdiAlertOutline,
  mdiCloudUploadOutline,
  mdiCheckCircle,
  mdiProgressDownload,
} from "@mdi/js";
import db from "@/fb";
import {
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  collection,
  where,
  query,
  getDocs,
} from "@firebase/firestore";
import {
  getStorage,
  uploadBytes,
  ref as ref_storage,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from "firebase/storage";

import { onMounted, ref } from "@vue/composition-api";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
//import { getDocs, collection, query } from "@firebase/firestore";
//import db from "@/fb";
const isInventoryStaff = ref(true);
const isNonInventoryStaff = ref(true);
let auth;

const customInventoryColRef = collection(db, "custom-inventory");
const mainInventoryColRef = collection(db, "inventory");

export default {
  data: () => ({
    inventory_name: "",
    deleteInventoryName: "",
    edit_inventory_name: "",
    addDialog: false,
    updateDialog: false,
    deleteDialog: false,
    uploadLoading: false,
    uploadBtnText: "Upload new photo",
    snackbar: false,
    text: "",
    timeout: 3000,
    valid: true,
    fieldRules: [(v) => !!v || "This field is required"],
    itemImage:
      "https://firebasestorage.googleapis.com/v0/b/istak-2208e.appspot.com/o/custom-inventories%2Fbanner.jpg?alt=media&token=ce4dbfd6-25b5-4483-894c-f6855cd60cb8",
    itemImageEdit: "",
    //icons
    tInventoryIcon: mdiDatabase,
    tStocksIcon: mdiPackage,
    tItemIcon: mdiPackageVariant,
    nItemIcon: mdiPackageVariantClosed,
    addIcon: mdiPlus,
    deleteIcon: mdiDelete,
    editIcon: mdiPencil,
    settingsIcon: mdiDotsVertical,
    uploadBtnTextMobile: mdiCloudUploadOutline,
    deleteInventoryId: "",
    updateInventoryId: "",

    //modal

    //inventories
    custom_inventories: [],
    count_inventory: [],
    inventories: [
      {
        name: "Vaccines",
        totalitems: 100,
        totalstocsk: 60,
      },
      {
        name: "Laboratory Tests",
        totalitems: 345,
        totalstocks: 514,
      },
      {
        name: "Oral Antibiotics",
        totalitems: 65,
        totalstocks: 235,
      },
      {
        name: "Topical",
        totalitems: 14,
        totalstocks: 200,
      },
      {
        name: "Steriods",
        totalitems: 25,
        totalstocks: 300,
      },
      {
        name: "Eye and Ear",
        totalitems: 45,
        totalstocks: 145,
      },
      {
        name: "Anti-parasite",
        totalitems: 8,
        totalstocks: 154,
      },
      {
        name: "Supplements",
        totalitems: 84,
        totalstocks: 1254,
      },
    ],

    totalitms: 0,
    totalinvt: 0,
    totalavstk: 0,
    totaldspstk: 0,
    inventoryAvailable: [],
    inventoryDisplay: [],
  }),
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
              if (doc.data().role == "Inventory Staff") {
                isInventoryStaff.value = false;
              } else if (doc.data().role == "Non-Inventory Staff") {
                isNonInventoryStaff.value = false;
              } else {
                isInventoryStaff.value = true;
                isNonInventoryStaff.value = true;
              }
            }
          });
        }
      });
    });
    return {
      isInventoryStaff,
      isNonInventoryStaff,
    };
  },
  created() {
    // to fetch data
    this.initialize();
  },

  methods: {
    gotoInventory(id, name) {
      this.$router.push("/inventory-list?filter=" + id + "&" + "name=" + name);
    },
    gotoAllInventory() {
      this.$router.push("/inventory-list");
    },

    async initialize() {
      let itemsCInventory = [];
      let itemsInventory = [];
      let mainInventory = [];
      let items = [];
      let stocks = [];

      onSnapshot(customInventoryColRef, (snapshot1) => {
        itemsInventory = [];
        mainInventory = [];
        itemsCInventory = [];

        snapshot1.forEach(async (doc) => {
          items.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        snapshot1.forEach((doc) => {
          itemsCInventory.push({
            name: doc.data().name,
            id: doc.id,
          });
        });
        this.customInventories = itemsCInventory;
      });

      onSnapshot(mainInventoryColRef, (snapshot2) => {
        stocks = [];
        snapshot2.forEach((doc) => {
          mainInventory.push({
            name: doc.data().itemname,
            id: doc.data().inventory_id,
          });
          itemsCInventory.forEach((item) => {
            if (doc.data().inventory_id === item.id) {
              stocks.push({
                name: item.name,
                stock: doc.data().totalstocks,
                id: item.id,
              });
            }
          });

          itemsInventory.push({
            name: doc.data().itemname,
            id: doc.data().inventory_id,
          });
        });

        let res = stocks.reduce((ac, a) => {
          let ind = ac.findIndex((x) => x.id === a.id);
          ind === -1 ? ac.push(a) : (ac[ind].stock += a.stock);
          return ac;
        }, []);

        const result = items.map((v) => ({
          ...v,
          ...res.find((sp) => sp.id === v.id),
        }));

        const itemResult = Object.entries(
          mainInventory.reduce((acc, { id }) => {
            acc[id] = (acc[id] || 0) + 1;

            return acc;
          }, {})
        ).map(([k, v]) => ({ id: k, count: v }));

        mainInventory = [];

        const mergeAll = result.map((v) => ({
          ...v,
          ...itemResult.find((sp) => sp.id === v.id),
        }));

        this.custom_inventories = mergeAll;
        //TOTAL INVENTORY
        this.totalinvt = items.length;
      });

      onSnapshot(mainInventoryColRef, (snapshot) => {
        let items2 = [];
        let sumAv = 0;
        let sumDis = 0;
        snapshot.forEach((doc) => {
          items2.push({
            ...doc.data(),
            id: doc.id,
          });

          sumAv += doc.data().available;
          sumDis += doc.data().display;
        });
        //TOTAL ITEMS, TOTAL AVAILABLE, TOTAL DISPLAY
        this.totalitms = items2.length;
        this.totalavstk = sumAv;
        this.totaldspstk = sumDis;
      });
    },

    async saveInventory() {
      if (this.$refs.form.validate()) {
        this.addDialog = false;
        const docRef = await addDoc(collection(db, "custom-inventory"), {
          name: this.inventory_name,
          image: this.itemImage,
        });
        this.text = "Custom Inventory has been added successfully.";
        this.snackbar = true;
      }
    },

    uploadAvatar(e) {
      let file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref_storage(
        storage,
        "custom-inventories/" + file.name
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadBtnText = "Uploading: " + progress.toFixed(0) + "%";
          this.uploadBtnTextMobile = mdiProgressDownload;
          //this.uploadBtnTextMobile = "Uploading: " + progress.toFixed(0) + '%';

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
          this.uploadBtnText = "Uploaded Successfully";

          this.uploadBtnTextMobile = mdiCheckCircle;
          //this.uploadBtnTextMobile = 'Photo Uploaded';
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            this.itemImage = downloadURL;
            this.itemImageEdit = downloadURL;
          });
        }
      );
    },

    deleteInventoryConfirm(id, name) {
      this.deleteInventoryName = name;
      this.deleteDialog = !this.deleteDialog;
      this.deleteInventoryId = id;
    },

    async deleteInventory() {
      this.deleteDialog = false;
      await deleteDoc(doc(db, "custom-inventory", this.deleteInventoryId));
      this.text = "Inventory has been deleted successfully.";
      this.snackbar = true;
    },

    async editInventoryConfirm(id, name, image) {
      this.updateDialog = !this.updateDialog;
      this.updateInventoryId = id;
      this.edit_inventory_name = name;
      this.itemImageEdit = image;
    },

    async editInventory() {
      if (this.$refs.editForm.validate()) {
        this.updateDialog = false;
        await setDoc(doc(db, "custom-inventory", this.updateInventoryId), {
          name: this.edit_inventory_name,
          image: this.itemImageEdit,
        });
        this.text = "Inventory has been updated successfully.";
        this.snackbar = true;
      }
    },
  },
};
</script>
<style lang=""></style>
