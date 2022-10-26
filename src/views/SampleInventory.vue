<template>
  <div class="sample-iv">
    <!-- Success Alert -->
    <v-snackbar v-model="snackbar" :timeout="timeout" top color="primary" outlined rounded="pill">
      <v-icon color="primary">{{ successIcon }}</v-icon>

      Item {{ itemStatus }} Successfully!
      <template v-slot:action="{ attrs2 }">

        <v-spacer></v-spacer>
        <v-btn color="primary" text v-bind="attrs2" @click="snackbar = false">
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Data Table -->
    <v-data-table :headers="headers" :items="items" sort-by="name" class="elevation-1 pt-3" :search="search"
      v-model="selected" :single-select="singleSelect" item-key="itemname" show-select :loading="loadingTable">

      <template v-slot:top>
        <v-toolbar flat>
          <!-- Table Top Functions -->
          <v-switch v-model="singleSelect" class="mb-n6 mr-4"></v-switch>
          <v-icon class="mr-2">{{ searchIcon }}</v-icon>
          <v-text-field v-model="search" label="Search Item..." single-line hide-details>

          </v-text-field>
          <v-spacer></v-spacer>

          <!-- Barcode Scan Button -->
          <v-btn color="primary" elevation="2" class="mr-2 hidden-sm-and-down" @click="openBarcodeScanner">Barcode Scan
          </v-btn>

          <!-- Scan Barcode Modal -->
          <v-dialog v-model="dialogScan" max-width="550px">
            <v-card class="pa-5 d-flex flex-column justify-center">
              <v-chip color="primary" class="d-flex justify-center rounded-pill font-weight-bold text-h6 pa-5 ">Scan
                barcode
              </v-chip>
              <v-card-title class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden">
                <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" stop></StreamBarcodeReader>
              </v-card-title>

              <v-card-actions class="mb-n5">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="closeScan">Cancel</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Scan View Modal -->
          <v-dialog v-model="dialogScanView" max-width="550px">
            <v-card flat class="pa-3 mt-2">
              <v-chip color="primary" class="d-flex justify-center rounded-pill mb-4 font-weight-bold text-h6 pa-5 ">
                Scan
                Result
              </v-chip>
              <div v-if="scanStatus">
                <v-card-text class="d-flex align-center">
                  <v-avatar rounded size="120" class="me-6">
                    <v-img :src="scanItemImage"></v-img>
                  </v-avatar>
                  <!-- upload photo -->
                  <div class="align-center">
                    <h1 class="headline mt-5">
                      {{ scanItemName}}
                    </h1>
                    <p class="text-sm">
                      {{ scanBarcode }}
                    </p>
                  </div>
                </v-card-text>
                <v-card-text>
                  <v-form class="multi-col-validation mt-6">
                    <v-row>
                      <v-col md="6" cols="12">
                        <v-text-field v-model="scanBarcode" label="Barcode" dense outlined readonly></v-text-field>
                      </v-col>
                      <v-col md="6" cols="12">
                        <v-text-field v-model="scanItemName" label="Item name" dense outlined readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="scanDisplayStocks" label="Display Stocks" dense outlined readonly>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="scanStorebox" dense label="Storebox" outlined readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="scanTotalStocks" dense label="Total Stocks" outlined readonly>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </div>

              <!-- alert -->
              <v-col cols="12" v-else>
                <v-alert color="info" text class="mb-0">
                  <div class="d-flex align-start">
                    <v-icon color="info">
                      {{ barcodeIcon }}
                    </v-icon>

                    <div class="ms-3">
                      <p class="text-base font-weight-medium mb-1">
                        No Item Found.
                      </p>

                    </div>
                  </div>
                </v-alert>
              </v-col>
            </v-card>
          </v-dialog>

          <!-- Add & Edit Item Modal -->
          <v-dialog v-model="dialog" max-width="900">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" outlined class="" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="d-flex justify-center ">
                <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">{{ formTitle }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <v-container>

                  <v-form ref="form">

                    <div class="d-flex  justify-center align-center">
                      <p class="mr-3 text-subtitle-1">Item Information</p>
                      <v-divider></v-divider>
                    </div>

                    <v-row no-gutters class="d-flex justify-center">
                      <v-col cols="12" sm="3" class="ma-2 align-self-center">
                        <v-card-text class="d-flex justify-center flex-column align-center mt-2">
                          <v-avatar rounded size="80" class="">
                            <v-img :src="itemImage"></v-img>
                          </v-avatar>
                          <div class="d-flex justify-center flex-column align-center">
                            <v-btn color="primary" class="mt-3" small @click="$refs.refInputEl.click();">
                              <v-icon class="d-sm-none">
                                {{ uploadBtnTextMobile }}
                              </v-icon>
                              <span class="d-none d-sm-block">{{ uploadBtnText }}</span>
                            </v-btn>

                            <input ref="refInputEl" @change="uploadItemImage" type="file" accept=".jpeg,.png,.jpg,GIF"
                              :hidden="true" />

                            <p class="text-caption text-center mt-2">
                              Allowed JPG, GIF or PNG. Max size of 1MB
                            </p>
                          </div>
                        </v-card-text>
                      </v-col>

                      <v-col cols="12" sm="4" class="ma-2 align-self-center">
                        <v-text-field v-model="dataItem.itemname" :rules="itemNameRules" label="Item Name" clearable
                          required outlined dense>
                        </v-text-field>

                        <v-text-field v-model="dataItem.barcode" :rules="itemNameRules" label="Barcode" type="number"
                          clearable outlined dense>
                        </v-text-field>

                        <v-text-field v-model="dataItem.retail" :rules="itemNameRules" label="Retail Price"
                          type="number" clearable outlined dense>
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" sm="4" class="ma-2 align-self-center">
                        <v-text-field v-model.number="dataItem.stockunit" :rules="itemNameRules" label="Stock Unit"
                          clearable outlined dense>
                        </v-text-field>

                        <v-text-field v-model.number="dataItem.reorderlevel" :rules="itemNameRules"
                          label="Reorder Level" type="number" clearable outlined dense>
                        </v-text-field>

                        <v-text-field v-model.number="dataItem.manufacturer" :rules="itemNameRules" label="Manufacturer"
                          clearable outlined dense>
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <div class="d-flex  justify-center align-center">
                      <p class="mr-3 text-subtitle-1">Stock Information</p>
                      <v-divider></v-divider>
                    </div>

                    <v-row no-gutters class="d-flex justify-center">
                      <v-col cols="12" sm="3" class="ma-2">
                        <v-text-field v-model.number="dataItem.available" label="Quantity (excluding display)" clearable
                          outlined dense>
                        </v-text-field>
                        <v-text-field v-model.number="dataItem.unitcost" label="Unit Cost" clearable outlined dense>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" class="ma-2">
                        <v-text-field v-model.number="dataItem.display" label="Quantity to Display" clearable outlined
                          dense>
                        </v-text-field>
                        <v-text-field v-model.number="dataItem.totalcost" label="Total Cost" clearable outlined dense>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" class="ma-2">
                        <v-text-field v-model.number="dataItem.expiry" label="Expiry Date" clearable outlined dense>
                        </v-text-field>
                        <v-text-field v-model.number="dataItem.supplier" label="Supplier" clearable outlined dense>
                        </v-text-field>
                      </v-col>
                    </v-row>






                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-btn color="error" @click="openDelete" v-if="showDelete">
                  Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="primary" @click="save">
                  Save</v-btn>


              </v-card-actions>

            </v-card>
          </v-dialog>
          <!-- Round buttons -->
          <v-btn color="white" elevation="2" class="ml-2 primary hidden-sm-and-up" fab small outlined
            @click="openBarcodeScanner">
            <v-icon>{{ barcodeIcon }}</v-icon>
          </v-btn>
          <!-- <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" elevation="2" class="ml-2 hidden-md-and-up" fab small outlined v-bind="attrs"
                v-on="on">
                <v-icon>{{ plusIcon }}</v-icon>
              </v-btn>
            </template>
          </v-dialog> -->
          <v-btn color="primary" elevation="2" class="ml-2 hidden-sm-and-down" fab small outlined>
            <v-icon>{{ pdfIcon }}</v-icon>
          </v-btn>
          <v-btn color="primary" elevation="2" class="ml-2 hidden-sm-and-down" fab small outlined>
            <v-icon>{{ editIcon }}</v-icon>
          </v-btn>
          <v-btn color="error" elevation="2" class="ml-2 hidden-sm-and-down" fab small>
            <v-icon>{{ deleteIcon }}</v-icon>
          </v-btn>
          <!-- <v-switch
          v-model="singleExpand"
          class="mt-2" x-small
        ></v-switch> -->

          <!-- Delete Item Modal -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card class="pa-5 d-flex flex-column justify-center">
              <v-chip color="error" class="d-flex justify-center font-weight-bold text-h6 pa-5">Delete Item
              </v-chip>
              <v-card-title class="-d-flex justify-center">Are you sure you want to delete this item?</v-card-title>
              <p class="text-center font-weight-bold text-h5">{{ dataItem.itemname }}</p>
              <v-card-actions class="mb-n5">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="closeDelete">Cancel</v-btn>
                <v-btn color="primary" @click="deleteItemConfirm">YES</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.totalstocks="{ item }" class="text-center">
        <v-chip :color="getColor(item.totalstocks, item.reorderlevel)" dark>
          <v-icon left color="white">
           {{ numberIcon }}
          </v-icon>
          {{ item.totalstocks }}
        </v-chip>
      </template>


      <template v-slot:item.image="{ item }" class="text-center">
        <v-avatar rounded size="50" class="ma-2">
          <v-img :src="item.image"></v-img>
        </v-avatar>

      </template>


      <!-- Table Actions Buttons -->
      <template v-slot:item.actions="{ item }">
        <div class="d-flex flex-row align-center">
          <v-btn color="primary" elevation="2" class="mr-2" fab x-small outlined @click="editItem(item)">
            <v-icon>{{ editIcon }}</v-icon>
          </v-btn>
          <v-btn color="primary" elevation="2" class="mr-2" fab x-small >
            <v-icon>{{ consumeIcon }}</v-icon>
          </v-btn>
          <!-- <v-btn color="error" elevation="2" class="" fab x-small @click="deleteItem(item)">
            <v-icon>{{ deleteIcon }}</v-icon>
          </v-btn> -->
          <!-- <v-btn color="secondary" elevation="0" class="" x-small outlined>
            <v-icon class="mx-n16">{{ moreIcon }}</v-icon>
            
          </v-btn> -->

        </div>

      </template>
      <!-- Reset Button if No Data -->
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info about {{ item.itemname }}
        </td>
      </template>
    </v-data-table>

  </div>

