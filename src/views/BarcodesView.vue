<template>
  <div class=" screensz">
    <!-- snackbar -->
    <v-snackbar v-model="snackbar" :timeout="timeout" top>
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="upper-btns mb-5">
      <v-row no-gutters class="d-flex justify-center align-center">
        <v-col cols="12" sm="6" md="2" class="pa-1" v-if="isNonInventoryStaff">
          <v-dialog v-model="scanDialog" max-width="500" persistent="">
            <template v-slot:activator="{ on, attrs }">
              <v-card
                class="bg-white d-flex justify-center align-center flex-column"
                height="200"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon x-large class="mb-2" color="primary">{{
                  scanIcon
                }}</v-icon>
                <p>Scan Item</p>
              </v-card>
            </template>
            <v-card>
              <v-card-title class="d-flex justify-center ">
                <v-chip
                  color="primary"
                  class="d-flex justify-center font-weight-bold text-h6 pa-5"
                  >Scan Item
                </v-chip>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form">
                    <div class="d-flex  justify-center align-center">
                      <v-divider></v-divider>
                      <p class=" text-subtitle-1">Select Action</p>
                      <v-divider></v-divider>
                    </div>

                    <div class="d-flex justify-center flex-column">
                      <v-btn
                        color="primary"
                        outlined
                        class="mb-2"
                        @click="viewDialog = !viewDialog"
                      >
                        View Item Info
                      </v-btn>
                      <v-btn
                        color="primary"
                        outlined
                        class="mb-2"
                        @click="editDialog = !editDialog"
                      >
                        Edit Item
                      </v-btn>
                      <v-btn
                        color="primary"
                        large
                        class="mb-2"
                        @click="deductDialog = !deductDialog"
                      >
                        Consume Stocks
                      </v-btn>
                      <v-btn color="primary" large class="mb-2">
                        Add Stocks
                      </v-btn>
                      <v-btn
                        v-if="isInventoryStaff"
                        color="error"
                        large
                        class="mb-2"
                        @click="deleteDialog = !deleteDialog"
                      >
                        Delete Item
                      </v-btn>
                    </div>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions class="">
                <v-btn
                  color="secondary"
                  @click="scanDialog = false"
                  class="text-center mx-auto"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- dialog for viewing -->
          <v-dialog v-model="viewDialog" max-width="900px">
            <v-card class="">
              <v-card-title class="d-flex justify-center ">
                <v-chip
                  color="primary"
                  class="d-flex justify-center font-weight-bold text-h6 pa-5"
                  >View Item Information
                </v-chip>
              </v-card-title>

              <v-container class="my-5 px-12">
                <v-form ref="form">
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Scan Barcode</p>
                    <v-divider></v-divider>
                  </div>

                  <v-row no-gutters class="d-flex justify-center">
                    <v-col cols="12" sm="8" class="ma-2 align-self-center">
                      <v-card-title
                        class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden"
                      >
                        <StreamBarcodeReader @decode="decodeViewItem" stop>
                        </StreamBarcodeReader>
                      </v-card-title>
                    </v-col>
                  </v-row>

                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Item Information</p>
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
                      </v-card-text>
                    </v-col>

                    <v-col cols="12" sm="4" class="ma-2 align-self-center">
                      <v-text-field
                        label="Item Name"
                        readonly
                        outlined
                        dense
                        v-model="dataItem.itemname"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Barcode"
                        type="number"
                        readonly
                        outlined
                        dense
                        v-model="dataItem.barcode"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Retail Price"
                        type="number"
                        readonly
                        outlined
                        dense
                        :prepend-inner-icon="phpIcon"
                        v-model="dataItem.retail"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="4" class="ma-2 align-self-center">
                      <v-text-field
                        label="Stock Unit"
                        readonly
                        outlined
                        dense
                        v-model.number="dataItem.stockunit"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Reorder Level"
                        type="number"
                        readonly
                        outlined
                        v-model.number="dataItem.reorderlevel"
                        dense
                      >
                      </v-text-field>

                      <v-text-field
                        label="Manufacturer"
                        readonly
                        outlined
                        dense
                        v-model.number="dataItem.manufacturer"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Stock Information</p>
                    <v-divider></v-divider>
                  </div>

                  <v-row no-gutters class="d-flex justify-center">
                    <v-col cols="12" sm="3" class="ma-2">
                      <v-text-field
                        label="Quantity (excluding display)"
                        readonly
                        outlined
                        v-model.number="dataItem.available"
                        dense
                      >
                      </v-text-field>
                      <v-text-field
                        label="Unit Cost"
                        outlined
                        dense
                        v-model.number="dataItem.unitcost"
                        readonly
                        :prepend-inner-icon="phpIcon"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="ma-2">
                      <v-text-field
                        label="Quantity to Display"
                        outlined
                        dense
                        readonly
                        v-model.number="dataItem.display"
                      >
                      </v-text-field>
                      <v-text-field
                        label="Total Cost"
                        outlined
                        dense
                        readonly
                        :prepend-inner-icon="phpIcon"
                        v-model.number="dataItem.totalcost"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="ma-2">
                      <v-text-field
                        label="Expiry Date"
                        outlined
                        dense
                        readonly
                        v-model="dataItem.expiry"
                        :append-icon="dateIcon"
                      >
                      </v-text-field>
                      <v-text-field
                        label="Supplier"
                        outlined
                        dense
                        readonly
                        v-model.number="dataItem.supplier"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="viewDialog = false">DONE</v-btn>
                <v-btn color="secondary" @click="viewDialog = false"
                  >CANCEL</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- dialog for editing -->
          <v-dialog v-model="editDialog" max-width="900px">
            <v-card class="">
              <v-card-title class="d-flex justify-center ">
                <v-chip
                  color="primary"
                  class="d-flex justify-center font-weight-bold text-h6 pa-5"
                  >Edit Item Information
                </v-chip>
              </v-card-title>

              <v-container class="my-5 px-12">
                <v-form ref="formEdit">
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Scan Barcode</p>
                    <v-divider></v-divider>
                  </div>

                  <v-row no-gutters class="d-flex justify-center">
                    <v-col cols="12" sm="8" class="ma-2 align-self-center">
                      <v-card-title
                        class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden"
                      >
                        <StreamBarcodeReader @decode="decodeEditItem" stop>
                        </StreamBarcodeReader>
                      </v-card-title>
                    </v-col>
                  </v-row>

                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Item Information</p>
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
                      </v-card-text>
                    </v-col>

                    <v-col cols="12" sm="4" class="ma-2 align-self-center">
                      <v-text-field
                        label="Item Name"
                        clearable
                        outlined
                        dense
                        required
                        :rules="fieldRules"
                        v-model="dataItem.itemname"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Barcode"
                        type="number"
                        counter="14"
                        outlined
                        dense
                        :rules="inputRules"
                        required
                        readonly
                        v-model="dataItem.barcode"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Retail Price"
                        type="number"
                        clearable
                        outlined
                        dense
                        required
                        :prepend-inner-icon="phpIcon"
                        :rules="fieldRules"
                        v-model="dataItem.retail"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="4" class="ma-2 align-self-center">
                      <v-text-field
                        :rules="fieldRules"
                        label="Stock Unit"
                        clearable
                        outlined
                        dense
                        hint="P100/(stock unit here) e.g. P100/bottle"
                        v-model.number="dataItem.stockunit"
                      >
                      </v-text-field>

                      <v-text-field
                        :rules="fieldRules"
                        label="Reorder Level"
                        type="number"
                        clearable
                        outlined
                        dense
                        hint="low stock indicator"
                        v-model.number="dataItem.reorderlevel"
                      >
                      </v-text-field>

                      <v-text-field
                        :rules="fieldRules"
                        label="Manufacturer"
                        clearable
                        outlined
                        dense
                        v-model.number="dataItem.manufacturer"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Stock Information</p>
                    <v-divider></v-divider>
                  </div>

                  <v-row no-gutters class="d-flex justify-center">
                    <v-col cols="12" sm="3" class="ma-2">
                      <v-text-field
                        label="Quantity to Store"
                        hint="excluding stocks on display"
                        type="number"
                        clearable
                        :rules="fieldRules"
                        outlined
                        dense
                        v-model.number="dataItem.available"
                      >
                      </v-text-field>
                      <v-text-field
                        label="Unit Cost"
                        clearable
                        type="number"
                        outlined
                        dense
                        :rules="fieldRules"
                        :prepend-inner-icon="phpIcon"
                        v-model.number="dataItem.unitcost"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="ma-2">
                      <v-text-field
                        label="Quantity to Display"
                        type="number"
                        clearable
                        outlined
                        dense
                        :rules="fieldRules"
                        v-model.number="dataItem.display"
                      >
                      </v-text-field>
                      <v-text-field
                        label="Total Cost"
                        clearable
                        outlined
                        dense
                        hint="total quantity x unit cost"
                        type="number"
                        :rules="fieldRules"
                        :prepend-inner-icon="phpIcon"
                        v-model.number="dataItem.totalcost"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="ma-2">
                      <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dataItem.expiry"
                            label="Expiry Date"
                            :rules="fieldRules"
                            required
                            outlined
                            dense
                            :append-icon="dateIcon"
                            hint="format: yyyy-mm-dd"
                            v-bind="attrs"
                            v-on="on"
                          >
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dataItem.expiry"
                          @input="menu2 = false"
                        >
                        </v-date-picker>
                      </v-menu>
                      <v-text-field
                        label="Supplier"
                        clearable
                        outlined
                        dense
                        :rules="fieldRules"
                        v-model.number="dataItem.supplier"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="editScanItem(dataItem.id)"
                  >SAVE</v-btn
                >
                <v-btn color="secondary" @click="editDialog = false"
                  >CANCEL</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- dialog for deducting -->
          <v-dialog v-model="deductDialog" max-width="900px">
            <v-card class="">
              <v-card-title class="d-flex justify-center ">
                <v-chip
                  color="primary"
                  class="d-flex justify-center font-weight-bold text-h6 pa-5"
                >
                  Consume Stocks
                </v-chip>
              </v-card-title>

              <v-container class="my-5 px-12">
                <v-form ref="form">
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Stock Information</p>
                    <v-divider></v-divider>
                  </div>

                  <v-row no-gutters class="d-flex justify-center">
                    <v-col
                      cols="12"
                      sm="12"
                      class="d-flex justify-center flex-column flex-sm-row"
                    >
                      <v-card-text
                        class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden"
                      >
                        <StreamBarcodeReader @decode="decodeConsumeStock" stop>
                        </StreamBarcodeReader>
                      </v-card-text>
                      <v-card-text
                        class="d-flex justify-center flex-column align-center mt-2"
                      >
                        <p class="text-center font-weight-black text-h7 mb-2">
                          {{ dataItem.itemname }}
                        </p>
                        <p class="ma-0">
                          Available stock: {{ dataItem.available }}
                        </p>
                        <p class="ma-0">
                          Display stock: {{ dataItem.display }}
                        </p>
                        <v-avatar rounded size="180" class="">
                          <v-img :src="itemImage"></v-img>
                        </v-avatar>
                        <p></p>
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" sm="12" class=" align-self-center">
                      <v-data-table
                        :headers="headers"
                        :items="items"
                        sort-by="name"
                        class="elevation-1 pt-3"
                        item-key="itemname"
                        :loading="loadingTable"
                      >
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="deductDialog = false"
                  >DONE</v-btn
                >
                <v-btn color="secondary" @click="deductDialog = false"
                  >CANCEL</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="deleteDialog" max-width="900px">
            <v-card class="">
              <v-card-title class="d-flex justify-center ">
                <v-chip
                  color="error"
                  class="d-flex justify-center font-weight-bold text-h6 pa-5"
                >
                  Delete Item
                </v-chip>
              </v-card-title>

              <v-container class="my-5 px-12">
                <v-form ref="form">
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Stock Information</p>
                    <v-divider></v-divider>
                  </div>

                  <v-row no-gutters class="d-flex justify-center">
                    <v-col
                      cols="12"
                      sm="12"
                      class="d-flex justify-center flex-column flex-sm-row"
                    >
                      <v-card-text
                        class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden"
                      >
                        <StreamBarcodeReader @decode="decodeDeleteItem" stop>
                        </StreamBarcodeReader>
                      </v-card-text>
                      <v-card-text
                        class="d-flex justify-center flex-column align-center mt-2"
                      >
                        <p class="text-center font-weight-black text-h7">
                          Are you sure you want to delete <br /><span
                            class="text-h5"
                            >'{{ dataItem.itemname }}'</span
                          >
                          item?
                        </p>
                        <v-avatar rounded size="150" class="">
                          <v-img :src="itemImage"></v-img>
                        </v-avatar>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="deleteInventoryItem(dataItem.id, dataItem.itemname)"
                  >YES</v-btn
                >
                <v-btn color="secondary" @click="deleteDialog = false"
                  >CANCEL</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>

        <!-- Delete logs-->
        <v-dialog v-model="deleteConfirmation" persistent max-width="500">
          <v-card class="d-flex justify-center flex-column pa-md-10">
            <p class="text-h10">
              Are you sure you want to DELETE "{{ currentTransactionName }}"
              Inventory
            </p>
            <v-card-actions class="mx-auto">
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="deleteConfirmation = false">
                Cancel
              </v-btn>
              <v-btn color="error" @click="deleteLogs"> Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-col cols="12" sm="6" md="2" class="pa-1" v-if="isNonInventoryStaff">
          <v-dialog v-model="generateDialog" persistent max-width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-card
                class=" bg-white d-flex justify-center align-center flex-column"
                height="200"
                v-bind="attrs"
                v-on="on"
                @click="generateBarcode"
              >
                <v-icon x-large class="mb-2" color="primary">{{
                  generateIcon
                }}</v-icon>
                <p>Generate Barcode</p>
              </v-card>
            </template>
            <v-card class="pa-5 d-flex flex-column justify-center text-center">
              <v-chip
                color="primary"
                class="d-flex justify-center rounded-pill font-weight-bold text-h6 pa-5 mb-4"
              >
                Generate barcode
              </v-chip>

              <barcode :value="barcodeValue" format="EAN13" elementTag="img">
                There is something wrong...
              </barcode>

              <v-card-actions class="mx-auto mt-4">
                <v-btn color="green darken-1" text @click="cancelBarcode">
                  CANCEL
                </v-btn>

                <v-btn class="primary" text @click="saveBarcode">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="5" md="2" class="pa-1">
          <v-card class="mb-2" height="95">
            <v-row no-gutters class="pa-2 text-center text-sm-start">
              <v-col cols="12" xs="12" class="align-self-center ">
                <v-icon class="" color="primary">{{ scanIcon }}</v-icon>
              </v-col>
              <v-col cols="12" xs="12" class="align-self-center">
                <p class="text-caption mb-n1 mt-4">Total Scans Today</p>
                <p class="text-subtitle-1">{{ totalbrcd }} scans</p>
              </v-col>
            </v-row>
          </v-card>
          <v-card class="text-center" height="95" justify-center align-center>
            <v-row no-gutters class="pa-2 text-center text-sm-start">
              <v-col cols="12" xs="12" class="align-self-center ">
                <v-icon class="" color="primary">{{ generateIcon }}</v-icon>
              </v-col>
              <v-col cols="12" xs="12" class="align-self-center">
                <p class="text-caption mb-n1 mt-4">Total Barcodes</p>
                <p class="text-subtitle-1">{{ totalbrcd }} barcodes</p>
              </v-col>
            </v-row>
          </v-card>
          <!-- <v-card class="d-flex justify-center" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="d-flex justify-center flex-column">
                                <v-icon class="" color="primary">{{ generateIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">Total Barcodes</p>
                                <p class="text-subtitle-1">45 barcodes</p>

                            </v-col>
                        </v-row>
                    </v-card> -->
        </v-col>
        <v-col cols="12" sm="7" md="6" class="pa-1">
          <v-card class=" bg-white d-flex flex-column pa-4" height="200">
            <p>Barcode Transactions per day</p>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div class="barcode-table">
      <v-data-table
        :headers="headers"
        :items="barcodeTransactionTable"
        sort-by="item"
        class="elevation-1 pt-3"
        :search="search"
        item-key="code"
        :loading="loadingTable"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <!-- Table Top Functions -->

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

        <template v-slot:item.timestamp="{ item }" class="text-center">
          <v-chip>
            {{ formatDate(item.timestamp) }}
          </v-chip>
        </template>

        <!-- Table Actions Buttons -->

        <template v-slot:item.actions="{ item }">
          <!-- <v-btn
            color="primary"
            elevation="2"
            class="mr-2"
            fab
            x-small
            outlined
            @click="editItem(item)"
          >
            <v-icon>{{ editIcon }}</v-icon>
          </v-btn> -->
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
      </v-data-table>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import {
  mdiBarcodeScan,
  mdiBarcode,
  mdiMagnify,
  mdiPencil,
  mdiDelete,
  mdiCloudUploadOutline,
  mdiCurrencyPhp,
  mdiCalendarMonth,
} from "@mdi/js";

import { StreamBarcodeReader } from "vue-barcode-reader";
import db from "@/fb";
import {
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  collection,
  where,
  query,
  Timestamp,
} from "@firebase/firestore";
import VueBarcode from "vue-barcode";

//upload image imports
import { ref, onMounted } from "@vue/composition-api";
import {
  getStorage,
  uploadBytes,
  ref as ref_storage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
//import { onMounted, ref } from "@vue/composition-api";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
//import { getDocs, collection, query } from "@firebase/firestore";
//import db from "@/fb";
const isInventoryStaff = ref(true);
const isNonInventoryStaff = ref(true);
const YesNonStaff = ref(false);
let auth;

const barcodeTransactionRef = collection(db, "barcode-transactions");
const inventoryColRef = collection(db, "inventory");
const itemImage = ref(
  "https://assumptaclinic.com/wp-content/uploads/2022/10/default-assumpta.jpg"
);
var audio = new Audio(require("../assets/images/misc/barcode.mp3"));

let newHeader = ref([]);
export default {
  components: {
    StreamBarcodeReader,
    barcode: VueBarcode,
  },
  data: () => ({
    barcodeTransactionTable: [],
    base64: "",
    barcodeValue: "046872030134",
    alignments: ["start", "center", "end"],
    loadingTable: true,
    scanIcon: mdiBarcodeScan,
    generateIcon: mdiBarcode,
    searchIcon: mdiMagnify,
    editIcon: mdiPencil,
    deleteIcon: mdiDelete,
    phpIcon: mdiCurrencyPhp,
    dateIcon: mdiCalendarMonth,
    snackbar: false,
    text: "",
    timeout: 3000,
    currentTransactionId: "",
    currentTransactionName: "",
    totalbrcd: 0,

    // add item
    dataItem: {
      image: "",
      itemname: "",
      barcode: "",
      retail: "",
      stockunit: "",
      reorderlevel: "",
      manufacturer: "",
      inventory_id: "",

      available: 0,
      unitcost: 0,
      display: 0,
      totalstocks: 0,
      totalcost: 0,
      expiry: "",
      supplier: "",
      state: "open",
      level: "info",
    },

    // table header data
    // headers: [
    //   {
    //     text: "Code",
    //     align: "start",
    //     value: "code",
    //   },
    //   {
    //     text: "Item",
    //     sortable: false,
    //     value: "item",
    //   },
    //   {
    //     text: "Inventory",
    //     sortable: false,
    //     value: "inventory",
    //   },
    //   {
    //     text: "Action",
    //     value: "action",
    //     sortable: false,
    //   },
    //   {
    //     text: "Date/Time",
    //     sortable: false,
    //     value: "timestamp",
    //   },
    //   // {
    //   //   text: "Actions",
    //   //   value: "actions",
    //   //   sortable: false,
    //   // },
    // ],

    // table data
    items: [
      {
        code: "100000",
        item: "NOBIVAC DHPPLI L4",
        inventory: "Vaccines",
        action: "Item Updated",
        datetime: "09/05/2023",
      },
      {
        code: "2656549",
        item: "RABISIN MULTIDOSE",
        inventory: "Vaccines",
        action: "Item Deducted",
        datetime: "09/05/2023",
      },
    ],

    //dialogs
    scanDialog: false,
    generateDialog: false,
    viewDialog: false,
    editDialog: false,
    deductDialog: false,
    deleteDialog: false,
    deleteConfirmation: false,

    //image
    uploadLoading: false,
    uploadBtnText: "Upload",
    uploadBtnTextMobile: mdiCloudUploadOutline,

    //table functions
    search: "",
    singleSelect: false,
    selected: [],
    // loadingTable: false,

    //rules
    valid: true,
    fieldRules: [(v) => !!v || "This field is required"],

    //barcoderules
    inputRules: [
      (v) => !!v || "This field is required",
      (v) => (v && v.length >= 12) || "Minimum length is 12 numbers",
    ],

    //date picker
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
  }),

  setup(props) {
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
                YesNonStaff.value = true;
              } else if (doc.data().role == "Non-Inventory Staff") {
                isInventoryStaff.value = false;
                isNonInventoryStaff.value = false;
                YesNonStaff.value = true;
              } else {
                isInventoryStaff.value = true;
                isNonInventoryStaff.value = true;
                YesNonStaff.value = false;
              }
            }
          });
        }
      });
    });
    return {
      //headers: [],
      isInventoryStaff,
      isNonInventoryStaff,
      itemImage,
      icons: {
        mdiCloudUploadOutline,
      },
    };
  },
  computed: {
    headers() {
      const headers = [
        {
          text: "Code",
          align: "start",
          value: "code",
        },
        {
          text: "Item",
          sortable: false,
          value: "item",
        },
        {
          text: "Inventory",
          sortable: false,
          value: "inventory",
        },
        {
          text: "Action",
          value: "action",
          sortable: false,
        },
        {
          text: "Date/Time",
          sortable: false,
          value: "timestamp",
        },
      ];

      //console.log(isNonInventoryStaff.value)
      //console.log("Value: " + YesNonStaff.value)

      if (YesNonStaff.value) {
        //console.log("truely")
        return headers;
      } else {
        //console.log("falsey")
        headers.push({ text: "Actions", value: "actions", sortable: true });
        return headers;
      }
    },
  },
  created() {
    this.initialize();
  },

  methods: {
    onLoaded(result) {
      console.log(result);
    },

    formatDate(date) {
      let to_date = date.toDate();
      let format_date = moment(to_date).format("DD/MM/YYYY hh:mma");
      return format_date;
    },

    generateBarcode() {
      this.barcodeValue = Math.floor(
        Math.random() * 899999999999 + 100000000000
      );
      console.log(this.barcodeValue);
    },

    async initialize() {
      onSnapshot(barcodeTransactionRef, (snapshot) => {
        let items = [];
        snapshot.forEach((doc) => {
          items.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.barcodeTransactionTable = items;
        this.loadingTable = false;
        //TOTAL BARCODES
        this.totalbrcd = items.length;
      });
    },

    async cancelBarcode() {
      this.saveBarcodeLog("Cancelled");
    },
    async saveBarcode() {
      this.saveBarcodeLog("Saved");
    },
    async saveBarcodeLog(action) {
      const docRef = await addDoc(collection(db, "barcode-transactions"), {
        code: this.barcodeValue,
        item: "Generate Barcode",
        inventory: "New Barcode",
        action: action,
        timestamp: Timestamp.now(),
      });
      this.generateDialog = false;
      this.text = "Barcode log saved successfully.";
      this.snackbar = true;
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
        (error) => {},
        () => {
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

    deleteItem(item) {
      this.deleteConfirmation = true;
      this.currentTransactionId = item.id;
      this.currentTransactionName = item.item;
    },
    async deleteLogs() {
      this.deleteConfirmation = false;
      await deleteDoc(
        doc(db, "barcode-transactions", this.currentTransactionId)
      );
      this.text = "Log has been deleted successfully.";
      this.snackbar = true;
    },

    onDecode(result) {
      console.log(result);
    },

    async decodeDeleteItem(result) {
      audio.play();
      let deleteItem = [];
      const q = query(inventoryColRef, where("barcode", "==", result));
      const deleteItemSnapshot = await getDocs(q);
      if (deleteItemSnapshot.empty) {
        this.text = "No item found.";
        this.snackbar = true;
        this.deleteDialog = false;
      } else {
        deleteItemSnapshot.forEach((doc) => {
          itemImage.value = doc.data().image;
          deleteItem.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.dataItem = Object.assign({}, deleteItem[0]);
        this.text = "Item found: " + this.dataItem.itemname;
        this.snackbar = true;
      }
    },

    async deleteInventoryItem(id, name) {
      console.log(id);
      await deleteDoc(doc(inventoryColRef, id));

      this.text = name + " item successfully deleted.";
      this.snackbar = true;
      this.deleteDialog = false;
    },

    async decodeViewItem(result) {
      audio.play();
      let viewItem = [];
      const q = query(inventoryColRef, where("barcode", "==", result));
      const viewSnapshot = await getDocs(q);
      if (viewSnapshot.empty) {
        this.text = "No item found.";
        this.snackbar = true;
        this.deleteDialog = false;
      } else {
        viewSnapshot.forEach((doc) => {
          itemImage.value = doc.data().image;
          viewItem.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.dataItem = Object.assign({}, viewItem[0]);
        this.text = "Item found: " + this.dataItem.itemname;
        this.snackbar = true;
      }
    },

    async decodeEditItem(result) {
      audio.play();
      let editItem = [];
      const q = query(inventoryColRef, where("barcode", "==", result));
      const viewSnapshot = await getDocs(q);
      if (viewSnapshot.empty) {
        this.text = "No item found.";
        this.snackbar = true;
        this.deleteDialog = false;
      } else {
        viewSnapshot.forEach((doc) => {
          itemImage.value = doc.data().image;
          editItem.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.dataItem = Object.assign({}, editItem[0]);
        console.log(this.dataItem);
        this.text = "Item found: " + this.dataItem.itemname;
        this.snackbar = true;
      }
    },

    async decodeConsumeStock(result) {
      audio.play();
      let consumeStockItem = [];
      const q = query(inventoryColRef, where("barcode", "==", result));
      const viewSnapshot = await getDocs(q);
      if (viewSnapshot.empty) {
        this.text = "No item found.";
        this.snackbar = true;
        this.deleteDialog = false;
      } else {
        viewSnapshot.forEach((doc) => {
          itemImage.value = doc.data().image;
          consumeStockItem.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.dataItem = Object.assign({}, consumeStockItem[0]);
        this.text = "Item found: " + this.dataItem.itemname;
        this.snackbar = true;
      }
    },

    async editScanItem(id) {
      if (this.$refs.formEdit.validate()) {
        await updateDoc(doc(inventoryColRef, id), {
          image: itemImage.value,
          itemname: this.dataItem.itemname,
          barcode: this.dataItem.barcode,
          retail: this.dataItem.retail,
          stockunit: this.dataItem.stockunit,
          reorderlevel: this.dataItem.reorderlevel,
          manufacturer: this.dataItem.manufacturer,

          inventory_id: this.dataItem.inventory_id,
          available: this.dataItem.available,
          unitcost: this.dataItem.unitcost,
          display: this.dataItem.display,
          totalstocks: this.dataItem.available + this.dataItem.display,
          totalcost: this.dataItem.totalcost,
          expiry: this.dataItem.expiry,
          supplier: this.dataItem.supplier,
          state: this.dataItem.state,
          level: this.dataItem.level,
        });

        this.text = this.dataItem.itemname + " item successfully deleted.";
        this.snackbar = true;
        this.editDialog = false;
      }
    },
  },
};
</script>
<style></style>
