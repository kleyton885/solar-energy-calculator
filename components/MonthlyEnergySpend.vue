<template>
  <VCol v-if="latlng.lat != ''" class="fill-height mt-8" cols="12" lg="6" md="6" sm="10">
    <div>
      <h3>2. Qual a mensalidade da sua conta de luz atualmente?</h3>
    </div>
    <v-text-field :disabled="monthySpendTextFieldDisabled" v-model="maskedValue" variant="outlined" class="mt-2" label="Valor em Reais"
      @input="updateValue(); updateMonthySpend();"></v-text-field>
      <v-btn @click="simulate(); btn_calc_disabled=true" :disabled="btn_calc_disabled" variant="outlined" color="green-darken-1">CLIQUE AQUI PARA SIMULAR</v-btn>
  </VCol>
</template>


<script setup>
import { getCurrentInstance } from 'vue'

const monthly_spend = useMonthlySpend();
const latlng = useLatlng();
const use_simulator = useSimulator();
const show_info = useShowInfo();
const monthySpendTextFieldDisabled = useMonthySpendTextFieldDisabled();

const app = getCurrentInstance()

function updateMonthySpend(){
  monthly_spend.value = app.data.maskedValue
}

function simulate(){
  show_info.value = true;
  use_simulator.value = true;
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
      this.value = this.maskedValue.replace(/[R$.,]/g, '');
      this.btn_calc_disabled = parseInt(this.value) > 2000 ? false : true
    },
  },
};
</script>