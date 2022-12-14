<template>
  <div class="d-flex justify-center flex-column w-screen">
    <div class="barcode-table">
      <v-data-table
        :headers="headers"
        :items="items"
        sort-by="name"
        class="elevation-1 pt-3"
        :search="search"
        v-model="selected"
        :single-select="singleSelect"
        item-key="itemname"
        show-select
        :loading="loadingTable"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <!-- Table Top Functions -->
            <v-switch v-model="singleSelect" class="mb-n6 mr-4"></v-switch>
            <v-icon class="mr-2">{{ searchIcon }}</v-icon>
            <v-text-field
              v-model="search"
              label="Search Item..."
              single-line
              hide-details
            >
            </v-text-field>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>

        <template v-slot:item.avatar="{ item }" class="text-center">
          <v-avatar rounded size="50" class="ma-2">
            <v-img
              :src="
                item.avatar != ''
                  ? item.avatar
                  : 'https://assumptaclinic.com/wp-content/uploads/2022/10/default-assumpta.jpg'
              "
            ></v-img>
          </v-avatar>
        </template>

        <template v-slot:item.role="{ item }" class="text-center">
          <v-chip :color="getColor(item.role)" dark>
            <v-icon left color="white">
              {{ numberIcon }}
            </v-icon>
            {{ item.role }}
          </v-chip>
        </template>
        <!-- Table Actions Buttons -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="primary"
            elevation="2"
            class="mr-2"
            fab
            x-small
            outlined
            @click="editItem(item)"
          >
            <v-icon>{{ editIcon }}</v-icon>
          </v-btn>
          <v-btn
            color="error"
            elevation="2"
            class="mr-2"
            fab
            x-small
            @click="deleteItem(item)"
          >
            <v-icon>{{ deleteIcon }}</v-icon>
          </v-btn>
        </template>

        <!-- Capture Photo modal -->
        <v-dialog v-model="capturePhoto" max-width="550px">
          <v-card class="pa-5 d-flex flex-column justify-center">
            <v-chip
              color="primary"
              class="d-flex justify-center rounded-pill font-weight-bold text-h6 pa-5 "
              >Capture Photo
            </v-chip>
            <v-card-title
              class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden"
            >
              <PhotoCapture
                v-model="imageBase64"
                captureBtnContent="????"
                cancelBtnContent="????"
                doneBtnContent="???"
                @input="done"
              />
            </v-card-title>

            <v-card-actions class="mb-n5">
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="closeCapturePhoto">Cancel</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Add & Edit Item Modal -->
        <v-dialog v-model="dialogUserEdit" max-width="900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" outlined class="" v-bind="attrs" v-on="on">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="d-flex justify-center ">
              <v-chip
                color="primary"
                class="d-flex justify-center font-weight-bold text-h6 pa-5"
              >
                Update User
              </v-chip>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="form">
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">User Information</p>
                    <v-divider></v-divider>
                  </div>

                  <v-row no-gutters class="d-flex justify-center">
                    <v-col cols="12" sm="3" class="ma-2 align-self-center">
                      <v-card-text
                        class="d-flex justify-center flex-column align-center mt-2"
                      >
                        <v-avatar rounded size="80" class="">
                          <v-img :src="itemImage"></v-img>
                        </v-avatar>
                        <div
                          class="d-flex justify-center flex-column align-center"
                        >
                          <v-btn
                            color="primary"
                            class="mt-3"
                            small
                            @click="$refs.refInputEl.click()"
                          >
                            <v-icon class="d-sm-none">
                              {{ uploadBtnTextMobile }}
                            </v-icon>
                            <span class="d-none d-sm-block">{{
                              uploadBtnText
                            }}</span>
                          </v-btn>

                          <v-btn
                            color="primary"
                            class="mt-3"
                            small
                            outlined
                            @click="openCapturePhoto"
                          >
                            <v-icon class="d-sm-none">
                              {{ uploadTakePicture }}
                            </v-icon>
                            <span class="d-none d-sm-block "
                              >Capture a photo</span
                            >
                          </v-btn>

                          <input
                            ref="refInputEl"
                            @change="uploadItemImage"
                            type="file"
                            accept=".jpeg,.png,.jpg,GIF"
                            :hidden="true"
                          />

                          <p class="text-caption text-center mt-2">
                            Allowed JPG, GIF or PNG. Max size of 1MB
                          </p>
                        </div>
                      </v-card-text>
                    </v-col>

                    <v-col cols="12" sm="4" class="ma-2 align-self-center">
                      <v-text-field
                        v-model="dataItem.email"
                        :rules="itemNameRules"
                        label="Email"
                        clearable
                        required
                        outlined
                        dense
                      >
                      </v-text-field>

                      <v-text-field
                        v-model="dataItem.name"
                        :rules="itemNameRules"
                        label="Name"
                        clearable
                        outlined
                        dense
                      >
                      </v-text-field>

                      <v-text-field
                        v-model="dataItem.role"
                        :rules="itemNameRules"
                        label="Role"
                        clearable
                        outlined
                        dense
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <!-- Delete Item Modal -->
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card class="pa-5 d-flex flex-column justify-center">
                <v-chip
                  color="error"
                  class="d-flex justify-center font-weight-bold text-h6 pa-5"
                  >Delete Item
                </v-chip>
                <v-card-title class="-d-flex justify-center"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <p class="text-center font-weight-bold text-h5">
                  {{ dataItem.itemname }}
                </p>
                <v-card-actions class="mb-n5">
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" @click="closeDelete">Cancel</v-btn>
                  <v-btn color="primary" @click="deleteItemConfirm">YES</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-card-actions>
              <v-btn color="error" @click="openDelete" v-if="showDelete">
                Delete</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="close">
                Cancel
              </v-btn>
              <v-btn color="primary" @click="save"> Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import {
  mdiBarcodeScan,
  mdiBarcode,
  mdiMagnify,
  mdiPencil,
  mdiDelete,
  mdiCloudUploadOutline,
  mdiLockOpenOutline,
  mdiCheckboxMarkedCircleOutline,
  mdiFilePdfBox,
  mdiDotsVertical,
  mdiPlus,
  mdiHandHeart,
  mdiCircle,
  mdiAlertOutline,
  mdiCamera,
  mdiCheckCircle,
  mdiProgressDownload,
} from "@mdi/js";

