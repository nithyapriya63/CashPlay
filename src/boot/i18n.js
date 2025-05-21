import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";

export let i18n; // Exporting so we can use it in Pinia

export default boot(({ app }) => {
  // Load stored language or fallback to "en-US"
  const savedLanguage = localStorage.getItem("selectedLanguage") || "en-US";

  i18n = createI18n({
    legacy: false, // Enables Composition API support
    globalInjection: true,
    locale: savedLanguage, // Set the initial language
    fallbackLocale: "en-US",
    messages,
  });

  // Use i18n instance globally
  app.use(i18n);
});
