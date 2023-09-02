<template>
  <v-card v-if="!simulator_loading" width="250" class="flex-grow-1 pt-4">
    <v-img height="75" src="img/area-min.png" class="text-white"></v-img>
    <v-card-text>
      <div class="font-weight-bold ms-1 mb-2 d-flex flex-column align-items-center">
        <div id="card-key" class="text-center">Área Mínima Necessária</div>
        <div id="card-value" class="text-center mt-2 font-weight-black text-green-darken-1">{{ areaMin }} M²</div>
      </div>
    </v-card-text>
  </v-card>
  <!-- <div class="mt-2">* Com um kit de {{ kWp }} kWp ou {{ qt_modulos }} módulos de 555W.</div>
    <div class="mt-2">Você tem um consumo médio de {{ kWh }} Watts por mês.</div>
    <div class="mt-2">Área mínima necessária do telhado: {{ areaMin }} M².</div> -->
  <v-skeleton-loader class="flex-grow-1 pt-4" v-else width="250" height="75" type="image" />
</template>

<script setup>
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const areaMin = useAreaMin();
const simulator_loading = useSimulatorLoading();
</script>