<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12">
        <div class="d-flex flex-column align-center">
          <h1>Planejador de Custo de Implantação de Energia Solar</h1>
          <p class="text-medium-emphasis">Faça uma simulação com o nosso planejador de custos e veja o quanto você pode economizar!</p>
        </div>
      </VCol>
      <InstallationLocation />
      <MonthlyEnergySpend />
      <SimulationResult />
    </VRow>
  </VContainer>
</template>