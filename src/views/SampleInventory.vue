<template>
  <div class="sample-iv" >
    <v-alert
      dense v-model="successAlert"
      text
      type="success" dismissible
    >
      Item {{ itemStatus }} Successfully!
      
    </v-alert>
    <v-data-table :headers="headers" :items="items" sort-by="itemname" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>


                <v-form ref="form">

                  <v-text-field v-model="dataAdd.itemname" :rules="itemNameRules" label="Item Name" clearable required>
                  </v-text-field>


                  <v-text-field v-model="dataAdd.barcode"  label="Barcode" clearable>
                  </v-text-field>


                  <v-text-field v-model="dataAdd.storebox"  label="Storebox" clearable>
                  </v-text-field>


                  <v-text-field v-model.number="dataAdd.total"  label="Total Stocks" type="number"
                    clearable></v-text-field>



                  <v-text-field v-model.number="dataAdd.display"  label="Display Stocks"
                    type="number" clearable></v-text-field>

                </v-form>



              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="addItem">
                Add Item
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        <!-- mdi-pencil -->
        {{ editic }}
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        <!-- mdi-delete -->
        {{ deleteic }}
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
  </div>
  
</template>
<script>
  import {
    mdiPencil,
    mdiDelete
  } from '@mdi/js'

  import vaccinesColRef from '@/fb';
  import {
    addDoc, getDocs
  } from '@firebase/firestore';


  export default {
    data: () => ({
      editic: mdiPencil,
      deleteic: mdiDelete,
      dialog: false,
      dialogDelete: false,
      headers: [{
          text: 'Item Name',
          align: 'start',
          sortable: false,
          value: 'itemname',
        },
        {
          text: 'Barcode',
          value: 'barcode'
        },
        {
          text: 'Storebox',
          value: 'storebox'
        },
        {
          text: 'Total Stocks',
          value: 'total'
        },
        {
          text: 'Display Stocks',
          value: 'display'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        },
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
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
      dataAdd: {
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

      //alert
      successAlert: false,
      itemStatus: '',

      //edit item
      

    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
      this.initialize()
      //this.fetchItems();
    },

    methods: {
      async fetchItems(){
        let itemsSnapshot = await getDocs(vaccinesColRef);
        let items = [];
        itemsSnapshot.forEach((item) => {
          let itemData = item.data();
          itemData.id = item.id;
          items.push(itemData);
        });
        console.log(items);
        this.items = items;
      },
      async initialize() {
        let itemsSnapshot = await getDocs(vaccinesColRef);
        let items = [];
        itemsSnapshot.forEach((item) => {
          let itemData = item.data();
          itemData.id = item.id;
          items.push(itemData);
        });
        console.log(items);
        this.items = items;

        // this.items = [{
        //     itemname: 'Anti-Rabbies',
        //     barcode: 'ABC123456789',
        //     storebox: 'A-125',
        //     total: 150,
        //     display: 30,
        //   },
        // ]
      },

      editItem(item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm() {
        this.items.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      // save() {
      //   if (this.editedIndex > -1) {
      //     Object.assign(this.items[this.editedIndex], this.editedItem)
      //   } else {
      //     this.items.push(this.editedItem)
      //   }
      //   this.close()
      // },

      validate() {
        this.$refs.form.validate();
      },
      resetForm() {
        this.$refs.form.reset();
      },
      resetValidation() {
        this.$refs.form.resetValidation();
      },

      async addItem() {
        const addedDoc = await addDoc(vaccinesColRef, this.$data.dataAdd);
        await this.close();
        this.itemStatus = 'Added';
        this.successAlert = true;
        await this.resetForm(); 
        

      }
    },
  }
</script>
<style lang="">

</style>