<template>
  <q-page>
    <div class="q-pa-md">
      <q-list bordered padding>
        <q-item-label header
          >{{ $t("entries") }} {{ $t("settings.settings") }}</q-item-label
        >

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t("settings.promptToDelete") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="storeSettings.settings.promptToDelete" />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t("settings.showRunningBalance") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="storeSettings.settings.showRunningBalance" />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-input
              outlined
              v-model="storeSettings.settings.currencySymbol"
              :label="$t('settings.currencySymbol')"
            />
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header>{{ $t("settings.appearance") }}</q-item-label>
        <q-item tag="label" v-ripple>
          <q-item-section avatar>
            <q-radio v-model="storeSettings.settings.darkMode" :val="false" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("settings.light") }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section avatar>
            <q-radio v-model="storeSettings.settings.darkMode" :val="true" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("settings.dark") }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section avatar top>
            <q-radio v-model="storeSettings.settings.darkMode" val="auto" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("settings.auto") }}</q-item-label>
            <q-item-label caption>{{
              $t("settings.followDevicePreference")
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div></q-page
  >
</template>

<script setup>
import stores from "src/stores";
import { useStoreSettings } from "src/stores/storeSettings";
import { useI18n } from "vue-i18n";

// stores
const storeSettings = useStoreSettings();
const { t } = useI18n();
</script>
