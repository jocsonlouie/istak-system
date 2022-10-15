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
                  <form ref="form" id="myTable">
                    <v-text-field v-model="dataItem.name" :rules="itemNameRules" label="Name" clearable required>
                    </v-text-field>

                    <v-text-field v-model="dataItem.email" :rules="itemNameRules" label="Email" clearable>
                    </v-text-field>

                    <v-text-field v-model="dataItem.contactno" :rules="itemNameRules" label="Contact Number" clearable>
                    </v-text-field>

                    <v-text-field v-model.number="dataItem.contactper" :rules="itemNameRules" label="Contact Person"
                      clearable>
                    </v-text-field>


                  </form>
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
          <v-btn color="primary" elevation="2" class="ml-2" @click="generatePDF" fab small outlined>
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
              <form ref="form" class="d-flex justify-content flex-column">
                <v-chip color="primary" class="d-flex justify-center font-weight-bold text-h6 pa-5 mb-5">Send Email
                </v-chip>
                <div class="d-flex flex-row gap">
                  <v-text-field label="To" required outlined v-model="sendData.toEmail" name="toEmail" readonly>
                  </v-text-field>
                  <v-text-field class="" label="From" outlined v-model="sendData.fromEmail" name="fromEmail" readonly>
                  </v-text-field>
                </div>
                <v-text-field label="Subject" outlined v-model="sendData.subject" :rules="itemNameRules" name="subject"
                  clearable required></v-text-field>
                <v-textarea color="primary" label="Message" filled outlined v-model="sendData.message"
                  :rules="itemNameRules" name="message" clearable required>
                </v-textarea>


                <v-card-actions class="mb-n5">
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" @click="closeEmail">Cancel</v-btn>
                  <v-btn color="primary" @click="sendEmailzz">Send</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </form>
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
          <v-btn color="primary" outlined class="" @click="emailItem(item)">
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
  import {
    collection
  } from "firebase/firestore";
  import {
    addDoc,
    setDoc,
    doc,
    deleteDoc,
    onSnapshot,
    updateDoc
  } from '@firebase/firestore';


  const inventoryColRef = collection(db, "supplier");

  //email
  import emailjs from '@emailjs/browser';

  //pdf
  import {
    jsPDF
  } from "jspdf";
  import autoTable from 'jspdf-autotable';
  window.jsPDF = require('jspdf');


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

      //email
      sendData: {
        toEmail: '',
        fromEmail: '',
        subject: '',
        message: '',
      },

      //pdf contents
      business: 'Assumpta Dog and Cat Clinic - Cainta Branch',
      address: 'Ortigas Ave., Extension Corner Hunter ROTC. Guerilla St. Brgy. San Juan, Cainta Rizal',
      contact: '09190090841 / 09269910470 / 897-3264 / assumptacainta.yahoo.com',
      report: 'Supplier List Report'
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
      emailItem(item) {
        this.dialogSendEmail = true;
        this.sendData.fromEmail = 'assumptadogandcatclinic@gmail.com';
        this.dataItem = Object.assign({}, item);
        this.sendData.toEmail = this.dataItem.email;
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

      sendEmailzz() {
        if (this.$refs.form.validate()) {
          emailjs.sendForm('service_cky0y6t', 'template_2zs8qew', this.$refs.form, '9aetr9pH3Vj0_P8yK')
            .then((result) => {
              console.log('SUCCESS!', result.text);

            }, (error) => {
              console.log('FAILED...', error.text);
            });
          this.closeEmail();
          this.itemStatus = 'SUCCESSFULY SENT EMAIL TO THE SUPPLIER';
          this.snackbar = true;
        }
      },

      generatePDF() {
        const columns = [{
            title: "Supplier Name",
            dataKey: "name"
          },
          {
            title: "Email",
            dataKey: "email"
          },
          {
            title: "Contact Number",
            dataKey: "contactno"
          },
          {
            title: "Contact Person",
            dataKey: "contactper"
          },
        ];

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: "a4"
        });

        // let footerPath = path.resolve("../../assets/images/logos/google.png")
        // let footer = fs.readFileSync(footerPath,{
        //   encoding: "base64",
        // });

        // let footer = new Image();
        // footer.src = '';
        // footer.onload = function() {
        //   doc.addImage(footer, "PNG", 110, 770, 384, 100);
        //   doc.save('myPDF.pdf');
        // }

        // const img = new Image();
        // img.src = 'image-url';
        // img.onload = () => {
        //   // await for the image to be fully loaded
        //   doc.addImage(img, 'png', );
        //   doc.text("Sample", 20, 15);
        //   //...
        //   doc.save('order.pdf');
        // };



         //pdf.setFontSize(12).text(this.business, 105, 80, null, null, 'center');
        pdf.setFontSize(12).text(this.business, 2.5, 1.37);
        pdf.setFontSize(10).text(this.address, 1.40, 1.55);
        pdf.setFontSize(10).text(this.contact, 1.95, 1.75);
        pdf.setFontSize(16).text(this.report, 3.1, 2.15);
        //doc.setFontSize(16).text("Supplier List", 0.5, 1.0);
        pdf.setLineWidth(0.02).line(0.56, 2.35, 7.7, 2.35);



        autoTable(pdf, {
          columns,
          body: this.items,
          startY: 2.5,
          styles: {
            fontSize: 12,
            cellWidth: 'wrap'
          },
          columnStyles:{
            1: {
              cellWidth: 'auto'
            }
          }
        });

      
        pdf.save('SupplierList.pdf')
      }
    },
  }
</script>
<style scoped>

</style>