//upload image imports
import { ref, onMounted } from "@vue/composition-api";
import {
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  collection,
  where,
  query,
} from "@firebase/firestore";
import db from "@/fb";
import "vue-media-recorder/src/assets/scss/main.scss";
import { PhotoCapture } from "vue-media-recorder";
import { getFunctions, httpsCallable } from "firebase/functions";

const usersColRef = collection(db, "users");
const itemImage = ref(
  "https://assumptaclinic.com/wp-content/uploads/2022/10/default-assumpta.jpg"
);

export default {
  components: {
    PhotoCapture,
  },
  data: () => ({
    imageBase64: null,

    loadingTable: true,
    // icon data
    editIcon: mdiPencil,
    deleteIcon: mdiDelete,
    successIcon: mdiCheckboxMarkedCircleOutline,
    searchIcon: mdiMagnify,
    pdfIcon: mdiFilePdfBox,
    moreIcon: mdiDotsVertical,
    barcodeIcon: mdiBarcodeScan,
    plusIcon: mdiPlus,
    numberIcon: mdiCircle,
    consumeIcon: mdiHandHeart,
    scanIcon: mdiBarcodeScan,

    alignments: ["start", "center", "end"],

    // modal data
    dialog: false,
    dialogDelete: false,
    dialogScan: false,
    dialogScanView: false,
    capturePhoto: false,
    dialogUserEdit: false,

    // Scan Modal
    scanItemImage:
      "https://assumptaclinic.com/wp-content/uploads/2022/10/profile-icon-default.jpeg",
    scanItemName: "Sample Name",
    scanBarcode: "12312312312",
    scanStorebox: "686",
    scanTotalStocks: "454",
    scanDisplayStocks: "565",
    scanStatus: false,

    //search and select data
    search: "",
    singleSelect: false,
    selected: [],
    expanded: [],
    singleExpand: false,

    // table header data
    headers: [
      {
        text: "Avatar",
        align: "start",
        sortable: false,
        value: "avatar",
      },
      {
        text: "Email",
        sortable: true,
        value: "email",
      },
      {
        text: "Name",
        sortable: true,
        value: "name",
      },
      {
        text: "Role",
        value: "role",
        sortable: true,
      },
      {
        text: "Actions",
        value: "actions",
        sortable: true,
      },
    ],
    // table data
    items: [],
    itemIndex: -1,
    currentItem: {
      avatar: itemImage.value,
      email: "",
      name: "",
      role: "",
    },
    defaultItem: {
      avatar: itemImage.value,
      email: "",
      name: "",
      role: "",
    },

    // add item
    dataItem: {
      avatar: itemImage.value,
      email: "",
      name: "",
      role: "",
    },

    //rules
    valid: true,
    itemNameRules: [(v) => !!v || "This field is required"],

    //edit item
    itemId: null,
    docRef: null,

    //snackbar
    snackbar: false,
    timeout: 3000,
    itemStatus: "",

    //image
    uploadLoading: false,
    uploadBtnText: "Upload new photo",
    //uploadBtnTextMobile: props.icons.mdiCloudUploadOutline
    //uploadBtnTextMobile: "Upload"
    uploadBtnTextMobile: mdiCloudUploadOutline,
    uploadTakePicture: mdiCamera,

    //show delete button
    showDelete: false,
  }),

  props: {
    accountData: {
      type: Object,
      default: () => {},
    },
  },

  setup(props) {
    return {
      // status,
      // userRole,
      // userEmail,
      itemImage,

      // userFName,
      // accountDataLocale,
      // userVerified,
      // resetForm,
      icons: {
        mdiAlertOutline,
        mdiCloudUploadOutline,
        mdiCheckCircle,
        mdiProgressDownload,
      },
    };
  },
  computed: {
    // to change modal to add or edit
    formTitle() {
      return this.itemIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogScan(val) {
      val || this.closeScan();
    },
    dialogScanView(val) {
      val || this.closeScanView();
    },
    capturePhoto(val) {
      val || this.closeCapturePhoto();
    },
    dialogUserEdit(val) {
      val || this.closeUserEdit();
    },
  },

  created() {
    // to fetch data
    this.initialize();
  },

  methods: {
    async initialize() {
      onSnapshot(usersColRef, (snapshot) => {
        let items = [];
        snapshot.forEach((doc) => {
          items.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.items = items;
        this.loadingTable = false;
      });
    },

    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },

    done(picture) {
      this.closeCapturePhoto();
      var currentdate = new Date();
      let file = this.dataURLtoFile(picture, "inventory" + currentdate);
      const storage = getStorage();
      const storageRef = ref_storage(storage, "inventories/" + file.name);

      const uploadTask = uploadBytesResumable(storageRef, file, "data_url");

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
            itemImage.value = downloadURL;
          });
        }
      );
    },

    // edit function
    async editItem(item) {
      this.itemIndex = this.items.indexOf(item);
      if (this.itemIndex > -1) {
        this.dataItem = Object.assign({}, item);
        this.itemId = this.dataItem.id;
        this.docRef = doc(usersColRef, this.itemId);
        itemImage.value = this.dataItem.image;
        this.showDelete = true;
      }
      this.dialogUserEdit = true;
    },

    openDelete() {
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.items.splice(this.itemIndex, 1);
      await deleteDoc(this.docRef);
      this.closeDelete();
      this.itemStatus = "Deleted";
      this.snackbar = true;
      this.resetForm();
      this.dialogUserEdit = false;
    },

    // delete function
    // async deleteItem(item) {
    //   this.dataItem = Object.assign({}, item);
    //   this.itemId = this.dataItem.id;
    //   this.docRef = doc(inventoryColRef, this.itemId);
    //   this.dialogDelete = true;
    // },

    // async deleteItemConfirm() {
    //   this.items.splice(this.itemIndex, 1);
    //   await deleteDoc(this.docRef);
    //   this.closeDelete();
    //   this.itemStatus = 'Deleted';
    //   this.snackbar = true;
    //   this.resetForm();
    // },

    // close function for edit and add
    close() {
      this.resetForm();
      this.dialogUserEdit = false;
      this.$nextTick(() => {
        this.currentItem = Object.assign({}, this.defaultItem);
        this.itemIndex = -1;
      });
      itemImage.value =
        "https://assumptaclinic.com/wp-content/uploads/2022/10/default-assumpta.jpg";
      this.showDelete = false;
    },

    // close function for delete
    closeDelete() {
      this.dialogDelete = false;
      this.resetForm();
      this.$nextTick(() => {
        this.currentItem = Object.assign({}, this.defaultItem);
        this.itemIndex = -1;
      });
    },

    // close function for scan
    closeScan() {
      this.dialogScan = false;
    },

    closeScanView() {
      this.dialogScanView = false;
      this.$router.go();
    },

    closeUserEdit() {
      this.dialogUserEdit = false;
    },

    closeCapturePhoto() {
      this.capturePhoto = false;
    },

    openCapturePhoto() {
      this.capturePhoto = true;
    },

    openBarcodeScanner() {
      this.dialogScan = true;
    },

    openDialogUserEdit() {
      this.dialogUserEdit = true;
    },

    // function for edit and add
    async save() {
      if (this.itemIndex > -1) {
        // edit function
        if (this.$refs.form.validate()) {
          await updateDoc(this.docRef, {
            // image: itemImage.value,
            // itemname: this.dataItem.itemname,
            // barcode: this.dataItem.barcode,
            // storebox: this.dataItem.storebox,
            // total: this.dataItem.total,
            // display: this.dataItem.display,
            image: itemImage.value,
            itemname: this.dataItem.itemname,
            barcode: this.dataItem.barcode,
            retail: this.dataItem.retail,
            stockunit: this.dataItem.stockunit,
            reorderlevel: this.dataItem.reorderlevel,
            manufacturer: this.dataItem.manufacturer,

            available: this.dataItem.available,
            unitcost: this.dataItem.unitcost,
            display: this.dataItem.display,
            totalstocks: this.dataItem.available + this.dataItem.display,
            totalcost: this.dataItem.totalcost,
            expiry: this.dataItem.expiry,
            supplier: this.dataItem.supplier,
          });
          // await setDoc(this.docRef, this.dataItem);
          this.close();
          this.itemStatus = "Updated";
          this.snackbar = true;
        }
      } else {
        // add function
        if (this.$refs.form.validate()) {
          // const addedDoc = await addDoc(inventoryColRef, this.$data.dataItem);
          console.log(itemImage.value);
          await addDoc(usersColRef, {
            // image: itemImage.value,
            // itemname: this.dataItem.itemname,
            // barcode: this.dataItem.barcode,
            // storebox: this.dataItem.storebox,
            // total: this.dataItem.total,
            // display: this.dataItem.display,
            image: itemImage.value,
            itemname: this.dataItem.itemname,
            barcode: this.dataItem.barcode,
            retail: this.dataItem.retail,
            stockunit: this.dataItem.stockunit,
            reorderlevel: this.dataItem.reorderlevel,
            manufacturer: this.dataItem.manufacturer,

            available: this.dataItem.available,
            unitcost: this.dataItem.unitcost,
            display: this.dataItem.display,
            totalstocks: this.dataItem.available + this.dataItem.display,
            totalcost: this.dataItem.totalcost,
            expiry: this.dataItem.expiry,
            supplier: this.dataItem.supplier,
          });
          this.close();
          this.itemStatus = "Added";
          this.snackbar = true;
        }
      }
    },

    async onDecode(result) {
      console.log(result);
      const q = query(
        collection(db, "inventory"),
        where("barcode", "==", result)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        this.dialogScan = false;
        this.dialogScanView = true;
      } else {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.scanStatus = true;
          this.scanBarcode = "" + doc.data().barcode;
          this.scanDisplayStocks = "" + doc.data().display;
          this.scanItemImage =
            "https://assumptaclinic.com/wp-content/uploads/2022/10/profile-icon-default.jpeg";
          this.scanItemName = "" + doc.data().itemname;
          this.scanStorebox = "" + doc.data().storebox;
          this.scanTotalStocks = "" + doc.data().total;
        });
        this.dialogScan = false;
        this.dialogScanView = true;
      }
    },

    onLoaded(result) {
      console.log(result);
    },

    validate() {
      this.$refs.form.validate();
    },
    resetForm() {
      this.$refs.form.reset();
    },
    getColor(role) {
      if (role == "Inventory Admin") return "success";
      else if (role == null) return "";
      else return "primary";
    },

    //upload avatar
    uploadItemImage(e) {
      let file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref_storage(storage, "inventories/" + file.name);

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
            itemImage.value = downloadURL;
          });
        }
      );
    },
  },
};
</script>
<style></style>
