<template>
  <div class="text-h6 text-weight-bold q-mb-md">
    {{ $t("addEntry") }}
  </div>
  <q-form @submit="handleSubmit" class="q-gutter-md">
    <q-input
      v-model="form.name"
      ref="nameRef"
      :placeholder="$t('name')"
      outlined
      dense
      :rules="[(val) => !!val || $t('nameRequired')]"
    />

    <q-input
      v-model.number="form.amount"
      :placeholder="$t('amount')"
      type="number"
      outlined
      dense
      :rules="[(val) => (val !== null && val !== '') || $t('amountRequired')]"
    />
    <!-- Date Picker Field -->
    <q-input v-model="form.date" label="Select Date" readonly outlined dense>
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer" @click="showDate = true" />
      </template>
      <q-popup-proxy
        v-model="showDate"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date v-model="form.date" mask="YYYY-MM-DD" />
      </q-popup-proxy>
    </q-input>

    <div class="row justify-end q-gutter-sm">
      <q-btn
        flat
        :label="$t('cancel')"
        color="secondary"
        @click="$emit('close')"
      />
      <q-btn
        :label="$t('submit')"
        type="submit"
        color="primary"
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
const emit = defineEmits(["close"]);
const date = ref(null);
const showDate = ref(false);
const nameRef = ref(null);

const formDefault = {
  name: "",
  amount: null,
};
// const form = reactive({ ...formDefault });

// Include date in reactive form
const form = reactive({
  name: "",
  amount: null,
  date: new Date().toISOString().slice(0, 10), // default to today
});

const resetForm = () => {
  form.name = "";
  form.amount = null;
  form.date = new Date().toISOString().slice(0, 10);
  nameRef.value?.focus();
};

const handleSubmit = async () => {
  await storeEntries.addEntry({
    name: form.name,
    amount: form.amount,
    date: form.date,
  });
  emit("close"); //emit close to close the dialog
  resetForm();
};
</script>
