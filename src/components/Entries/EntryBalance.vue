<template>
  <div class="row q-px-md q-py-sm shadow-up-3">
    <div class="col text-dark text-h6">{{ $t("balance") }}</div>
    <div
      class="col text-h6 text-right"
      :class="useAmountColorClass(storeEntries.balance)"
    >
      {{ useCurrency(storeEntries.balance) }}
    </div>
  </div>
</template>

<script setup>
import { useStoreEntries } from "src/stores/storeEntries";
import { useCurrency } from "src/childComp/useCurrency";
import { useAmountColorClass } from "src/childComp/useAmountColorClass";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const storeEntries = useStoreEntries();
</script>
