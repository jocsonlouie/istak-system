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
    <v-data-table :headers="headers" :items="items" 
      sort-by="name" class="elevation-1 pt-3" :search="search" v-model="selected" :single-select="singleSelect"
      item-key="itemname" show-select :loading="loadingTable">

      <template v-slot:top>
        <v-toolbar flat>
          <!-- Table Top Functions -->
          <v-switch v-model="singleSelect" class="mb-n6 mr-4"></v-switch>
          <v-icon class="mr-2">{{ searchIcon }}</v-icon>
          <v-text-field v-model="search" label="Search Supplier..." single-line hide-details>

          </v-text-field>
          <v-spacer></v-spacer>

       

          <!-- Add & Edit Item Modal -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" outlined class="" v-bind="attrs" v-on="on">
                New Supplier
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
                    <v-text-field v-model="dataItem.name" :rules="itemNameRules" label="Name" clearable
                      required>
                    </v-text-field>

                    <v-text-field v-model="dataItem.email" :rules="itemNameRules" label="Email"
                      clearable>
                    </v-text-field>

                    <v-text-field v-model="dataItem.contactno" :rules="itemNameRules" label="Contact Number" clearable>
                    </v-text-field>

                    <v-text-field v-model.number="dataItem.contactper" :rules="itemNameRules" label="Contact Person"
                     clearable>
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
          <!-- Round buttons -->
          <v-btn color="primary" elevation="2" class="ml-2" fab small outlined>
            <v-icon>{{ pdfIcon }}</v-icon>
          </v-btn>
          <v-btn color="primary" elevation="2" class="ml-2" fab small outlined>
            <v-icon>{{ editIcon }}</v-icon>
          </v-btn>
          <v-btn color="error" elevation="2" class="ml-2" fab small>
            <v-icon>{{ deleteIcon }}</v-icon>
          </v-btn>
          <!-- <v-switch
          v-model="singleExpand"
          class="mt-2" x-small
        ></v-switch> -->

          <!-- Delete Item Modal -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card class="pa-5 d-flex flex-column justify-center">
              <v-chip color="error" class="d-flex justify-center font-weight-bold text-h6 pa-5">Delete Supplier
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

          <!-- Supplier Send Email -->
          <v-dialog v-model="dialogSendEmail" max-width="580px">
            <v-card class="pa-5 d-flex flex-column justify-center">
                <v-container>
                  <v-form ref="form">
              <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5">Send Email
              </v-chip>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <p class="font-weight-bold">TO:</p>
                    <v-text-field label="Supplier inc." required hint="Only Supplier on the List" outlined>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <p class="font-weight-bold">FROM:</p>
                    <v-text-field class="" label="Assumpta Dog & Cat Clinic" outlined></v-text-field>
                  </v-col>
                  <v-col cols="10" sm="6" md="4">
                    <p class="font-weight-bold">SUBJECT:</p>
                    <v-text-field label="Issue or Problem" outlined></v-text-field>
                  </v-col>
                </v-row>
                <v-col cols="12">
                  <p class="font-weight-bold">Message:</p>
                  <v-textarea color="primary">
                  </v-textarea>
                </v-col>

                <v-card-actions class="mb-n5">
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" @click="closeEmail">Cancel</v-btn>
                  <v-btn color="primary" >YES</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
                </v-form>
              </v-container>
            </v-card>
          </v-dialog>
      </template>

      <template v-slot:item.total="{ item }" class="text-center">
        <v-chip :color="getColor(item.total)" dark>
          {{ item.total }}
        </v-chip>
      </template>


      <!-- Table Actions Buttons -->
      <template v-slot:item.actions="{ item }">
        <div class="d-flex flex-row align-center">
          <v-btn color="primary" elevation="2" class="mr-2" fab x-small outlined @click="editItem(item)">
            <v-icon>{{ editIcon }}</v-icon>
          </v-btn>
          <v-btn color="error" elevation="2" class="mr-2" fab x-small @click="deleteItem(item)">
            <v-icon>{{ deleteIcon }}</v-icon>
          </v-btn>
          <v-btn color="primary"  outlined class="" @click="emailItem(item)">
          SEND EMAIL
          </v-btn>
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
  mdiDotsVertical
} from '@mdi/js'

