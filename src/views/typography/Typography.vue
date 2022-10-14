<template>
  <v-row>
    <v-col cols="12" class="mb-6">
      <typography-headlines></typography-headlines>
      <h1>
        hallos
      </h1>
      <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>

    </v-col>
    <v-col cols="12">
      <typography-texts></typography-texts>
    </v-col>
  </v-row>
</template>

<script>
import TypographyHeadlines from './TypographyHeadlines.vue'
import TypographyTexts from './TypographyTexts.vue'
import { StreamBarcodeReader } from "vue-barcode-reader";


export default {
  components: {
    TypographyHeadlines,
    TypographyTexts,
    StreamBarcodeReader
  },
  methods: {
    onDecode(result) { console.log(result) },
    onLoaded(result) { console.log(result) }
  }

}
</script>