</template>
<script>
  // icons
  import {
    mdiPencil,
    mdiDelete,
    mdiCheckboxMarkedCircleOutline,
    mdiMagnify,
    mdiFilePdfBox,
    mdiDotsVertical,
    mdiBarcodeScan,
    mdiPlus,
    mdiHandHeart,
    mdiCircle,
    mdiAlertOutline,
    mdiCloudUploadOutline,
    mdiCheckCircle,
    mdiProgressDownload,
  } from '@mdi/js'

  // crud imports
  import db from '@/fb';
  // import { collection } from "firebase/firestore";
  import {
    StreamBarcodeReader
  } from "vue-barcode-reader";
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

  } from '@firebase/firestore';


  const inventoryColRef = collection(db, "inventory");

  //upload image imports
  import {
    ref,
    onMounted
  } from '@vue/composition-api';
  import {
    getStorage,
    uploadBytes,
    ref as ref_storage,
    uploadBytesResumable,
    getDownloadURL
  } from "firebase/storage";
  const itemImage = ref('https://assumptaclinic.com/wp-content/uploads/2022/10/default-assumpta.jpg');

  export default {
    components: {
      StreamBarcodeReader
    },
    data: () => ({

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

      // modal data
      dialog: false,
      dialogDelete: false,
      dialogScan: false,
      dialogScanView: false,


      // Scan Modal
      scanItemImage: 'https://assumptaclinic.com/wp-content/uploads/2022/10/profile-icon-default.jpeg',
      scanItemName: 'Sample Name',
      scanBarcode: '12312312312',
      scanStorebox: '686',
      scanTotalStocks: '454',
      scanDisplayStocks: '565',
      scanStatus: false,

      //search and select data
      search: '',
      singleSelect: false,
      selected: [],
      expanded: [],
      singleExpand: false,


      // table header data
      headers: [{
          text: 'Image',
          align: 'start',
          value: 'image',
        },
        {
          text: 'Item Name',
          value: 'itemname',
        },
        {
          text: 'Barcode',
          sortable: true,
          value: 'barcode'
        },
        {
          text: 'Retail Price',
          sortable: true,
          value: 'retail'
        },
        {
          text: 'Available Stocks',
          sortable: true,
          value: 'available'
        },
        {
          text: 'On Display',
          sortable: true,
          value: 'display'
        },
        {
          text: 'Total Stocks',
          sortable: true,
          value: 'totalstocks'
        },
        // {
        //   text: 'Item Status', //expired stocks?
        //   sortable: true,
        //   value: 'itemstatus'
        // },
        {
          text: 'Actions',
          value: 'actions',
          sortable: true
        },
      ],
      // table data
      items: [],
      itemIndex: -1,
      currentItem: {
        image: itemImage.value,
        itemname: '',
        barcode: '',
        retail: '',
        stockunit: '',
        reorderlevel: '',
        manufacturer: '',

        available: 0,
        unitcost: 0,
        display: 0,
        totalstocks: 0,
        totalcost: 0,
        expiry: 'na',
        supplier: 'na',
      },
      defaultItem: {
        image: itemImage.value,
        itemname: '',
        barcode: '',
        retail: '',
        stockunit: '',
        reorderlevel: '',
        manufacturer: '',

        available: 0,
        unitcost: 0,
        display: 0,
        totalstocks: 0,
        totalcost: 0,
        expiry: 'na',
        supplier: 'na',
      },

      // add item
      dataItem: {
        image: itemImage.value,
        itemname: '',
        barcode: '',
        retail: '',
        stockunit: '',
        reorderlevel: '',
        manufacturer: '',

        available: 0,
        unitcost: 0,
        display: 0,
        totalstocks: 0,
        totalcost: 0,
        expiry: 'na',
        supplier: 'na',
      },

      //rules
      valid: true,
      itemNameRules: [
        v => !!v || 'This field is required',
      ],

      //edit item
      itemId: null,
      docRef: null,

      //snackbar
      snackbar: false,
      timeout: 3000,
      itemStatus: '',

      //image
      uploadLoading: false,
      uploadBtnText: "Upload new photo",
      //uploadBtnTextMobile: props.icons.mdiCloudUploadOutline
      //uploadBtnTextMobile: "Upload"
      uploadBtnTextMobile: mdiCloudUploadOutline,

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
      }
    },
    computed: {
      // to change modal to add or edit
      formTitle() {
        return this.itemIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
      dialogScan(val) {
        val || this.closeScan()
      },
      dialogScanView(val) {
        val || this.closeScanView()
      }
    },

    created() {
      // to fetch data
      this.initialize();

    },

    methods: {
      async initialize() {
        onSnapshot(inventoryColRef, (snapshot) => {
          let items = []
          snapshot.forEach((doc) => {
            items.push({
              ...doc.data(),
              id: doc.id
            })
          });
          this.items = items;
          this.loadingTable = false;
        })
      },

      // edit function
      async editItem(item) {
        this.itemIndex = this.items.indexOf(item)
        if (this.itemIndex > -1) {
          this.dataItem = Object.assign({}, item);
          this.itemId = this.dataItem.id;
          this.docRef = doc(inventoryColRef, this.itemId);
          itemImage.value = this.dataItem.image;
          this.showDelete = true;
        }
        this.dialog = true
      },

      openDelete() {
        this.dialogDelete = true;

      },

      async deleteItemConfirm() {
        this.items.splice(this.itemIndex, 1);
        await deleteDoc(this.docRef);
        this.closeDelete();
        this.itemStatus = 'Deleted';
        this.snackbar = true;
        this.resetForm();
        this.dialog = false;
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
        this.dialog = false
        this.$nextTick(() => {
          this.currentItem = Object.assign({}, this.defaultItem)
          this.itemIndex = -1
        })
        itemImage.value = 'https://assumptaclinic.com/wp-content/uploads/2022/10/default-assumpta.jpg';
        this.showDelete = false;
      },

      // close function for delete
      closeDelete() {
        this.dialogDelete = false;
        this.resetForm();
        this.$nextTick(() => {
          this.currentItem = Object.assign({}, this.defaultItem)
          this.itemIndex = -1
        })
      },

      // close function for scan
      closeScan() {
        this.dialogScan = false;
      },

      closeScanView() {
        this.dialogScanView = false;
        this.$router.go();
      },

      openBarcodeScanner() {
        this.dialogScan = true;
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
            })
            // await setDoc(this.docRef, this.dataItem);
            this.close();
            this.itemStatus = 'Updated';
            this.snackbar = true;
          }

        } else {
          // add function
          if (this.$refs.form.validate()) {
            // const addedDoc = await addDoc(inventoryColRef, this.$data.dataItem);
            console.log(itemImage.value);
            await addDoc(inventoryColRef, {
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
            })
            this.close();
            this.itemStatus = 'Added';
            this.snackbar = true;

          }

        }
      },

      async onDecode(result) {
        console.log(result);
        const q = query(collection(db, "inventory"), where("barcode", "==", result));
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
        console.log(result)
      },

      validate() {
        this.$refs.form.validate();
      },
      resetForm() {
        this.$refs.form.reset();
      },
      getColor(totalstocks, reorderlevel) {
        if (totalstocks > reorderlevel) return 'primary'
        else if (totalstocks == null) return ''
        else return 'error'
      },

      //upload avatar
      uploadItemImage(e) {
        let file = e.target.files[0];
        const storage = getStorage();
        const storageRef = ref_storage(storage, 'inventories/' + file.name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploadBtnText = "Uploading: " + progress.toFixed(0) + '%';
            this.uploadBtnTextMobile = mdiProgressDownload;
            //this.uploadBtnTextMobile = "Uploading: " + progress.toFixed(0) + '%';

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            this.uploadBtnText = 'Uploaded Successfully';

            this.uploadBtnTextMobile = mdiCheckCircle;
            //this.uploadBtnTextMobile = 'Photo Uploaded';
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              itemImage.value = downloadURL;

            });
          }
        );
      },
    },
  }
</script>
<style scoped>
  tr {
    text-align: center;


  }
</style>