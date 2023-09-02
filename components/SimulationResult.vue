<template>
  <VRow v-if="show_info" justify="center">
    <VCol class="mt-8" align="center" cols="12">
      <p class="font-weight-bold text-overline">Resultado</p>
    </VCol>

    <VCol v-if="getSolarInfo()" cols="8">
      <div style="gap: 10px" class="d-flex justify-space-between">
        <ProductionCapacity />
        <KitPower />
        <AreaMin />
      </div>
    </VCol>
  </VRow>
</template>

<script setup>
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

<style>
p {
  font-family: 'FarAwayGalaxy', sans-serif;
}
</style>
