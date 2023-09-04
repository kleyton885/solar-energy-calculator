<template>
  <v-card v-if="!simulator_loading" width="250" class="flex-grow-1 pt-4">
    <v-img height="75" src="img/producao.png" class="text-white"></v-img>
    <v-card-text>
      <div class="font-weight-bold ms-1 mb-2 d-flex flex-column align-items-center">
        <div id="card-key" class="text-center">Produção Mensal</div>
        <div id="card-value" class="text-center mt-2 font-weight-black text-green-darken-1">{{ capacity }} kWh/ mês</div>
      </div>
    </v-card-text>
  </v-card>
    <v-skeleton-loader class="flex-grow-1 pt-4" v-else width="250" height="75" type="image" />
</template>

<script setup>
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const capacity = useCapacity();
const simulator_loading = useSimulatorLoading();
</script>

<style>
#card-key {
  font-family: "Montserrat";
  font-size: 1.2em;
}

#card-value {
  font-family: "Raleway";
  font-size: 1.5em;
}
</style>