<template>
  <VRow v-if="show_info" no-gutters align="center" justify="center" class="mt-4">
    <VCol v-if="!simulator_loading && getSolarInfo()" class="fill-height" cols="12" md="8" lg="8">
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
      <div class="mt-2">Com base nas informações fornecidas:</div>
      <div class="mt-2">Você tem um consumo médio de {{ kWh }} Watts por mês.</div>
      <div class="mt-2">* Com um kit de {{ kWp }} kWp ou {{ qt_modulos }} módulos de 555W.</div>
      <div class="mt-2">Área mínima necessária do telhado: {{ areaMin }} M².</div>
    </VCol>
    <VCol v-else class="fill-height" cols="12" md="8" lg="8">
      <v-skeleton-loader width="230" height="75" type="image" />
    </VCol>
  </VRow>
</template>

<script setup>
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const capacity = useCapacity();
const latlng = useLatlng();
const show_info = useShowInfo();
const use_simulator = useSimulator();
const simulator_loading = useSimulatorLoading();
const monthly_spend = useMonthlySpend();
const monthySpendTextFieldDisabled = useMonthySpendTextFieldDisabled();
const kWh = useKWh();
const kWp = useKWp();
const qt_modulos = useQtModulos();
const areaMin = useAreaMin();

async function getSolarInfo() {
  try {
    if (!simulator_loading.value && use_simulator.value) {
      simulator_loading.value = true;

      // calculos com base nas informações do usuário
      let valorEmReais = monthly_spend.value.replace(/[R$.,]/g, '').slice(0, -2);
      const precokWh = 1.15 // preço do kWh em reais    (0.86 + impostos)
      const potenciaModulo = 0.555 // potência do módulo em W
      kWh.value = valorEmReais/precokWh // kWh gasto mensalmente pelo usuario
      kWp.value = (kWh.value*7/potenciaModulo)/1000 // potência do kit necessária
      qt_modulos.value = Math.ceil(kWp.value / potenciaModulo); // quantidade de módulos necessários
      kWp.value = (qt_modulos.value * potenciaModulo).toFixed(2); // nova potencia do kit ajustada
      kWh.value = Math.ceil(kWh.value); // novo kWh gasto mensalmente pelo usuario ajustado
      areaMin.value = Math.ceil(kWp.value*7) // area minima do telhado necessária

      // console.log("Consumo mensal: " + kWh.value + " kWh")
      // console.log("Potência do kit necessária: " + kWp.value + " kWP")
      // console.log("Área mínima necessária: " + areaMin.value + " M²")
      // console.log("Quantidade de módulos necessários: " + qt_modulos.value + " módulos de " + potenciaModulo + " W" + "\n\n")

      const post = await $fetch('https://api.globalsolaratlas.info/data/pvcalc?loc='+latlng.value.lat+','+latlng.value.lng, {
        method: 'POST',
        body: '{"type":"rooftopSmall","systemSize":{"type":"capacity","value":'+kWp.value+'},"orientation":{"azimuth":0,"tilt":9}}'
      });
      capacity.value = post.annual.data.PVOUT_total

      if (capacity.value % 1 >= 0.5) {
        capacity.value = Math.ceil(capacity.value/12);
      } else {
        capacity.value = Math.floor(capacity.value/12);
      }

      monthySpendTextFieldDisabled.value = true;
      simulator_loading.value = false;
      use_simulator.value = false;
    }
  } catch (e) {
    console.log(e)
  }

}
</script>