<template>
  <div class=" screensz">
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

      <template v-slot:action="{ attrs }">
        <v-btn color="primary" text v-bind="attrs" @click="snackbar = false">
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
                        @click="consumeDialog = !consumeDialog"
                      >
                        Consume Stocks
                      </v-btn>
                      <v-btn
                        color="primary"
                        large
                        class="mb-2"
                        @click="dialogAddStocks = !dialogAddStocks"
                      >
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
          <v-dialog v-model="viewDialog" max-width="900px" persistent>
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
                <v-btn color="primary" @click="closeViewDialog">DONE</v-btn>
                <v-btn color="secondary" @click="closeViewDialog">CANCEL</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- dialog for editing -->
          <v-dialog v-model="editDialog" max-width="900px" persistent>
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
                <v-btn color="secondary" @click="closeEditDialog">CANCEL</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- UI Consume -->

          <v-dialog v-model="consumeDialog" max-width="700px" persistent>
            <v-card class="pa-5 d-flex flex-column justify-center">
              <v-chip
                color="primary"
                class="d-flex justify-center font-weight-bold text-h6 pa-5"
              >
                Consume Stocks
              </v-chip>
              <div class="my-5 px-12">
                <v-form ref="formConsumeStock">
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Stock Information</p>
                    <v-divider></v-divider>
                  </div>
                  <v-row no-gutters class="d-flex justify-center">
                    <v-col cols="12" sm="8" class="ma-2 align-self-center">
                      <v-card-title
                        class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden"
                      >
                        <StreamBarcodeReader @decode="decodeConsumeStock" stop>
                        </StreamBarcodeReader>
                      </v-card-title>
                    </v-col>
                  </v-row>
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">
                      Consume Stock Information
                    </p>
                    <v-divider></v-divider>
                  </div>
                  <v-text-field
                    v-model="dataItem.itemname"
                    label="Item Name"
                    dense
                    readonly
                    class="mb-4"
                  >
                  </v-text-field>

                  <v-text-field
                    v-model="stkConsume"
                    :rules="fieldRules"
                    label="Quantity to Consume"
                    outlined
                    dense
                    type="number"
                  >
                    <p class="text-center font-weight-black text-h7 mb-2">
                      {{ dataItem.itemname }}
                    </p>
                  </v-text-field>
                  <p class="text-caption">
                    Current Available Stocks: {{ dataItem.available }}
                  </p>
                  <p class="text-caption">
                    Current On Display Stocks: {{ dataItem.display }}
                  </p>
                  <v-select
                    :items="consumeWhere"
                    v-model="stkWhere"
                    label="Consume in"
                    outlined
                    dense
                    :rules="fieldRules"
                  ></v-select>
                </v-form>
              </div>
              <v-card-actions class="mb-n5">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="closeConsumeDialog"
                  >Cancel</v-btn
                >
                <v-btn
                  color="primary"
                  :disabled="consumeBtn"
                  @click="consumeStockScan(dataItem.id)"
                  >Consume</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Add Stocks -->
          <v-dialog v-model="dialogAddStocks" max-width="700px" persistent>
            <v-card class="pa-5 d-flex flex-column justify-center">
              <v-chip
                color="primary"
                class="d-flex justify-center font-weight-bold text-h6 pa-5 mb-6"
                >Add Stocks
              </v-chip>
              <div class="mx-5 mx-sm-10">
                <v-form ref="formAddStocks">
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Scan Barcode</p>
                    <v-divider></v-divider>
                  </div>

                  <v-row no-gutters class="d-flex justify-center">
                    <v-col cols="12" sm="8" class="ma-2 align-self-center">
                      <v-card-title
                        class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden"
                      >
                        <StreamBarcodeReader @decode="decodeAddStocks" stop>
                        </StreamBarcodeReader>
                      </v-card-title>
                    </v-col>
                  </v-row>
                  <div class="d-flex  justify-center align-center">
                    <p class="mr-3 text-subtitle-1">Add Stock Information</p>
                    <v-divider></v-divider>
                  </div>
                  <v-text-field
                    v-model="dataItem.itemname"
                    label="Item Name"
                    dense
                    readonly
                    class="mb-4"
                  >
                  </v-text-field>
                  <p class="text-caption">
                    Current Available Stocks: {{ dataItem.available }}
                  </p>
                  <v-text-field
                    v-model="stkStore"
                    :rules="fieldRules"
                    label="Quantity to Store"
                    outlined
                    dense
                    type="number"
                  >
                  </v-text-field>
                  <p class="text-caption">
                    Current On Display Stocks: {{ dataItem.display }}
                  </p>
                  <v-text-field
                    v-model="stkAdd"
                    :rules="fieldRules"
                    label="Quantity to Display"
                    outlined
                    dense
                    type="number"
                  >
                  </v-text-field>
                </v-form>
              </div>
              <v-card-actions class="mb-n5">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="closeDialogAddStocks"
                  >Cancel</v-btn
                >
                <v-btn color="primary" @click="addStockScan(dataItem.id)"
                  >Add Stock
                </v-btn>
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
                          >
                            {{ dataItem.itemname }}
                          </span>
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
          <v-card class="pa-5 d-flex justify-center flex-column">
            <v-chip
              color="error"
              class="d-flex justify-center  font-weight-bold text-h5 mb-5 pa-5"
              >Delete Transaction
            </v-chip>
            <p class="d-flex justify-center text-h6 text-center">
              Are you sure you want to delete "{{ currentTransactionName }}"
              transaction
            </p>
            <v-card-actions class="mx-auto mt-4">
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
              <v-col
                cols="12"
                xs="1"
                sm="3"
                md="3"
                class="d-flex justify-center flex-column"
              >
                <v-icon class="" color="primary">{{ scanIcon }}</v-icon>
              </v-col>
              <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                <p class="text-caption mb-n1 mt-4">Total Scans</p>
                <p class="text-subtitle-1">{{ totalscns }} scans</p>
              </v-col>
            </v-row>
          </v-card>
          <v-card class="text-center" height="95" justify-center align-center>
            <v-row no-gutters class="pa-2 text-center text-sm-start">
              <v-col
                cols="12"
                xs="1"
                sm="3"
                md="3"
                class="d-flex justify-center flex-column"
              >
                <v-icon class="" color="primary">{{ generateIcon }}</v-icon>
              </v-col>
              <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                <p class="text-caption mb-n1 mt-4">Total Generates</p>
                <p class="text-subtitle-1">{{ totalgens }} generates</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="7" md="6" class="pa-1">
          <v-card class=" bg-white d-flex flex-column pa-4" height="200">
            <vue-apex-charts
              type="bar"
              :options="chartOptions"
              :series="series"
            ></vue-apex-charts>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div class="barcode-table">
      <v-data-table
        :headers="headers"
        :items="barcodeTransactionTable"
        sort-by="timestamp"
        :sort-desc="true"
        class="elevation-1 pt-3"
        :search="search"
        item-key="id"
        :loading="loadingTable"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <!-- Table Top Functions -->

            <v-icon class="mr-2">{{ searchIcon }}</v-icon>
            <v-text-field
              v-model="search"
              label="Search transaction..."
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

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="error"
                elevation="2"
                class="mr-2"
                fab
                x-small
                v-bind="attrs"
                v-on="on"
                @click="deleteItem(item)"
              >
                <v-icon>{{ deleteIcon }}</v-icon>
              </v-btn>
            </template>
            <span>Delete Transaction</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import VueApexCharts from "vue-apexcharts";
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
  orderBy,
  limit,
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
    VueApexCharts,
  },
  data: () => ({
    barcodeTransactionTable: [],
    consumeBtn: true,
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
    totalgens: 0,
    totalscns: 1,

    //Consume
    stkConsume: 0,
    consumeWhere: ["Available Stocks", "On Display Stocks"],
    stkWhere: "",
    stkStore: 0,
    stkAdd: 0,

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
    consumeDialog: false,
    deleteDialog: false,
    deleteConfirmation: false,
    dialogAddStocks: false,

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

    // Chart
    series: [
      {
        name: "PRODUCT A",
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: "PRODUCT B",
        data: [13, 23, 20, 8, 13, 27],
      },
      {
        name: "PRODUCT C",
        data: [11, 17, 15, 15, 21, 14],
      },
      {
        name: "PRODUCT D",
        data: [21, 7, 25, 13, 22, 8],
      },
    ],
    chartOptions: {
      chart: {
        type: "bar",

        height: 180,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "10px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        type: "text",
        categories: [
          "01/01/2011 GMT",
          "01/02/2011 GMT",
          "01/03/2011 GMT",
          "01/04/2011 GMT",
          "01/05/2011 GMT",
          "01/06/2011 GMT",
        ],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
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
          text: "Barcode",
          align: "start",
          value: "code",
        },
        // {
        //   text: "Item",
        //   sortable: false,
        //   value: "item",
        // },
        {
          text: "Scan or Generate",
          sortable: false,
          value: "scanorgen",
        },
        {
          text: "Log",
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
      });
      let today = moment();
      let lastWeek = today.subtract(1, "w");

      const q = query(
        barcodeTransactionRef,
        where("timestamp", ">=", lastWeek.toDate()),
        orderBy("timestamp", "desc")
      );
      onSnapshot(q, (snapshot) => {
        let consumeItems = [];
        let deleteItems = [];
        let viewItems = [];
        let addItems = [];
        let updateItems = [];
        let items = [];

        let overall_header = [];
        let consume_data = [];
        let delete_data = [];
        let view_data = [];
        let add_data = [];
        let update_data = [];

        snapshot.forEach((doc) => {
          items.push({
            action: doc.data().action,
            id: doc.id,
            date: moment(doc.data().timestamp.toDate()).format("MMM D"),
          });
        });

        snapshot.forEach((doc) => {
          items.push({
            action: doc.data().action,
            id: doc.id,
            date: moment(doc.data().timestamp.toDate()).format("MMM D"),
          });

          if (
            doc.data().action.includes("Consume") ||
            doc.data().action.includes("Consumed")
          ) {
            consumeItems.push({
              date: moment(doc.data().timestamp.toDate()).format("MMM D"),
              name: "Consume",
            });
          }

          if (doc.data().action.includes("Deleted")) {
            deleteItems.push({
              date: moment(doc.data().timestamp.toDate()).format("MMM D"),
              name: "Delete",
            });
          }

          if (doc.data().action.includes("Viewed")) {
            viewItems.push({
              date: moment(doc.data().timestamp.toDate()).format("MMM D"),
              name: "View",
            });
          }

          if (doc.data().action.includes("Added")) {
            addItems.push({
              date: moment(doc.data().timestamp.toDate()).format("MMM D"),
              name: "Add",
            });
          }

          if (doc.data().action.includes("edited")) {
            updateItems.push({
              date: moment(doc.data().timestamp.toDate()).format("MMM D"),
              name: "Update",
            });
          }
        });

        const result = Object.entries(
          items.reduce((acc, { date }) => {
            acc[date] = (acc[date] || 0) + 1;

            return acc;
          }, {})
        ).map(([k, v]) => ({ id: k, count: v }));

        const fixedDate = [];

        result.forEach((item) => {
          overall_header.push(item.id);
          fixedDate.push({
            id: item.id,
          });
        });

        const result_consume = Object.entries(
          consumeItems.reduce((acc, { date }) => {
            acc[date] = (acc[date] || 0) + 1;

            return acc;
          }, {})
        ).map(([k, v]) => ({ id: k, count: v }));

        const a3 = fixedDate.map((t1) => ({
          ...t1,
          ...result_consume.find((t2) => t2.id === t1.id),
        }));

        a3.forEach((item) => {
          if (item.count === undefined) {
            consume_data.push(0);
          } else {
            consume_data.push(item.count);
          }
          // consume_data.push(item.count);
          // consume_header.push(item.id);
        });

        const result_delete = Object.entries(
          deleteItems.reduce((acc, { date }) => {
            acc[date] = (acc[date] || 0) + 1;

            return acc;
          }, {})
        ).map(([k, v]) => ({ id: k, count: v }));

        // result_delete.forEach((item) => {
        //   delete_data.push(item.count);
        //   delete_header.push(item.id);
        // });

        const deleteMerged = fixedDate.map((t1) => ({
          ...t1,
          ...result_delete.find((t2) => t2.id === t1.id),
        }));

        deleteMerged.forEach((item) => {
          if (item.count === undefined) {
            delete_data.push(0);
          } else {
            delete_data.push(item.count);
          }
        });

        const result_view = Object.entries(
          viewItems.reduce((acc, { date }) => {
            acc[date] = (acc[date] || 0) + 1;

            return acc;
          }, {})
        ).map(([k, v]) => ({ id: k, count: v }));

        const viewMerged = fixedDate.map((t1) => ({
          ...t1,
          ...result_view.find((t2) => t2.id === t1.id),
        }));

        viewMerged.forEach((item) => {
          if (item.count === undefined) {
            view_data.push(0);
          } else {
            view_data.push(item.count);
          }
        });

        const result_add = Object.entries(
          addItems.reduce((acc, { date }) => {
            acc[date] = (acc[date] || 0) + 1;

            return acc;
          }, {})
        ).map(([k, v]) => ({ id: k, count: v }));

        const addMerged = fixedDate.map((t1) => ({
          ...t1,
          ...result_add.find((t2) => t2.id === t1.id),
        }));

        addMerged.forEach((item) => {
          if (item.count === undefined) {
            add_data.push(0);
          } else {
            add_data.push(item.count);
          }
        });

        const result_update = Object.entries(
          updateItems.reduce((acc, { date }) => {
            acc[date] = (acc[date] || 0) + 1;

            return acc;
          }, {})
        ).map(([k, v]) => ({ id: k, count: v }));

        const updateMerged = fixedDate.map((t1) => ({
          ...t1,
          ...result_update.find((t2) => t2.id === t1.id),
        }));

        updateMerged.forEach((item) => {
          if (item.count === undefined) {
            update_data.push(0);
          } else {
            update_data.push(item.count);
          }
        });

        this.series = [
          {
            name: "Consume",
            data: consume_data,
          },
          {
            name: "Delete",
            data: delete_data,
          },
          {
            name: "View",
            data: view_data,
          },
          {
            name: "Add",
            data: add_data,
          },

          {
            name: "Update",
            data: update_data,
          },
        ];

        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories: overall_header,
            },
          },
        };
      });

      // const q1 = query(
      //     barcodeTransactionRef,
      //     where("scanorgen", "==", "Generate")
      //   );
      // const querySnapshot1 = await getDocs(q1);
      // let barGens = [];
      // querySnapshot1.forEach((doc) => {
      //       barGens.push({
      //         ...doc.data(),
      //         id: doc.id,
      //       });

      //     });
      // console.log( barGens)
      //   //TOTAL GENERATES
      // this.totalgens = barGens.length;

      const q1 = query(
        barcodeTransactionRef,
        where("scanorgen", "==", "Generate")
      );
      onSnapshot(q1, (querySnapshot1) => {
        let barGens = [];
        querySnapshot1.forEach((doc) => {
          barGens.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.totalgens = barGens.length;
      });

      const q2 = query(barcodeTransactionRef, where("scanorgen", "==", "Scan"));

      onSnapshot(q2, (querySnapshot2) => {
        let barScans = [];
        querySnapshot2.forEach((doc) => {
          barScans.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.totalscns = barScans.length;
      });
    },

    async cancelBarcode() {
      this.generateDialog = false;
    },
    async saveBarcode() {
      this.saveBarcodeLog("Barcode Generated Saved");
    },
    async saveBarcodeLog(action) {
      const docRef = await addDoc(collection(db, "barcode-transactions"), {
        code: this.barcodeValue,
        // item: "Generate Barcode",
        scanorgen: "Generate",
        action: action,
        timestamp: Timestamp.now(),
      });
      this.generateDialog = false;
      this.text = "Transaction Saved Successfully";
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

    closeViewDialog() {
      this.viewDialog = false;
      this.dataItem = {
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
      };
    },

    closeEditDialog() {
      this.editDialog = false;
      this.dataItem = {
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
      };
    },

    closeConsumeDialog() {
      this.consumeDialog = false;
      this.dataItem = {
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
      };
    },

    closeDialogAddStocks() {
      this.dialogAddStocks = false;
      this.dataItem = {
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
      };
    },

    deleteItem(item) {
      this.deleteConfirmation = true;
      this.currentTransactionId = item.id;
      this.currentTransactionName = item.action;
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
        this.deleteDialog = false;
        this.text = "No item found.";
        this.snackbar = true;
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
        this.barcodeLog(
          this.dataItem.itemname + " Deleted via Scan",
          this.dataItem.barcode,
          "Scan"
        );
      }
    },

    async deleteInventoryItem(id, name) {
      console.log(id);
      await deleteDoc(doc(inventoryColRef, id));
      this.deleteDialog = false;
      this.text = name + " item successfully deleted.";
      this.snackbar = true;
    },

    async decodeViewItem(result) {
      audio.play();
      let viewItem = [];
      const q = query(inventoryColRef, where("barcode", "==", result));
      const viewSnapshot = await getDocs(q);
      if (viewSnapshot.empty) {
        this.viewDialog = false;
        this.text = "No item found.";
        this.snackbar = true;
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
        this.barcodeLog(
          this.dataItem.itemname + " Viewed via Scan",
          this.dataItem.barcode,
          "Scan"
        );
      }
    },

    async decodeEditItem(result) {
      audio.play();
      let editItem = [];
      const q = query(inventoryColRef, where("barcode", "==", result));
      const viewSnapshot = await getDocs(q);
      if (viewSnapshot.empty) {
        this.editDialog = false;
        this.text = "No item found.";
        this.snackbar = true;
      } else {
        viewSnapshot.forEach((doc) => {
          itemImage.value = doc.data().image;
          editItem.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.dataItem = Object.assign({}, editItem[0]);
        this.text = "Item found: " + this.dataItem.itemname;
        this.snackbar = true;
        this.barcodeLog(
          this.dataItem.itemname + " to be edited via Scan",
          this.dataItem.barcode,
          "Scan"
        );
      }
    },

    async decodeConsumeStock(result) {
      audio.play();
      let consumeStockItem = [];
      const q = query(inventoryColRef, where("barcode", "==", result));
      const viewSnapshot = await getDocs(q);
      if (viewSnapshot.empty) {
        this.consumeDialog = false;
        this.text = "No item found.";
        this.snackbar = true;
      } else {
        viewSnapshot.forEach((doc) => {
          itemImage.value = doc.data().image;
          consumeStockItem.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.dataItem = Object.assign({}, consumeStockItem[0]);
        let isItemExpired = this.isExpired(this.dataItem.expiry);
        if (isItemExpired <= 0) {
          this.consumeBtn = true;
          this.text = "Item expired: " + this.dataItem.itemname;
          this.snackbar = true;
          this.timeout = 10000;
        } else {
          this.consumeBtn = false;
          this.text = "Item found: " + this.dataItem.itemname;
          this.snackbar = true;
          this.barcodeLog(
            "Consume stocks scan for " + this.dataItem.itemname,
            this.dataItem.barcode,
            "Scan"
          );
        }
      }
    },

    isExpired(item) {
      let dateExpiry = moment(item);
      let todaysDate = moment();

      let diff =
        dateExpiry.diff(todaysDate, "days") === 0
          ? dateExpiry.diff(todaysDate, "days")
          : dateExpiry.diff(todaysDate, "days") + 1;
      return diff;
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
        this.editDialog = false;
        this.text = this.dataItem.itemname + " item successfully updated.";
        this.snackbar = true;
      }
    },

    async consumeStockScan(id) {
      if (this.$refs.formConsumeStock.validate()) {
        if (
          this.stkWhere == "Available Stocks" &&
          this.stkConsume <= this.dataItem.available
        ) {
          await updateDoc(
            doc(inventoryColRef, id),
            {
              available: this.dataItem.available - this.stkConsume,
            },
            { merge: true }
          );
          this.consumeDialog = false;
          this.text = "Consumed stocks successfully.";
          this.snackbar = true;
          this.barcodeLogConsumed(
            "Consumed stocks for " + this.dataItem.itemname,
            this.dataItem.barcode,
            this.dataItem.itemname,
            "Scan",
            "Consumed",
            this.stkConsume
          );
        } else if (
          this.stkWhere == "On Display Stocks" &&
          this.stkConsume <= this.dataItem.display
        ) {
          await updateDoc(
            doc(inventoryColRef, id),
            {
              display: this.dataItem.display - this.stkConsume,
            },
            { merge: true }
          );
          this.consumeDialog = false;
          this.text = "Consumed stocks successfully.";
          this.snackbar = true;
          this.barcodeLogConsumed(
            "Consumed stocks for " + this.dataItem.itemname,
            this.dataItem.barcode,
            this.dataItem.itemname,
            "Scan",
            "Consumed",
            this.stkConsume
          );
        } else {
          this.text =
            "Consumed amount must not be greater than the current amount.";
          this.snackbar = true;
        }
      }
    },

    async decodeAddStocks(result) {
      audio.play();

      let addStocksItem = [];
      const q = query(inventoryColRef, where("barcode", "==", result));
      const addStockSnapshot = await getDocs(q);
      if (addStockSnapshot.empty) {
        this.dialogAddStocks = false;
        this.text = "No item found.";
        this.snackbar = true;
      } else {
        addStockSnapshot.forEach((doc) => {
          itemImage.value = doc.data().image;
          addStocksItem.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        this.dataItem = Object.assign({}, addStocksItem[0]);
        this.text = "Item found: " + this.dataItem.itemname;
        this.snackbar = true;
        this.barcodeLog(
          "Added stocks for " + this.dataItem.itemname,
          this.dataItem.barcode,
          "Scan"
        );
      }
    },

    async addStockScan(id) {
      if (this.$refs.formAddStocks.validate()) {
        await updateDoc(
          doc(inventoryColRef, id),
          {
            available:
              parseInt(this.dataItem.available) + parseInt(this.stkAdd),
            display: parseInt(this.dataItem.display) + parseInt(this.stkAdd),
          },
          { merge: true }
        );
        this.dialogAddStocks = false;
        this.text = "Stocks added successfully.";
        this.snackbar = true;
      }
    },

    async barcodeLog(action, code, option) {
      const docRef = await addDoc(collection(db, "barcode-transactions"), {
        code: code,
        scanorgen: option,
        action: action,
        timestamp: Timestamp.now(),
      });
    },

    async barcodeLogConsumed(action, code, name, option, type, amount) {
      const docRef = await addDoc(
        collection(db, "barcode-transactions"),
        {
          code: code,
          scanorgen: option,
          action: action,
          itemname: name,
          consume: type,
          amount: amount,
          timestamp: Timestamp.now(),
        },
        { merge: true }
      );
    },
  },
};
</script>
<style></style>
