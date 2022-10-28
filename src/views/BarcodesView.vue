<template>
    <div class="d-flex justify-center flex-column w-screen">
        <div class="upper-btns mb-5 d-flex">
            <v-row no-gutters class="d-flex justify-center align-center">
                <v-col cols="12" sm="5" md="2" class="pa-1">
                    <v-dialog v-model="scanDialog" persistent max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                            <v-card class=" bg-white d-flex justify-center align-center flex-column" height="200"
                                v-bind="attrs" v-on="on">
                                <v-icon x-large class="mb-2" color="primary">{{ scanIcon }}</v-icon>
                                <p>Scan Item</p>
                            </v-card>
                        </template>
                        <v-card class="d-flex justify-center flex-column pa-md-10">
                            <p class="text-center text-subtitle-1">Select Action</p>
                            <v-btn color="primary" outlined class="mb-2" @click="viewDialog = !viewDialog">
                                View Item Info
                            </v-btn>
                            <v-btn color="primary" outlined class="mb-2" @click="editDialog = !editDialog">
                                Edit Item
                            </v-btn>
                            <v-btn color="primary" large class="mb-2" @click="deductDialog = !deductDialog">
                                Deduct Quantity
                            </v-btn>
                            <v-btn color="primary" large class="mb-2" @click="deleteDialog = !deleteDialog">
                                Delete Item
                            </v-btn>

                            <v-card-actions class="mx-auto">
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="scanDialog = false">
                                    CANCEL
                                </v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for viewing -->
                    <v-dialog v-model="viewDialog" max-width="1005px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">View
                                Item Information
                            </v-chip>
                            <v-container class="my-5">
                                <v-card flat class="">
                                    <v-row row wrp>
                                        <v-col cols="12" md="6">
                                            <!-- Scan Barcode Modal -->
                                            <v-card class="pa-5 d-flex flex-column justify-start" height="340"
                                                width="450">
                                                <v-card-title class="-d-flex justify-start pa-0 my-3 overflow-hidden">

                                                    <StreamBarcodeReader max-width="" @decode="onDecode"
                                                        @loaded="onLoaded" stop>
                                                    </StreamBarcodeReader>

                                                </v-card-title>
                                            </v-card>
                                        </v-col>
                                        <v-col xs="2">
                                            <!-- upload photo -->
                                            <v-card-text class="mt-10">
                                                <v-avatar rounded size="120" class="me-6">
                                                    <v-img :src="itemImage"></v-img>
                                                </v-avatar>

                                                <div>
                                                    <v-btn color="primary" class="me-3 mt-5"
                                                        @click="$refs.refInputEl.click();">
                                                        <v-icon class="d-sm-none">
                                                            {{ uploadBtnTextMobile }}
                                                        </v-icon>
                                                        <span class="d-none d-sm-block">{{ uploadBtnText }}</span>
                                                    </v-btn>

                                                    <input ref="refInputEl" @change="uploadItemImage" type="file"
                                                        accept=".jpeg,.png,.jpg,GIF" :hidden="true" />
                                                </div>
                                            </v-card-text>
                                        </v-col>
                                        <v-col class="mt-10" xs="2">
                                            <v-text-field value="0000110125" label="Barcode" outlined readonly>
                                            </v-text-field>
                                            <v-text-field value="NOBIVAC DHPPI L4 (CANINE)" label="Item Name" outlined
                                                readonly>
                                            </v-text-field>
                                            <v-text-field value="Vaccines" label="Inventory" outlined readonly>
                                            </v-text-field>
                                        </v-col>
                                        <v-container class="my-5">
                                            <v-card flat class="px-3">

                                                <v-row no-gutters class="d-flex justify-center">
                                                    <v-col cols="12" sm="3" class="ma-2">
                                                        <v-text-field label="Total Stocks (including on display)"
                                                            value="43" outlined dense readonly>
                                                        </v-text-field>
                                                        <v-btn color="primary" outlined class="mb-7">
                                                            SEE RECEIPTS</v-btn>
                                                        <v-text-field label="Stock on Display" value="45" outlined dense
                                                            readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="3" class="ma-2">
                                                        <v-text-field label="Price" value="541.58" outlined dense
                                                            readonly>
                                                        </v-text-field>
                                                        <v-text-field label="Storebox" value="ABC-123" outlined dense
                                                            readonly>
                                                        </v-text-field>
                                                        <v-text-field label="Expiry Date" value="09/05/2023" outlined
                                                            dense readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="3" class="ma-2">
                                                        <v-text-field label="Low Stock Quantity Indicator" value="5"
                                                            outlined dense readonly>
                                                        </v-text-field>
                                                        <v-text-field label="Brand" value="Nobivac" outlined dense
                                                            readonly>
                                                        </v-text-field>
                                                        <v-text-field label="Supplier" value="Medical Supplier Inc."
                                                            outlined dense readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>



                                            </v-card>
                                        </v-container>

                                    </v-row>
                                </v-card>
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
                    <v-dialog v-model="editDialog" max-width="1005px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">Edit
                                Item Information
                            </v-chip>
                            <v-container class="my-5">
                                <v-card flat class="">
                                    <v-row row wrp>
                                        <v-col cols="12" md="6">
                                            <!-- Scan Barcode Modal -->
                                            <v-card class="pa-5 d-flex flex-column justify-start" height="340"
                                                width="450">
                                                <v-card-title class="-d-flex justify-start pa-0 my-3 overflow-hidden">

                                                    <StreamBarcodeReader max-width="" @decode="onDecode"
                                                        @loaded="onLoaded" stop>
                                                    </StreamBarcodeReader>

                                                </v-card-title>
                                            </v-card>
                                        </v-col>
                                        <v-col xs="2">
                                            <!-- upload photo -->
                                            <v-card-text class="mt-10">
                                                <v-avatar rounded size="120" class="me-6">
                                                    <v-img :src="itemImage"></v-img>
                                                </v-avatar>

                                                <div>
                                                    <v-btn color="primary" class="me-3 mt-5"
                                                        @click="$refs.refInputEl.click();">
                                                        <v-icon class="d-sm-none">
                                                            {{ uploadBtnTextMobile }}
                                                        </v-icon>
                                                        <span class="d-none d-sm-block">{{ uploadBtnText }}</span>
                                                    </v-btn>

                                                    <input ref="refInputEl" @change="uploadItemImage" type="file"
                                                        accept=".jpeg,.png,.jpg,GIF" :hidden="true" />
                                                </div>
                                            </v-card-text>
                                        </v-col>
                                        <v-col class="mt-10" xs="2">
                                            <v-text-field value="0000110125" label="Barcode" outlined clearable>
                                            </v-text-field>
                                            <v-text-field value="NOBIVAC DHPPI L4 (CANINE)" label="Item Name" outlined
                                            clearable>
                                            </v-text-field>
                                            <v-text-field value="Vaccines" label="Inventory" outlined clearable>
                                            </v-text-field>
                                        </v-col>
                                        <v-container class="my-5">
                                            <v-card flat class="px-3">

                                                <v-row no-gutters class="d-flex justify-center">
                                                    <v-col cols="12" sm="3" class="ma-2">
                                                        <v-text-field label="Total Stocks (including on display)"
                                                            value="43" outlined dense clearable>
                                                        </v-text-field>
                                                        <v-btn color="primary" outlined class="mb-7">
                                                            SEE RECEIPTS</v-btn>
                                                        <v-text-field label="Stock on Display" value="45" outlined dense
                                                        >
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="3" class="ma-2">
                                                        <v-text-field label="Price" value="541.58" outlined dense
                                                        clearable>
                                                        </v-text-field>
                                                        <v-text-field label="Storebox" value="ABC-123" outlined dense
                                                        clearable>
                                                        </v-text-field>
                                                        <v-text-field label="Expiry Date" value="09/05/2023" outlined
                                                            dense clearable>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="3" class="ma-2">
                                                        <v-text-field label="Low Stock Quantity Indicator" value="5"
                                                            outlined dense clearable>
                                                        </v-text-field>
                                                        <v-text-field label="Brand" value="Nobivac" outlined dense
                                                        clearable>
                                                        </v-text-field>
                                                        <v-text-field label="Supplier" value="Medical Supplier Inc."
                                                            outlined dense clearable>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-container>
                                    </v-row>

                                </v-card>
                            </v-container>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="editDialog = false">EDIT</v-btn>
                                <v-btn color="secondary" @click="editDialog = false">CANCEL</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for deducting -->
                    <v-dialog v-model="deductDialog" max-width="800px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">
                                Deduct Quantity
                            </v-chip>
                            <!-- Scan Barcode Modal -->
                            <v-card class="pa-5 d-flex justify-center" height="340" width="750">
                                <v-card-title class="-d-flex justify-center pa-0 rounded-lg my-3 overflow-hidden">
                                    <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" stop>
                                    </StreamBarcodeReader>
                                </v-card-title>
                            </v-card>
                            <div class="barcode-table">
                                <v-data-table :headers="headers" :items="items" sort-by="name" class="elevation-1 pt-3"
                                    item-key="itemname" :loading="loadingTable">
                                </v-data-table>
                            </div>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" class="mt-5" @click="deductDialog = false">DONE</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for deleting -->
                    <v-dialog v-model="deleteDialog" max-width="1005px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">
                                Delete Item
                            </v-chip>
                            <v-container class="my-5">
                                <v-card flat class="">
                                    <v-row row wrp>
                                        <v-col cols="12" md="6">
                                            <!-- Scan Barcode Modal -->
                                            <v-card class="pa-5 d-flex flex-column justify-start" height="340"
                                                width="450">
                                                <v-card-title class="-d-flex justify-start pa-0 my-3 overflow-hidden">

                                                    <StreamBarcodeReader max-width="" @decode="onDecode"
                                                        @loaded="onLoaded" stop>
                                                    </StreamBarcodeReader>

                                                </v-card-title>
                                            </v-card>
                                        </v-col>
                                        <v-col xs="2">
                                            <p class="fled-x justify-center font-weight-black text-h7">Are you
                                                sure you
                                                want to DELETE 'NOBIVAC DHPPI L4' ITEM?</p>
                                            <!-- upload photo -->
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
                    </v-dialog>


                </v-col>
                <v-col cols="12" sm="5" md="2" class="pa-1">
                    <v-dialog v-model="generateDialog" persistent max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                            <v-card class=" bg-white d-flex justify-center align-center flex-column" height="200"
                                v-bind="attrs" v-on="on">
                                <v-icon x-large class="mb-2" color="primary">{{ generateIcon }}</v-icon>
                                <p>Generate Barcode</p>
                            </v-card>
                        </template>
                        <v-card class="d-flex justify-center flex-column pa-md-10">
                            <p class="text-center text-subtitle-1">Generate Barcode</p>
                            <v-card-actions class="mx-auto">
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="generateDialog = false">
                                    CANCEL
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
                <v-col cols="12" sm="4" md="2" class="pa-1 ">
                    <v-card class="d-flex justify-center mb-2" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="d-flex justify-center flex-column">
                                <v-icon class="" color="primary">{{ scanIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">Total Scans Today</p>
                                <p class="text-subtitle-1">14 scans</p>

                            </v-col>
                        </v-row>

                    </v-card>
                    <v-card class="d-flex justify-center" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="d-flex justify-center flex-column">
                                <v-icon class="" color="primary">{{ generateIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">Total Barcodes</p>
                                <p class="text-subtitle-1">45 barcodes</p>

                            </v-col>
                        </v-row>
                    </v-card>


                </v-col>
                <v-col cols="12" sm="6" md="6" class="pa-1">
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
                    <v-btn color="primary" elevation="2" class="mr-2" fab x-small outlined @click="editItem(item)">
                        <v-icon>{{ editIcon }}</v-icon>
                    </v-btn>
                    <v-btn color="error" elevation="2" class="mr-2" fab x-small @click="deleteItem(item)">
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
import { ref, onMounted } from '@vue/composition-api';
import { getStorage, uploadBytes, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
            (error) => {
            },
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

    }
}
</script>
<style>

</style>