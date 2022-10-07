<template>
    <v-form ref="form" @submit.prevent="addItem" v-model="valid" lazy-validation class="mx-9">
        <div class="top-btns d-flex justify-center mb-5 mt-1">
            <v-btn :disabled="!valid" small color="secondary" class="mr-4" @click="validate">
                Validate
                <!-- <v-icon>{{ validateIcon }}</v-icon> -->
            </v-btn>

            <v-btn color="error" small class="mr-4" @click="reset">
                <!-- {{ resetFormIcon }} -->
                Reset Form
            </v-btn>

            <v-btn color="warning" small class="mr-4" @click="resetValidation">
                Reset Validation
                <!-- {{ resetValIcon }} -->
            </v-btn>
        </div>


        <v-text-field v-model="formz.item" :rules="itemNameRules" label="Item Name" required></v-text-field>
        <v-text-field v-model="formz.storebox" type="text" :rules="storeBoxRules" label="Storebox" required>
        </v-text-field>
        <v-text-field v-model="formz.tstocks" type="text" :rules="tStocksRules" label="Total Stocks" required>
        </v-text-field>
        <v-text-field v-model="formz.dstocks" type="text" :rules="dStocksRules" label="Display Stocks" required>
        </v-text-field>
        <v-text-field v-model="formz.inventory" type="text" :rules="inventoryRules" label="Inventory Name" required>
        </v-text-field>

        <div class="buttonz text-center">


            <v-btn color="success" x-large class="ma-4" type="submit">
                Add Item
            </v-btn>
        </div>


    </v-form>
</template>
<script>
    import {
        mdiMarkerCheck,
        mdiBackupRestore,
        mdiUndo

    } from '@mdi/js'
    import vaccinesColRef from '@/fb';
    import {
        addDoc
    } from '@firebase/firestore';

    export default {
        data() {
            return {
                // form
                valid: true,
                formz: {
                    item: 'a',
                    storebox: 'a',
                    tstocks: 'a',
                    inventory: 'a',
                    dstocks: 'a',
                },
                itemNameRules: [
                    v => !!v || 'Item Name is required',
                    v => (v && v.length <= 10) || 'Item Name must be less than 10 characters',
                ],

                storeBoxRules: [
                    v => (v && v.length <= 10) || 'Item Name must be less than 10 characters',
                ],

                tStocksRules: [
                    b => !!b || 'Total Stocks is required',
                ],

                dStocksRules: [
                    v => !!v || 'Display Stocks is required',
                ],

                inventoryRules: [
                    v => !!v || 'Inventory Name is required',
                ],


                resetFormIcon: mdiBackupRestore,


            }
        },
        methods: {
            validate() {
                this.$refs.form.validate();
            },
            reset() {
                this.$refs.form.reset();
            },
            resetValidation() {
                this.$refs.form.resetValidation();
            },

            async addItem() {
                let dataDoc = {
                    item: this.formz.item,
                    storebox: this.formz.storebox,
                    tstocks: this.formz.tstocks,
                    dstocks: this.formz.dstocks,
                    inventory: this.formz.inventory,
                }
                const addedDoc = await addDoc(vaccinesColRef, this.$data.formz);
                alert("Document created successfully");
                await this.reset();

            }
        },

    }
</script>
<style lang="">

</style>