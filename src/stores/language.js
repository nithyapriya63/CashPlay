import { defineStore } from "pinia";
import { ref } from "vue";
import { i18n } from "src/boot/i18n"; // Import from boot/i18n.js

export const useLanguageStore = defineStore("language", () => {
  const selectedLanguage = ref(
    localStorage.getItem("selectedLanguage") || "en-US"
  );

  function setLanguage(lang) {
    selectedLanguage.value = lang;
    localStorage.setItem("selectedLanguage", lang); // Save language in local storage

    // Set the locale dynamically
    i18n.global.locale.value = lang;
  }

  return { selectedLanguage, setLanguage };
});