// crud imports
import db from '@/fb';
import { collection } from "firebase/firestore";
import {
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc
} from '@firebase/firestore';


const inventoryColRef = collection(db, "supplier");

export default {
  data: () => ({

    loadingTable: true,
    // icon data
    editIcon: mdiPencil,
    deleteIcon: mdiDelete,
    successIcon: mdiCheckboxMarkedCircleOutline,
    searchIcon: mdiMagnify,
    pdfIcon: mdiFilePdfBox,
    moreIcon: mdiDotsVertical,

    // modal data
    dialog: false,
    dialogDelete: false,
    dialogSendEmail: false,

    //search and select data
    search: '',
    singleSelect: false,
    selected: [],
    expanded: [],
    singleExpand: false,


    // table header data
    headers: [{
      text: 'Name',
      align: 'start',
      value: 'name',
    },
    {
      text: 'Email',
      sortable: false,
      value: 'email'
    },
    {
      text: 'Contact Number',
      sortable: false,
      value: 'contactno'
    },
    {
      text: 'Contact Person',
      sortable: false,
      value: 'contactper'
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
      name: '',
      email: '',
      contactno: '',
      contactper: 0,
     
    },
    defaultItem: {
      name: '',
      email: '',
      contactno: '',
      contactper: 0,
    },

    // add item
    dataItem: {
      name: '',
      email: '',
      contactno: '',
      contactper: 0,
    },

    //rules
    valid: true,
    itemNameRules: [
      v => !!v || 'This field is required',
    ],

    //edit item
    itemId: null,
    docRef: null,

    //email item
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
      return this.itemIndex === -1 ? 'New Supplier' : 'Edit Supplier'
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


      }
      this.dialog = true
    },

     // email function
     async emailItem(item) {
      this.itemIndex = this.items.indexOf(item)
      if (this.itemIndex > -1) {
        this.dataItem = Object.assign({}, item);
        this.itemId = this.dataItem.id;
        this.docRef = doc(inventoryColRef, this.itemId);


      }
      this.dialogSendEmail = true
    },

    // delete function
    async deleteItem(item) {
      this.dataItem = Object.assign({}, item);
      this.itemId = this.dataItem.id;
      this.docRef = doc(inventoryColRef, this.itemId);
      this.dialogDelete = true;
    },

    async sendEmail(item) {
      this.dataItem = Object.assign({}, item);
      this.itemId = this.dataItem.id;
      this.docRef = doc(inventoryColRef, this.itemId);
      this.dialogSendEmail = true;
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

    // close function for send Email
    closeEmail() {
      this.dialogSendEmail = false;
      this.resetForm();
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
        if (this.$refs.form.validate()) {
          await updateDoc(this.docRef, {
            name: this.dataItem.name,
            email: this.dataItem.email,
            contactno: this.dataItem.contactno,
            contactper: this.dataItem.contactper,
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
          await addDoc(inventoryColRef, {
            name: this.dataItem.name,
            email: this.dataItem.email,
            contactno: this.dataItem.contactno,
            contactper: this.dataItem.contactper,
          })
          this.close();
          this.itemStatus = 'Added';
          this.snackbar = true;

        }

      }
    },

    

    validate() {
      this.$refs.form.validate();
    },
    resetForm() {
      this.$refs.form.reset();
    },
    getColor(total) {
      if (total > 400) return 'primary'
      else if (total > 200) return 'warning'
      else if (total == null) return ''
      else return 'error'
    },
  },
}
</script>
<style scoped>
tr {
  text-align: center;


}
</style>