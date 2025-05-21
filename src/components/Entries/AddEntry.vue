<template>
  <q-form @submit="handleSubmit" class="row q-pa-sm q-col-gutter-sm bg-primary">
    <div class="col">
      <q-input
        v-model="form.name"
        ref="nameRef"
        :placeholder="$t('name')"
        :bg-color="useLightOrDark('white', 'black')"
        outlined
        dense
        :rules="[(val) => !!val || $t('nameRequired')]"
      />
    </div>
    <div class="col">
      <q-input
        v-model.number="form.amount"
        :placeholder="$t('amount')"
        type="number"
        :bg-color="useLightOrDark('white', 'black')"
        outlined
        dense
        :rules="[(val) => (val !== null && val !== '') || $t('amountRequired')]"
      />
    </div>
    <div class="col">
      <q-btn
        type="submit"
        round
        color="primary"
        icon="add"
        :disable="!form.name || form.amount === null || form.amount === ''"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStoreEntries } from "../../stores/storeEntries";
import { useI18n } from "vue-i18n";
import { useLightOrDark } from "../../childComp/useLightOrDark";

const { t } = useI18n();
const storeEntries = useStoreEntries();

const formDefault = {
  name: "",
  amount: null,
};
const form = reactive({ ...formDefault });

const nameRef = ref(null);

const resetForm = () => {
  Object.assign(form, formDefault);
  nameRef.value?.focus();
};

const handleSubmit = () => {
  storeEntries.addEntry(form);
  resetForm();
};
</script>
