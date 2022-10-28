<template>
    <div>
        <div class="upper-btns mb-5 d-flex">
            <v-row no-gutters class="d-flex justify-center align-center">
                <v-col cols="12" sm="5" md="3" class="pa-1">
                    <v-dialog v-model="addDialog" persistent max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                            <v-card class=" bg-white d-flex justify-center align-center flex-column" height="200"
                                v-bind="attrs" v-on="on">
                                <v-icon x-large class="mb-2" color="primary">{{ addIcon }}</v-icon>
                                <p>New Inventory</p>
                            </v-card>
                        </template>
                        <!-- Add inventory -->
                        <v-card class="d-flex justify-center flex-column pa-md-10">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5 mb-4">New
                                Inventory
                            </v-chip>
                            <v-text-field label="Inventory Name" :rules="fieldRules" clearable filled></v-text-field>

                            <v-card-actions class="mx-auto">
                                <v-spacer></v-spacer>
                                <v-btn color="secondary" @click="addDialog = false">
                                    Cancel
                                </v-btn>
                                <v-btn color="primary">
                                    Save</v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- Update Inventory -->
                    <v-dialog v-model="updateDialog" persistent max-width="500">
                        <v-card class="d-flex justify-center flex-column pa-md-10">
                            <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5 mb-4">
                                Update
                                Inventory
                            </v-chip>
                            <v-text-field :rules="fieldRules" clearable filled hint="Enter New Inventory Name">
                            </v-text-field>

                            <v-card-actions class="mx-auto">
                                <v-spacer></v-spacer>
                                <v-btn color="secondary" @click="updateDialog = false">
                                    Cancel
                                </v-btn>
                                <v-btn color="primary" @click="updateDialog = false">
                                    Update</v-btn>

                            </v-card-actions>
                        </v-card>

                    </v-dialog>

                    <!-- Delete Inventory-->
                    <v-dialog v-model="deleteDialog" persistent max-width="500">
                        <v-card class="d-flex justify-center flex-column pa-md-10">
                            <p class="text-h10">Are you sure you want to DELETE 'Vaccines' Inventory</p>
                            <v-card-actions class="mx-auto">
                                <v-spacer></v-spacer>
                                <v-btn color="secondary" @click="deleteDialog = false">
                                    Cancel
                                </v-btn>
                                <v-btn color="primary" @click="deleteDialog = false">
                                    Delete</v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-dialog>






                </v-col>
                <v-col cols="12" sm="6" md="3" class="pa-1">
                    <v-card class=" bg-white d-flex flex-column pa-4 justify-center align-center" height="200">
                        <p class="">All</p>

                    </v-card>
                </v-col>
                <v-col cols="12" sm="4" md="3" class="pa-1 ">
                    <v-card class="d-flex justify-center mb-2" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="d-flex justify-center flex-column">
                                <v-icon class="" color="primary">{{ tInventoryIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">Total Inventories</p>
                                <p class="text-subtitle-1">8 inventories</p>

                            </v-col>
                        </v-row>

                    </v-card>
                    <v-card class="d-flex justify-center" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="d-flex justify-center flex-column">
                                <v-icon class="" color="primary">{{ tStocksIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">Total Stocks</p>
                                <p class="text-subtitle-1">1441 stocks</p>

                            </v-col>
                        </v-row>
                    </v-card>


                </v-col>
                <v-col cols="12" sm="4" md="3" class="pa-1 ">
                    <v-card class="d-flex justify-center mb-2" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="d-flex justify-center flex-column">
                                <v-icon class="" color="primary">{{ tItemIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">Total Items</p>
                                <p class="text-subtitle-1">147 items</p>

                            </v-col>
                        </v-row>

                    </v-card>
                    <v-card class="d-flex justify-center" height="95">
                        <v-row no-gutters class="pa-2 text-center text-sm-start">
                            <v-col cols="12" xs="1" sm="3" md="3" class="d-flex justify-center flex-column">
                                <v-icon class="" color="primary">{{ nItemIcon }}</v-icon>
                            </v-col>
                            <v-col cols="12" xs="4" sm="9" md="9" class="align-self-center">
                                <p class="text-caption mb-n1 mt-4">New Items</p>
                                <p class="text-subtitle-1">7 items</p>

                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <div class="inventories">
            <v-row no-gutters class="d-flex justify-start align-center">
                <v-col cols="13" xs="16" sm="6" md="3" class="pa-1" v-for="inventory in inventories"
                    :key="inventory.name">

                    <!-- <v-card>
                        <div class="d-flex flex-no-wrap justify-space-between">
                            <div>
                                <v-card-title class="text-h6">{{ inventory.name }}</v-card-title>

                                <v-card-subtitle>{{ inventory.totalitems }} items, {{ inventory.totalstocks }}
                                    stocks</v-card-subtitle>

                                <v-card-actions>

                                    <v-btn outlined rounded small>
                                        View inventory
                                    </v-btn>
                                </v-card-actions>
                            </div>

                            <v-avatar class="ma-3" size="125" tile>
                                <v-img src="@/assets/images/pages/card-basic-influencer.png"></v-img>
                            </v-avatar>
                        </div>
                    </v-card> -->
                    <v-card>
                        <v-img src="@/assets/images/pages/card-basic-influencer.png" height="150" />
                        <v-card-title>
                            {{ inventory.name }}
                        </v-card-title>
                        <v-card-subtitle>{{ inventory.totalitems }} items, {{ inventory.totalstocks }}
                            stocks</v-card-subtitle>
                        <v-card-text>

                            <div class="d-flex justify-start flex-wrap">
                                <v-btn color="error" fab outlined x-small class="me-2 mb-2"
                                    @click="deleteDialog = !deleteDialog">
                                    <v-icon>{{ deleteIcon }}</v-icon>
                                </v-btn>
                                <v-btn color="primary" fab outlined x-small @click="updateDialog = !updateDialog">
                                    <v-icon>{{ editIcon }}</v-icon>
                                </v-btn>
                            </div>

                        </v-card-text>
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
} from '@mdi/js'

export default {
    data: () => ({
        addDialog: false,
        updateDialog: false,
        deleteDialog: false,

        valid: true,
        fieldRules: [
            v => !!v || 'This field is required',
        ],

        //icons
        tInventoryIcon: mdiDatabase,
        tStocksIcon: mdiPackage,
        tItemIcon: mdiPackageVariant,
        nItemIcon: mdiPackageVariantClosed,
        addIcon: mdiPlus,
        deleteIcon: mdiDelete,
        editIcon: mdiPencil,

        //modal


        //inventories
        inventories: [{
            name: 'Vaccines',
            totalitems: 100,
            totalstocsk: 60,
        },
        {
            name: 'Laboratory Tests',
            totalitems: 345,
            totalstocks: 514,
        },
        {
            name: 'Oral Antibiotics',
            totalitems: 65,
            totalstocks: 235,
        },
        {
            name: 'Topical',
            totalitems: 14,
            totalstocks: 200,
        },
        {
            name: 'Steriods',
            totalitems: 25,
            totalstocks: 300,
        },
        {
            name: 'Eye and Ear',
            totalitems: 45,
            totalstocks: 145,
        },
        {
            name: 'Anti-parasite',
            totalitems: 8,
            totalstocks: 154,
        },
        {
            name: 'Supplements',
            totalitems: 84,
            totalstocks: 1254,
        },

        ],
    }),

    methods: {
        gotoInventory() {
            this.$router.push('/inventory-list');
        }
    }
}
</script>
<style lang="">

</style>