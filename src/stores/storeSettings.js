import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import { Dark, LocalStorage } from "quasar";

export const useStoreSettings = defineStore("settings", () => {
  //state

  const settings = reactive({
    promptToDelete: true,
    showRunningBalance: true,
    currencySymbol: "$",
    darkMode: false,
  });

  watch(
    () => settings.darkMode,
    (value) => {
      Dark.set(value);
    },
    { immediate: true }
  );

  // watch settings
  watch(
    settings,
    () => {
      saveSettings();
    },
    { deep: true } // Ensure deep watching for changes
  );

  //actions

  const saveSettings = () => {
    LocalStorage.set("settings", settings);
  };

  const loadSettings = () => {
    const savedSettings = LocalStorage.getItem("settings");
    if (savedSettings) Object.assign(settings, savedSettings);
  };

  return {
    settings,
    loadSettings,
  };
});
