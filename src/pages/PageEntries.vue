<template>
  <div class="q-pa-md">
    <div class="row justify-end q-mb-sm">
      <q-btn
        dense
        round
        unelevated
        color="primary"
        icon="add"
        @click="showAddDialog = true"
        class="q-ml-xs"
      />
    </div>
    <NoDataFound v-if="!storeEntries.entries.length" />
    <q-list bordered separator v-else>
      <q-slide-item
        @left="onEntrySlideLeft($event, entry.id)"
        @right="onEntrySlideRight($event, entry.id)"
        v-for="(entry, index) in paginatedData"
        :key="entry.id"
        right-color="negative"
      >
        <!-- <template v-slot:left>
          <q-icon name="done" />
        </template> -->
        <template v-slot:right>
          <q-icon name="delete" />
        </template>
        <q-item>
          <q-item-section
            class="text-weight-bold"
            :class="useAmountColorClass(entry.amount)"
          >
            {{ entry.name }}
            <q-popup-edit
              @save="onNameUpdate($event, entry.id)"
              v-model="entry.name"
              :cover="false"
              :offset="[0, 10]"
              v-slot="scope"
              label-set="Ok"
              buttons
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
                input-class="text-weight-bold"
              />
            </q-popup-edit>
          </q-item-section>

          <q-item-section
            side
            class="text-weight-bold"
            :class="useAmountColorClass(entry.amount)"
          >
            {{ useCurrency(entry.amount) }}
            <q-popup-edit
              @save="onAmountUpdate($event, entry.id)"
              v-model="entry.amount"
              :cover="false"
              :offset="[0, 10]"
              v-slot="scope"
              label-set="Ok"
              buttons
            >
              <q-input
                v-model.number="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
                input-class="text-weight-bold"
                type="number"
                step="0.01"
              />
            </q-popup-edit>
            <q-chip
              v-if="storeSettings.settings.showRunningBalance"
              :class="
                useAmountColorClass(
                  storeEntries.runningBalances[(page - 1) * rowsPerPage + index]
                )
              "
              class="absolute-bottom-right running-balance"
              outline
              size="9px"
              dense
            >
              {{
                useCurrency(
                  storeEntries.runningBalances[(page - 1) * rowsPerPage + index]
                )
              }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
    <div class="q-mt-md row justify-end">
      <q-pagination
        v-model="page"
        :max="maxPage"
        :max-pages="6"
        direction-links
        boundary-numbers
        @update:model-value="onPageChange"
      />
    </div>
  </div>
  <q-footer class="bg-transparent">
    <EntryBalance />

    <!-- <AddEntry /> -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section>
          <AddEntry @close="showAddDialog = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-footer>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useQuasar } from "quasar";
import { useCurrency } from "../childComp/useCurrency";
import { useAmountColorClass } from "../childComp/useAmountColorClass";
import { useStoreEntries } from "../stores/storeEntries";
import { useStoreSettings } from "../stores/storeSettings";
import NoDataFound from "src/components/Entries/NoDataFound.vue";
import AddEntry from "src/components/Entries/AddEntry.vue";
import EntryBalance from "src/components/Entries/EntryBalance.vue";
import { onMounted } from "vue";
import { useAuthStore } from "src/stores/authStore";

const $q = useQuasar();
// stores
const storeEntries = useStoreEntries();
const storeSettings = useStoreSettings();
const rowsPerPage = 5;
const page = ref(1);
const showAddDialog = ref(false);
const authStore = useAuthStore();

// slide left to delete the entry
const onEntrySlideRight = ({ reset }, entryId) => {
  if (storeSettings.settings.promptToDelete) promptToDelete(reset, entryId);
  else storeEntries.deleteEntry(entryId);
};

const promptToDelete = (reset, entryId) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this entry",
    cancel: true,
    persistent: true,
    ok: {
      label: "Delete",
      color: "negative",
      noCaps: true,
    },
    cancel: {
      color: "primary",
      noCaps: true,
    },
  })
    .onOk(() => {
      storeEntries.deleteEntry(entryId);
    })
    .onCancel(() => {
      reset();
    });
};

// slide right
const onEntrySlideLeft = ({ reset }, entryId) => {
  console.log("entry id ", entryId);
};

// Name and Amount update
const onNameUpdate = (value, entryId) => {
  storeEntries.onUpdateEntry(entryId, { name: value });
};

const onAmountUpdate = (value, entryId) => {
  storeEntries.onUpdateEntry(entryId, { amount: value });
};

// pagination
const paginatedData = computed(() => {
  const start = (page.value - 1) * rowsPerPage;
  return storeEntries.entries.slice(start, start + rowsPerPage);
});

const maxPage = computed(() =>
  Math.ceil(storeEntries.entries.length / rowsPerPage)
);

const onPageChange = (newPage) => {
  page.value = newPage;
};

// onMounted(() => {
//   storeEntries.fetchEntries(); // auto fetch from backend on load
// });
onMounted(() => {
  if (authStore.token.accessToken) {
    storeEntries.fetchEntries();
  }
});
</script>
