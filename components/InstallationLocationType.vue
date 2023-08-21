<template>
    <VRow no-gutters align="center" justify="center">
        <VForm @submit.prevent="submit" class="mt-7">
            <div>
                <label class="label text-grey-darken-2" for="name">1. Qual é a categoria do ambiente onde o gerador será
                    instalado?</label>
                <VTextField :rules="[ruleRequired]" v-model="name" prepend-inner-icon="fluent:person-24-regular" id="name"
                    name="name" />
            </div>
            <div class="mt-5">
                <VBtn type="submit" block min-height="45" class="gradient primary">Create Account</VBtn>
            </div>
        </VForm>
    </VRow>
</template>

<script setup>
const name = ref("");
const email = ref("");
const password = ref("");

const submit = async () => { };
</script>
