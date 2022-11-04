<template>
    <div class=" screensz">
        <div class="upper-btns mb-5">
            <v-row no-gutters class="d-flex justify-center align-center">
                <v-col cols="12" sm="6" md="2" class="pa-1">
                    <v-dialog v-model="scanDialog" max-width="500" persistent="">
                        <template v-slot:activator="{ on, attrs }">
                            <v-card class=" bg-white d-flex justify-center align-center flex-column" height="200"
                                v-bind="attrs" v-on="on">
                                <v-icon x-large class="mb-2" color="primary">{{ scanIcon }}</v-icon>
                                <p>Scan Item</p>
                            </v-card>
                        </template>
                        <v-card>
                            <v-card-title class="d-flex justify-center ">
                                <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">Scan
                                    Item
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
                                            <v-btn color="primary" outlined class="mb-2"
                                                @click="viewDialog = !viewDialog">
                                                View Item Info
                                            </v-btn>
                                            <v-btn color="primary" outlined class="mb-2"
                                                @click="editDialog = !editDialog">
                                                Edit Item
                                            </v-btn>
                                            <v-btn color="primary" large class="mb-2"
                                                @click="deductDialog = !deductDialog">
                                                Consume Stocks
                                            </v-btn>
                                            <v-btn color="primary" large class="mb-2"
                                                @click="deleteDialog = !deleteDialog">
                                                Delete Item
                                            </v-btn>
                                        </div>
                                    </v-form>
                                </v-container>
                            </v-card-text>

                            <v-card-actions class="">
                                <v-btn color="secondary" @click="scanDialog = false" class="text-center mx-auto">
                                    Cancel
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>



                    <!-- dialog for viewing -->
                    <v-dialog v-model="viewDialog" max-width="900px">
                        <v-card class="">
                            <v-card-title class="d-flex justify-center ">
                                <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">View
                                    Item Information
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
                                                class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden">
                                                <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" stop>
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
                                            <v-card-text class="d-flex justify-center flex-column align-center mt-2">
                                                <v-avatar rounded size="80" class="">
                                                    <v-img :src="itemImage"></v-img>
                                                </v-avatar>
                                            </v-card-text>
                                        </v-col>

                                        <v-col cols="12" sm="4" class="ma-2 align-self-center">
                                            <v-text-field label="Item Name" readonly outlined dense>
                                            </v-text-field>

                                            <v-text-field label="Barcode" type="number" readonly outlined dense>
                                            </v-text-field>

                                            <v-text-field label="Retail Price" type="number" readonly outlined dense>
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="4" class="ma-2 align-self-center">
                                            <v-text-field label="Stock Unit" readonly outlined dense>
                                            </v-text-field>

                                            <v-text-field label="Reorder Level" type="number" readonly outlined dense>
                                            </v-text-field>

                                            <v-text-field label="Manufacturer" readonly outlined dense>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <div class="d-flex  justify-center align-center">
                                        <p class="mr-3 text-subtitle-1">Stock Information</p>
                                        <v-divider></v-divider>
                                    </div>

                                    <v-row no-gutters class="d-flex justify-center">
                                        <v-col cols="12" sm="3" class="ma-2">
                                            <v-text-field label="Quantity (excluding display)" readonly outlined dense>
                                            </v-text-field>
                                            <v-text-field label="Unit Cost" outlined dense readonly>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="3" class="ma-2">
                                            <v-text-field label="Quantity to Display" outlined dense readonly>
                                            </v-text-field>
                                            <v-text-field label="Total Cost" outlined dense readonly>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="3" class="ma-2">
                                            <v-text-field label="Expiry Date" outlined dense clearable>
                                            </v-text-field>
                                            <v-text-field label="Supplier" outlined dense readonly>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-container>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="viewDialog = false">DONE</v-btn>
                                <v-btn color="secondary" @click="viewDialog = false">CANCEL</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for editing -->
                    <v-dialog v-model="editDialog" max-width="900px">
                        <v-card class="">
                            <v-card-title class="d-flex justify-center ">
                                <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">Edit
                                    Item Information
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
                                                class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden">
                                                <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" stop>
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
                                            <v-card-text class="d-flex justify-center flex-column align-center mt-2">
                                                <v-avatar rounded size="80" class="">
                                                    <v-img :src="itemImage"></v-img>
                                                </v-avatar>
                                            </v-card-text>
                                        </v-col>

                                        <v-col cols="12" sm="4" class="ma-2 align-self-center">
                                            <v-text-field label="Item Name" clearable outlined dense
                                                :rules="itemNameRules">
                                            </v-text-field>

                                            <v-text-field counter="14" label="Barcode" type="number" clearable outlined dense
                                            :rules="inputRules">
                                            </v-text-field>

                                            <v-text-field label="Retail Price" type="number" prepend-inner-icon="₱" clearable outlined dense
                                                :rules="itemNameRules">
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="4" class="ma-2 align-self-center">
                                            <v-text-field label="Stock Unit" clearable outlined dense
                                                :rules="itemNameRules">
                                            </v-text-field>

                                            <v-text-field label="Reorder Level" type="number" clearable outlined dense
                                                :rules="itemNameRules">
                                            </v-text-field>

                                            <v-text-field label="Manufacturer" clearable outlined dense
                                                :rules="itemNameRules">
                                            </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <div class="d-flex  justify-center align-center">
                                        <p class="mr-3 text-subtitle-1">Stock Information</p>
                                        <v-divider></v-divider>
                                    </div>

                                    <v-row no-gutters class="d-flex justify-center">
                                        <v-col cols="12" sm="3" class="ma-2">
                                            <v-text-field label="Quantity (excluding display)" clearable outlined dense>
                                            </v-text-field>
                                            <v-text-field label="Unit Cost" outlined dense clearable>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="3" class="ma-2">
                                            <v-text-field label="Quantity to Display" outlined dense clearable>
                                            </v-text-field>
                                            <v-text-field label="Total Cost" outlined dense clearable>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="3" class="ma-2">
                                            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="date" label="Expiry Date" outlined dense
                                                        v-bind="attrs" v-on="on">
                                                    </v-text-field>
                                                </template>
                                                <v-date-picker v-model="date" @input="menu2 = false">
                                                </v-date-picker>
                                            </v-menu>
                                            <v-text-field label="Supplier" outlined dense clearable>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-container>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="editDialog = false">SAVE</v-btn>
                                <v-btn color="secondary" @click="editDialog = false">CANCEL</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for deducting -->
                    <v-dialog v-model="deductDialog" max-width="900px">
                        <v-card class="">
                            <v-card-title class="d-flex justify-center ">
                                <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">
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
                                        <v-col cols="12" sm="12" class="d-flex justify-center flex-column flex-sm-row">
                                            <v-card-text
                                                class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden">
                                                <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" stop>
                                                </StreamBarcodeReader>
                                            </v-card-text>
                                            <v-card-text class="d-flex justify-center flex-column align-center mt-2">

                                                <v-avatar rounded size="180" class="">
                                                    <v-img :src="itemImage"></v-img>
                                                </v-avatar>
                                                <p></p>
                                            </v-card-text>
                                        </v-col>
                                        <v-col cols="12" sm="12" class=" align-self-center">
                                            <v-data-table :headers="headers" :items="items" sort-by="name"
                                                class="elevation-1 pt-3" item-key="itemname" :loading="loadingTable">
                                            </v-data-table>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-container>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="deductDialog = false">DONE</v-btn>
                                <v-btn color="secondary" @click="deductDialog = false">CANCEL</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for deleting -->
                    <!-- <v-dialog v-model="deleteDialog" max-width="1005px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">
                                Delete Item
                            </v-chip>
                            <v-container class="my-5">
                                <v-card flat class="">
                                    <v-row row wrp>
                                        <v-col cols="12" md="6">
                                         
                                            <v-card class="pa-5 d-flex flex-column justify-start" height="340"
                                                width="450">
                                                <v-card-title class="-d-flex justify-start pa-0 my-3 overflow-hidden">

                                                    <StreamBarcodeReader max-width="200" @decode="onDecode"
                                                        @loaded="onLoaded" stop>
                                                    </StreamBarcodeReader>

                                                </v-card-title>
                                            </v-card>
                                        </v-col>
                                        <v-col xs="2">
                                            <p class="fled-x justify-center font-weight-black text-h7">Are you
                                                sure you
                                                want to DELETE 'NOBIVAC DHPPI L4' ITEM?</p>
                                     
                                            <v-card-text class="mt-10">
                                                <v-avatar rounded size="200" class="me-6">
                                                    <v-img :src="itemImage"></v-img>
                                                </v-avatar>


                                            </v-card-text>
                                        </v-col>
                                        <v-col class="mt-16" xs="2">
                                            <v-text-field value="0000110125" label="Barcode" outlined readonly>
                                            </v-text-field>
                                            <v-text-field value="Vaccines" label="Inventory" outlined readonly>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-container>


                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="deleteDialog = false">DELETE</v-btn>
                                <v-btn color="secondary" @click="deleteDialog = false">CANCEL</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog> -->
                    <v-dialog v-model="deleteDialog" max-width="900px">
                        <v-card class="">
                            <v-card-title class="d-flex justify-center ">
                                <v-chip color="error" class="d-flex justify-center font-weight-bold text-h6 pa-5">
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
                                        <v-col cols="12" sm="12" class="d-flex justify-center flex-column flex-sm-row">
                                            <v-card-text
                                                class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden">
                                                <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" stop>
                                                </StreamBarcodeReader>
                                            </v-card-text>
                                            <v-card-text class="d-flex justify-center flex-column align-center mt-2">
                                                <p class="text-center font-weight-black text-h7">Are you
                                                    sure you
                                                    want to delete <br></br><span class="text-h5">'NOBIVAC DHPPI
                                                        L4'</span> item?</p>
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
                                <v-btn color="primary" @click="deleteDialog = false">YES</v-btn>
                                <v-btn color="secondary" @click="deleteDialog = false">CANCEL</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>


                </v-col>
                <v-col cols="12" sm="6" md="2" class="pa-1">
                    <v-dialog v-model="generateDialog" persistent max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                            <v-card class=" bg-white d-flex justify-center align-center flex-column" height="200"
                                v-bind="attrs" v-on="on">
                                <v-icon x-large class="mb-2" color="primary">{{ generateIcon }}</v-icon>
                                <p>Generate Barcode</p>
                            </v-card>
                        </template>
                        <v-card>
                            <v-card-title class="d-flex justify-center ">
                                <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">
                                    Generate Barcode
                                </v-chip>
                            </v-card-title>

                            <v-card-actions class="mx-auto">
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="generateDialog = false">
                                    CANCEL
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
                <v-col cols="12" sm="5" md="2" class="pa-1">
                    <v-card class="mb-2" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="align-self-center  pl-2 pl-md-4">
                                <v-icon class="" color="primary">{{ scanIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">Total Scans Today</p>
                                <p class="text-subtitle-1">14 scans</p>

                            </v-col>
                        </v-row>

                    </v-card>
                    <v-card class="" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="align-self-center  pl-2 pl-md-4">
                                <v-icon class="" color="primary">{{ generateIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">Total Barcodes</p>
                                <p class="text-subtitle-1">45 barcodes</p>

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
            <v-data-table :headers="headers" :items="items" sort-by="name" class="elevation-1 pt-3" :search="search"
                v-model="selected" :single-select="singleSelect" item-key="itemname" show-select
                :loading="loadingTable">

                <template v-slot:top>
                    <v-toolbar flat>
                        <!-- Table Top Functions -->
                        <v-switch v-model="singleSelect" class="mb-n6 mr-4"></v-switch>
                        <v-icon class="mr-2">{{ searchIcon }}</v-icon>
                        <v-text-field v-model="search" label="Search Item..." single-line hide-details>

                        </v-text-field>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </template>

                <!-- Table Actions Buttons -->
                <template v-slot:item.actions="{ item }">
                    <v-btn color="primary" elevation="2" class="mr-2" fab x-small outlined>
                        <v-icon>{{ editIcon }}</v-icon>
                    </v-btn>
                    <v-btn color="error" elevation="2" class="mr-2" fab x-small>
                        <v-icon>{{ deleteIcon }}</v-icon>
                    </v-btn>
                </template>

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
    mdiCloudUploadOutline
} from '@mdi/js'

import {
    StreamBarcodeReader
} from "vue-barcode-reader";

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
        alignments: [
            'start',
            'center',
            'end',
        ],
        loadingTable: true,
        scanIcon: mdiBarcodeScan,
        generateIcon: mdiBarcode,
        searchIcon: mdiMagnify,
        editIcon: mdiPencil,
        deleteIcon: mdiDelete,

        // table header data
        headers: [{
            text: 'Code',
            align: 'start',
            value: 'code',
        },
        {
            text: 'Item',
            sortable: false,
            value: 'item'
        },
        {
            text: 'Inventory',
            sortable: false,
            value: 'inventory'
        },
        {
            text: 'Action',
            value: 'action',
            sortable: false
        },
        {
            text: 'Date/Time',
            sortable: false,
            value: 'datetime'
        },
        {
            text: 'Actions',
            value: 'actions',
            sortable: false
        },
        ],

        // table data
        items: [{
            code: '100000',
            item: 'NOBIVAC DHPPLI L4',
            inventory: 'Vaccines',
            action: 'Item Updated',
            datetime: '09/05/2023',
        },
        {
            code: '2656549',
            item: 'RABISIN MULTIDOSE',
            inventory: 'Vaccines',
            action: 'Item Deducted',
            datetime: '09/05/2023',
        },
        ],

        //dialogs
        scanDialog: false,
        generateDialog: false,
        viewDialog: false,
        editDialog: false,
        deductDialog: false,
        deleteDialog: false,

        //image
        uploadLoading: false,
        uploadBtnText: "Upload",
        uploadBtnTextMobile: mdiCloudUploadOutline,


        //table functions
        search: '',
        singleSelect: false,
        selected: [],
        loadingTable: false,

        //rules
        valid: true,
        itemNameRules: [
            v => !!v || 'This field is required',
        ],

        //barcoderules
        inputRules: [
        v => v.length >= 12 || 'Minimum length is 12 numbers'
      ],

        //date picker
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu: false,
        modal: false,
        menu2: false,


    }),

    setup(props) {
        return {
            itemImage,
            icons: {
                mdiCloudUploadOutline,
            },
        }
    },

    methods: {

        onLoaded(result) {
            console.log(result)
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
                (error) => { },
                () => {

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

        onDecode(result) {
            console.log(result)
        },

    }
}
</script>
<style>

</style>