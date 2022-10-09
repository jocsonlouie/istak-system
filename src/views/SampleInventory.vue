<template>
  <div class="sample-iv">
    <!-- Success Alert -->
    <v-snackbar v-model="snackbar" :timeout="timeout" top color="primary" outlined rounded="pill">
      <v-icon color="primary">{{ successIcon }}</v-icon>
      
      Item {{ itemStatus }} Successfully!
      <template v-slot:action="{ attrs2 }" >
        
        <v-spacer></v-spacer>
        <v-btn color="primary" text v-bind="attrs2"  @click="snackbar = false">
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Data Table -->
    <v-data-table :headers="headers" :items="items" sort-by="itemname" class="elevation-1 pt-3">

      <template v-slot:top>
        <v-toolbar flat>
          <!-- Table Top Functions -->


          <v-spacer></v-spacer>

          <!-- Add & Edit Item Modal -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
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
                    <v-text-field v-model="dataItem.itemname" :rules="itemNameRules" label="Item Name" clearable
                      required>
                    </v-text-field>

                    <v-text-field v-model="dataItem.barcode" label="Barcode" clearable>
                    </v-text-field>

                    <v-text-field v-model="dataItem.storebox" label="Storebox" clearable>
                    </v-text-field>

                    <v-text-field v-model.number="dataItem.total" label="Total Stocks" type="number" clearable>
                    </v-text-field>

                    <v-text-field v-model.number="dataItem.display" label="Display Stocks" type="number" clearable>
                    </v-text-field>

                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="primary" @click="save">
                  Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Delete Item Modal -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card class="pa-5 d-flex flex-column justify-center">
              <v-chip color="error lighten-1" class="d-flex justify-center font-weight-bold text-h6 pa-5">Delete Item
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

      <!-- Table Data Edit & Delete Buttons -->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          {{ editIcon }}
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          {{ deleteIcon }}
        </v-icon>
      </template>
      <!-- Reset Button if No Data -->
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>

</template>
<script>
  // icons
  import {
    mdiPencil,
    mdiDelete,
    mdiCheckboxMarkedCircleOutline
  } from '@mdi/js'

  // crud imports
  import inventoryColRef from '@/fb';
  import {
    addDoc,
    setDoc,
    doc,
    deleteDoc, onSnapshot
  } from '@firebase/firestore';



  export default {
    data: () => ({
      // icon data
      editIcon: mdiPencil,
      deleteIcon: mdiDelete,
      successIcon: mdiCheckboxMarkedCircleOutline,

      // modal data
      dialog: false,
      dialogDelete: false,

      // table header data
      headers: [{
          text: 'Item Name',
          align: 'start',
          value: 'itemname',
        },
        {
          text: 'Barcode',
          sortable: false,
          value: 'barcode'
        },
        {
          text: 'Storebox',
          sortable: false,
          value: 'storebox'
        },
        {
          text: 'Total Stocks',
          sortable: false,
          value: 'total'
        },
        {
          text: 'Display Stocks',
          sortable: false,
          value: 'display'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        },
      ],
      // table data
      items: [],
      itemIndex: -1,
      currentItem: {
        itemname: '',
        barcode: '',
        storebox: '',
        total: 0,
        display: 0,
      },
      defaultItem: {
        itemname: '',
        barcode: '',
        storebox: '',
        total: 0,
        display: 0,
      },

      // add item
      dataItem: {
        itemname: '',
        barcode: '',
        storebox: '',
        total: '',
        display: '',
      },

      //rules
      itemNameRules: [
        v => !!v || 'Item Name is required',
      ],

      //edit item
      itemId: null,
      docRef: null,

      //snackbar
      snackbar: false,
      timeout: 3000,
      itemStatus: '',

    }),

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
          items.push({ ...doc.data(), id: doc.id })
        });
        this.items = items;
      })
      },

      // edit function
      async editItem(item) {
        this.itemIndex = this.items.indexOf(item)
        if (this.itemIndex > -1) {
           this.dataItem = Object.assign({}, item);
           this.itemId = this.dataItem.id;
           this.docRef = doc(inventoryColRef, this.itemId);
        
        }   
        this.dialog = true
      },

      // delete function
      async deleteItem(item) {
        this.dataItem = Object.assign({}, item);
        this.itemId = this.dataItem.id;
        this.docRef = doc(inventoryColRef, this.itemId);
        this.dialogDelete = true;
      },

      async deleteItemConfirm() {
        this.items.splice(this.itemIndex, 1);
        await deleteDoc(this.docRef);
        this.closeDelete();
        this.itemStatus = 'Deleted';
        this.snackbar = true;
        this.resetForm();
      },

      // close function for edit and add
      close() {
        this.resetForm();
        this.dialog = false
        this.$nextTick(() => {
          this.currentItem = Object.assign({}, this.defaultItem)
          this.itemIndex = -1
        })
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

      // function for edit and add
      async save() {
        if (this.itemIndex > -1) {
          // edit function
          await setDoc(this.docRef, this.dataItem);
          this.close();
          this.itemStatus = 'Updated';
          this.snackbar = true;

        } else {
          // add function
          const addedDoc = await addDoc(inventoryColRef, this.$data.dataItem);
          this.close();
          this.itemStatus = 'Added';
          this.snackbar = true;


        }
      },

      validate() {
        this.$refs.form.validate();
      },
      resetForm() {
        this.$refs.form.reset();
      },
      resetValidation() {
        this.$refs.form.resetValidation();
      },

    },
  }
</script>
<style lang="">

</style>