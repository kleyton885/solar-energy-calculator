<template>
    <VCol class="fill-height mt-9" cols="12" lg="6" md="6" sm="10">
      <div>
        <h3>1. Aponte o local onde pretende realizar a instalação</h3>
      </div>
      <div id="map-wrap" style="height: 300px">
        <client-only v-if="isContentLoaded">
        <l-map @click="setLocation" :zoom=13 :center="[-9.643112, -35.718860]">
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          <l-marker :lat-lng=latlng></l-marker>
        </l-map>
        </client-only>
        <v-skeleton-loader type="image, image" v-else />
      </div>
      <div>{{ address }}</div>
    </VCol>
</template>

<script setup>
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const latlng = useLatlng();
const capacity = useCapacity();
const show_info = useShowInfo();
const monthly_spend = useMonthlySpend();
const simulator_loading = useSimulatorLoading();
const monthySpendTextFieldDisabled = useMonthySpendTextFieldDisabled();
const address = ref('');
const isContentLoaded = ref(false);

onMounted(() => {
  isContentLoaded.value = true;
});

async function setLocation(e) {
  latlng.value = e.latlng
  monthly_spend.value = '';
  simulator_loading.value = false;
  show_info.value = false;
  monthySpendTextFieldDisabled.value = false;

  try {
    const post = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=` + latlng.value.lat
      + `&lon=` + e.latlng.lng
      + `&format=json`
      + `&addressdetails=1`
      + `&accept-language=pt-BR`
      + `&zoom=18`).then((r) => r.json())

    address.value = ''
    capacity.value = ''

    address.value += post.address.road ? post.address.road : ''
    address.value += post.address.suburb ? ', ' + post.address.suburb : ''
    address.value += post.address.village ? ', ' + post.address.village : ''
    address.value += post.address.town ? ', ' + post.address.town : ''
    address.value += post.address.city ? ', ' + post.address.city : ''
    address.value += post.address.state ? ', ' + post.address.state : ''
    address.value += post.address.postcode ? ', ' + post.address.postcode : ''

    if (address.value.startsWith(', ')) {
      address.value = address.value.replace(/^, /, '');
    }
  } catch (e) {
    console.log(e)
  }

}
</script>