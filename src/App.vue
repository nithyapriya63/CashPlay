<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useStoreSettings } from "src/stores/storeSettings";
import { useStoreEntries } from "src/stores/storeEntries";
import { useAuthStore } from "src/stores/authStore";
import { useRouter } from "vue-router";
defineOptions({
  name: "App",
});

const storeSettings = useStoreSettings();
const storeEntries = useStoreEntries();
const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
  storeSettings.loadSettings();
  storeEntries.loadEntries();
  auth.handleAppReopen(router);
});
</script>
