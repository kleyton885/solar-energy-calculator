<template>
  <VCol v-if="latlng.lat != ''" class="fill-height mt-8" cols="12" lg="6" md="6" sm="10">
    <div>
      <h3 class="text-green-lighten-1">2. Qual a mensalidade da sua conta de luz atualmente?</h3>
    </div>
    <v-text-field :disabled="monthySpendTextFieldDisabled" v-model="monthySpendMasked" variant="outlined" class="mt-2"
      label="Valor em Reais" @input="validateMonthySpend(); setStateMonthySpend();" :rules="monthlySpendRules" required></v-text-field>
    <div>
      <h3 class="text-green-lighten-1">3. Qual seu email?</h3>
    </div>
    <v-text-field ref="form" class="mt-2" variant="outlined" v-model="userEmail" :rules="emailRules"
      @input="setUserEmail()" label="Digite seu email aqui.." :disabled="userMailTextFieldDisabled" required></v-text-field>
    <v-btn class="mt-2" @click="validate()" :disabled="btn_simulate_disabled" variant="outlined" color="green-darken-1">CLIQUE AQUI
      PARA SIMULAR</v-btn>
  </VCol>
</template>


<script setup>
import { getCurrentInstance } from 'vue'
const app = getCurrentInstance()

const monthly_spend = useMonthlySpend();
const userMail = useUserMail();
const latlng = useLatlng();
const use_simulator = useSimulator();
const show_info = useShowInfo();
const monthySpendTextFieldDisabled = useMonthySpendTextFieldDisabled();
const userMailTextFieldDisabled = useUserMailTextFieldDisabled();

setInterval(() => {
  app.data.monthySpendMasked = monthly_spend.value
  app.data.userEmail = userMail.value
}, 500);

function setStateMonthySpend() {
  monthly_spend.value = app.data.monthySpendMasked
  app.data.btn_simulate_disabled = isValidMonthySpend() && isValidMail() ? false : true;
}

function setUserEmail() {
  userMail.value = app.data.userEmail
  app.data.btn_simulate_disabled = isValidMail() && isValidMonthySpend() ? false : true;
}

function isValidMail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(app.data.userEmail);
}

function isValidMonthySpend(){
  return parseInt(app.data.monthySpend) >= 15000 ? true : false
}

function validate() {
  if (app.ctx.$refs.form.validate()) {
    if (isValidMail() && isValidMonthySpend()) {
      simulate();
    }
  }
}

function simulate() {
  show_info.value = true;
  use_simulator.value = true;
  app.data.btn_simulate_disabled = true;
}
</script>

<script>
export default {
  data() {
    return {
      monthySpend: '',
      monthySpendMasked: '',
      btn_simulate_disabled: true,
      userEmail: '',
      monthlySpendRules: [
        v => !!v || 'Valor da conta de luz é obrigatório',
      ],
      emailRules: [
        v => !!v || 'Email é obrigatório',
        v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email deve ser válido',
      ]
    };
  },
  methods: {
    validateMonthySpend() {
      String.prototype.reverse = function () {
        return this.split('').reverse().join('');
      };

      this.monthySpend = this.monthySpendMasked.replace(/[^\d]+/gi, '').reverse();
      var resultado = "";
      var mascara = "##.###,##".reverse();
      for (var x = 0, y = 0; x < mascara.length && y < this.monthySpend.length;) {
        if (mascara.charAt(x) != '#') {
          resultado += mascara.charAt(x);
          x++;
        } else {
          resultado += this.monthySpend.charAt(y);
          y++;
          x++;
        }
      }
      this.monthySpendMasked = 'R$ ' + resultado.reverse();
      this.monthySpend = this.monthySpendMasked.replace(/[R$.,]/g, '');
    },
  },
};
</script>