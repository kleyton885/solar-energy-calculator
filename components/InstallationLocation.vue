<template>
  <client-only>
    <VRow no-gutters align="center" justify="center" class="mt-4">
      <VCol class="fill-height" md="8" lg="8">
        <div>
          <h3>1. Aponte o local onde pretende realizar a instalação</h3>
        </div>
        <div id="map-wrap" style="height: 60vh;">
          <l-map @click="setLocation" :zoom=13 :center="[-9.643112, -35.718860]">
            <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-marker :lat-lng=latlng>
              <l-popup>{{ address }}</l-popup>
            </l-marker>
          </l-map>
        </div>
      </VCol>
      <VCol class="fill-height" md="8" lg="8">
        {{ address }}
      </VCol>
    </VRow>
  </client-only>
</template>

<script setup>
const latlng = ref({lat: '', lng: ''});
const address = ref('');

async function setLocation(e) {
  latlng.value = e.latlng
  try {
    const post = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=` + latlng.value.lat
      + `&lon=` + e.latlng.lng
      + `&format=json`
      + `&addressdetails=1`
      + `&accept-language=pt-BR`
      + `&zoom=18`).then((r) => r.json())
    address.value = post.address.road ? post.address.road + ', ' + post.address.suburb + ', ' + post.address.city + ', ' + post.address.state + ', ' + post.address.postcode : ''
  } catch (e) {
    console.log(e)
  }

}
</script>