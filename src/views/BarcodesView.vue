<template>
    <div class="d-flex justify-center flex-column w-screen">
        <div class="upper-btns mb-5 d-flex">
            <v-row no-gutters class="d-flex justify-center align-center">
                <v-col cols="12" sm="5" md="2" class="ma-1">
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
                            <v-btn color="normal" large class="mb-2" @click="viewDialog = !viewDialog">
                                View Item Info
                            </v-btn>
                            <v-btn color="normal" large class="mb-2" @click="editDialog = !editDialog">
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
                    <v-dialog v-model="viewDialog" max-width="800px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">View
                                Item Information
                            </v-chip>
                            <v-card-actions>
                                <v-btn color="primary" text @click="viewDialog = false">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for editing -->
                    <v-dialog v-model="editDialog" max-width="800px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">Edit
                                Item Information
                            </v-chip>
                            <v-card-actions>
                                <v-btn color="primary" text @click="editDialog = false">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for deducting -->
                    <v-dialog v-model="deductDialog" max-width="800px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">
                                Deduct Quantity
                            </v-chip>
                            <v-card-actions>
                                <v-btn color="primary" text @click="deductDialog = false">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialog for deleting -->
                    <v-dialog v-model="deleteDialog" max-width="800px">
                        <v-card class="pa-5 d-flex flex-column justify-center">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">
                                Delete Item
                            </v-chip>
                            <v-card-actions>
                                <v-btn color="primary" text @click="deleteDialog = false">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                </v-col>
                <v-col cols="12" sm="5" md="2" class="ma-1">
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
                <v-col cols="12" sm="4" md="2" class="ma-1 ">
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
                <v-col cols="12" sm="6" md="5" class="ma-1">
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
    } from '@mdi/js'

    export default {
        data: () => ({
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


            //table functions
            search: '',
            singleSelect: false,
            selected: [],
            loadingTable: false,
            
        }),

    }
</script>
<style>
 
</style>