<template>
  <VRow v-if="latlng.lat != ''" no-gutters align="center" justify="center" class="mt-4">
    <VCol class="fill-height" cols="12" md="8" lg="8">
      <div>
        <h3>2. Qual a mensalidade da sua conta de luz atualmente?</h3>
      </div>
      <v-text-field :disabled="monthySpendTextFieldDisabled" v-model="maskedValue" variant="outlined" class="mt-2" label="Valor em Reais"
       @update:focused="finish_monthly_spend(this)" @input="updateValue()"></v-text-field>
    </VCol>
    <VCol class="fill-height" cols="12" md="8" lg="8">
      <v-btn @click="simulate(); btn_calc_disabled=true" :disabled="btn_calc_disabled" color="green-darken-1" size="large">CLIQUE AQUI PARA SIMULAR</v-btn>
    </VCol>
  </VRow>  
</template>


<script setup>
const monthly_spend = useMonthlySpend();
const latlng = useLatlng();
const simulator = useSimulator();
const monthySpendTextFieldDisabled = useMonthySpendTextFieldDisabled();

function finish_monthly_spend(e) {
  if (e && e.maskedValue){
    monthly_spend.value = e.maskedValue
  }
}

function simulate(){
  simulator.value = true;
}
</script>

<script>
export default {
  data() {
    return {
      value: '',
      maskedValue: 'R$ ',
      btn_calc_disabled: true,
    };
  },
  methods: {
    updateValue() {
      String.prototype.reverse = function () {
        return this.split('').reverse().join('');
      };

      console.log("replace 1")
      this.value  =  this.maskedValue.replace(/[^\d]+/gi,'').reverse();
      var resultado  = "";
      var mascara = "##.###,##".reverse();
      for (var x = 0, y = 0; x < mascara.length && y < this.value.length;) {
        if (mascara.charAt(x) != '#') {
          resultado += mascara.charAt(x);
          x++;
        } else {
          resultado += this.value.charAt(y);
          y++;
          x++;
        }
      }
      this.maskedValue = 'R$ ' + resultado.reverse();
      console.log ("replace 2")
      this.value = this.maskedValue.replace(/[R$.,]/g, '');
      this.btn_calc_disabled = parseInt(this.value) > 2000 ? false : true
    },
  },
};
</script>