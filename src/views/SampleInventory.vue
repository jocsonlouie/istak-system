<template>
  <div class="inventory">

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            Open Dialog
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Add Item</span>
          </v-card-title>
          <v-card-text>
            <InventoryItemForm />
          </v-card-text>

        </v-card>
      </v-dialog>
    </v-row>

    <v-data-table v-model="selected" :headers="headers" :items="desserts" :single-select="singleSelect" item-key="name"
      show-select class="elevation-1">
      <template v-slot:top>
        <v-switch v-model="singleSelect" label="Single select" class="pa-3"></v-switch>
      </template>
    </v-data-table>
  </div>
</template>
<script>
  import InventoryItemForm from '@/layouts/components/InventoryItemForm.vue'

  export default {
    name: "InventoryList",
    data() {
      return {
        // datatable
        singleSelect: false,
        selected: [],
        headers: [{
          text: "Item Name",
          align: "start",
          sortable: true,
          value: "itemname",
        }, {
          text: "Storebox",
          value: "storebox"
        }, {
          text: "Total Stocks",
          value: "totalstocks"
        }, {
          text: "Display Stocks",
          value: "displaystocks"
        }, {
          text: "inventory Name",
          value: "inventoryname"
        }],
        desserts: [{
          itemname: "Frozen Yogurt",
          storebox: 159,
          totalstocks: 6,
          displaystocks: 24,
          inventoryname: 4,
        }, ],

        addDialog: false,
      };
    },
    components: {
      InventoryItemForm
    }
  }
</script>
<style lang="">

</style>