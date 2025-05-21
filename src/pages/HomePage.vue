<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title>
        <div class="absolute-center">
          <q-icon name="account_balance" /> {{ $t("cashplay") }}
        </div>
      </q-toolbar-title>

      <q-space />
      <!-- Profile Icon with Menu -->
      <q-btn round dense flat icon="account_circle" aria-label="Profile">
        <q-tooltip>{{ $t("profile") }}</q-tooltip>
        <q-menu>
          <q-list style="min-width: 150px">
            <!-- Language Section -->
            <q-item-label header>{{ $t("language") }}</q-item-label>
            <q-item>
              <q-option-group
                v-model="currentLang"
                :options="languageOptions"
                type="radio"
                dense
                @update:model-value="changeLanguage"
              />
            </q-item>

            <q-separator color="grey-4" />

            <q-item clickable v-close-popup @click="logout">
              <q-item-section>
                <span>{{ $t("logout") }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>

  <q-drawer v-model="leftDrawerOpen" class="bg-primary" show-if-above bordered>
    <q-list>
      <q-item-label header> {{ $t("menu") }} </q-item-label>

      <NavLink
        v-for="link in linksList"
        :key="link.title"
        v-bind="link"
        class="text-white"
      />
    </q-list>
  </q-drawer>

  <q-page-container>
    <router-view />
  </q-page-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "../stores/language";
import NavLink from "components/Nav/NavLink.vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

defineOptions({
  name: "HomePage",
});

const leftDrawerOpen = ref(false);
const { t } = useI18n();
const languageStore = useLanguageStore();
const currentLang = ref(languageStore.language);
const authStore = useAuthStore();
const router = useRouter();
const linksList = computed(() => [
  {
    title: t("entries"),
    icon: "account_balance",
    link: "/entries",
  },
  {
    title: t("settings.settings"),
    icon: "settings",
    link: "/settings",
  },
]);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function changeLanguage(lang) {
  languageStore.setLanguage(lang);
}
const languageOptions = [
  { label: "English", value: "en-US" },
  { label: "German", value: "de-GR" },
];

const logout = () => {
  authStore.logout(router);
};
</script>

<style scoped>
.q-page-container {
  padding: 0 !important;
}
</style>
