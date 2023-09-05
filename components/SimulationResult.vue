<template>
  <VRow v-if="show_info" justify="center">
    <VCol class="mt-8" align="center" cols="12">
      <p class="font-weight-bold text-overline">Resultado</p>
    </VCol>

    <VCol v-if="getSolarInfo()" cols="12">
      <div style="gap: 10px" class="d-flex flex-wrap justify-space-between">
        <ImplatationCost />
        <KitPower />
        <QtModulos />
        <ProductionCapacity />
        <Payback />
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
const payback = usePayback();
const implatationCost = useImplatationCost();
const monthly_spend = useMonthlySpend();
const monthySpendTextFieldDisabled = useMonthySpendTextFieldDisabled();
const userMailTextFieldDisabled = useUserMailTextFieldDisabled();
const kWh = useKWh();
const kWp = useKWp();
const qt_modulos = useQtModulos();
const areaMin = useAreaMin();

function calcularPrecoMedio(kWp) {
  const capacidades = [2, 4, 8, 12, 30, 50, 75, 150, 300, 500, 1000];
  const precos = [
    10840, 17560, 31360, 44040, 100800, 186500, 280000, 531000, 1041000, 1780000, 3710000
  ];

  for (let i = 0; i < capacidades.length - 1; i++) {
    if (kWp <= capacidades[i + 1]) {
      const capacidadeMenor = capacidades[i];
      const capacidadeMaior = capacidades[i + 1];
      const precoMenor = precos[i];
      const precoMaior = precos[i + 1];

      // Interpolação linear para calcular o preço médio aproximado
      const precoMedio = precoMenor + ((kWp - capacidadeMenor) / (capacidadeMaior - capacidadeMenor)) * (precoMaior - precoMenor);

      return parseInt(precoMedio);
    }
  }

  // Se kWp for maior do que a maior capacidade listada, retorne o preço máximo
  return precos[capacidades.length - 1];
}

function converterMesesParaAnosEMeses(meses) {
  if (meses <= 0) {
    return "0 meses";
  } else if (meses < 12) {
    return meses + " meses";
  } else {
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;

    let resultado = "";

    if (anos > 0) {
      resultado += anos + " ano";
      if (anos > 1) resultado += "s";
      resultado += " ";
    }

    if (mesesRestantes > 0) {
      resultado += "e " + mesesRestantes + " mês";
      if (mesesRestantes > 1) resultado += "es";
    }

    resultado = resultado.replace("mêses", "meses");

    return resultado;
  }
}

async function getSolarInfo() {
  try {
    if (!simulator_loading.value && use_simulator.value) {
      simulator_loading.value = true;

      // calculos com base nas informações do usuário
      let valorDaConta = parseFloat(monthly_spend.value.replace(/[R$.,]/g, '').slice(0, -2));
      const impostosPorKwh = 0.49; // tributos federais, estaduais, taxa de iluminação pública e outros impostos
      const precoPorKwh = 0.86; // preço do kWh em reais
      const potenciaModulo = 0.555 // potência do módulo em Watt
      kWh.value = valorDaConta/(precoPorKwh + impostosPorKwh) // kWh gasto mensalmente pelo usuario
      // calculando a eficiência do local para geração com um sistema de 1 kWp
      let geracaoMensalPorKwp = await $fetch('https://api.globalsolaratlas.info/data/pvcalc?loc='+latlng.value.lat+','+latlng.value.lng, {
        method: 'POST',
        body: '{"type":"rooftopSmall","systemSize":{"type":"capacity","value":1},"orientation":{"azimuth":0,"tilt":9}}'
      });
      geracaoMensalPorKwp = Math.ceil(geracaoMensalPorKwp.annual.data.PVOUT_total/12)
      kWp.value = kWh.value / geracaoMensalPorKwp;  // potência do kit necessária
      qt_modulos.value = Math.ceil(kWp.value / potenciaModulo); // quantidade de módulos necessários
      kWp.value = (qt_modulos.value * potenciaModulo).toFixed(2); // nova potencia do kit ajustada
      kWh.value = Math.ceil(kWh.value); // novo kWh gasto mensalmente pelo usuario ajustado
      areaMin.value = Math.ceil(kWp.value*7) // area minima do telhado necessária
      implatationCost.value = calcularPrecoMedio(kWp.value);
      // const custoImplantacaoReais = implatationCost.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});

      // console.log("Consumo mensal: " + kWh.value + " kWh")
      // console.log("Potência do kit necessária: " + kWp.value + " kWP")
      // console.log("Área mínima necessária: " + areaMin.value + " M²")
      // console.log("Quantidade de módulos necessários: " + qt_modulos.value + " módulos de " + potenciaModulo + " W")
      // console.log("Custo de Implantação estimado: " + custoImplantacaoReais + "\n\n")



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

      // Calculando o tempo de retorno que é igual a implatationCost.value / economiaMensal onde a economia mensal é consumoAntes - ProduçãoSolarEmKhw*precoPorKwh
      const economiaMensal = valorDaConta - (capacity.value*precoPorKwh) + (kWh.value*0.49);
      payback.value = Math.abs(implatationCost.value / economiaMensal);
      payback.value = converterMesesParaAnosEMeses(payback.value.toFixed(0)); // tempo de retorno do investimento
      // console.log(`O tempo de retorno do investimento é de aproximadamente ${payback.value}.`);


      monthySpendTextFieldDisabled.value = true;
      userMailTextFieldDisabled.value = true;
      simulator_loading.value = false;
      use_simulator.value = false;
    }
  } catch (e) {
    console.log(e)
  }

}
</script>