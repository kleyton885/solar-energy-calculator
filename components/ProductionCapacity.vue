<template>
  <VRow v-if="getSolarInfo()" no-gutters align="center" justify="center" class="mt-4">
    <VCol v-if="capacity" class="fill-height" cols="12" md="8" lg="8">
      <v-card width="230">
        <v-img
          height="75"
          src="img/energia-solar.png"
          class="text-white"
        >
        </v-img>

        <v-card-text>
          <div class="font-weight-bold ms-1 mb-2 d-flex flex-column align-items-center">
            <div class="text-center">Produção Mensal Estimada*</div>
            <div class="text-center text-h6 font-weight-black text-green-darken-1">{{ capacity }} kWh/ mês</div>
          </div>
        </v-card-text>
      </v-card>
      <div class="mt-2">* Considerando um kit de 3.33 kWp (6 módulos de 555W)</div>
    </VCol>
    <VCol cols="12" md="8" lg="8" v-else>
      <v-skeleton-loader v-if="latlng.lat != ''" width="230" height="75" type="image" />
    </VCol>
  </VRow>
</template>

<script setup>
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const capacity = useCapacity();
const latlng = useLatlng();

async function getSolarInfo(e) {
  try {
    if (latlng.value.lat != '') {
      const post = await $fetch('https://api.globalsolaratlas.info/data/pvcalc?loc='+latlng.value.lat+','+latlng.value.lng, {
        method: 'POST',
        body: '{"type":"rooftopSmall","systemSize":{"type":"capacity","value":3.33},"orientation":{"azimuth":0,"tilt":9}}'
      });
      capacity.value = post.annual.data.PVOUT_total

      if (capacity.value % 1 >= 0.5) {
        capacity.value = Math.ceil(capacity.value/12);
      } else {
        capacity.value = Math.floor(capacity.value/12);
      }


      latlng.value = { lat: '', lng: '' }
    }
  } catch (e) {
    console.log(e)
  }
}
</script>