<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useStoreSettings } from "src/stores/storeSettings";
import { useStoreEntries } from "src/stores/storeEntries";
defineOptions({
  name: "App",
});

const storeSettings = useStoreSettings();
const storeEntries = useStoreEntries();

onMounted(() => {
  storeSettings.loadSettings();
  storeEntries.loadEntries();
});
</script>
