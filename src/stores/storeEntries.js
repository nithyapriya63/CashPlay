import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { uid, Notify, LocalStorage } from "quasar";
import entriesService from "src/services/entriesService";
import { getDefaultEntry } from "src/models/Entry";
import { useAuthStore } from "src/stores/authStore";
// import { getDefaultEntryRequest } from "src/models/EntryList";

export const useStoreEntries = defineStore("entries", () => {
  //state
  const entries = ref([
    {
      id: "id1",
      name: "Salary",
      amount: 10000,
    },
    {
      id: "id2",
      name: "Insurance",
      amount: -100,
    },
    {
      id: "id3",
      name: "Phone",
      amount: -300,
    },
  ]);

  watch(
    entries,
    () => {
      saveEntries();
    },
    { deep: true } // Ensure deep watching for changes
  );
  //getters

  const balance = computed(() => {
    return entries.value.reduce((accumulator, { amount }) => {
      return accumulator + amount;
    }, 0);
  });

  const runningBalances = computed(() => {
    let runningBalances = [];
    let currentRunningBalance = 0;

    entries.value.forEach(({ amount }) => {
      currentRunningBalance += amount || 0;
      runningBalances.push(currentRunningBalance);
    });

    return runningBalances;
  });

  const addEntry = async ({ name, amount, date }) => {
    const authStore = useAuthStore();
    const user = authStore.user;

    const entryPayload = getDefaultEntry({ name, amount, date, user });

    try {
      const response = await entriesService.createEntry(entryPayload);
      const createdEntries = response.data || [];

      createdEntries.forEach((entry) => {
        entries.value.push({
          id: uid(),
          name: entry.title,
          amount: entry.amount,
          date: entry.date,
        });
      });

      Notify.create({
        color: "positive",
        message: "Entry added successfully!",
        position: "top",
      });
    } catch (error) {
      console.error("Error adding entry:", error);
      Notify.create({
        color: "negative",
        message: "Failed to add entry!",
        position: "top",
      });
    }
  };

  const deleteEntry = (entryId) => {
    const index = entries.value.findIndex((entry) => entry.id === entryId);
    entries.value.splice(index, 1);
    Notify.create({
      color: "negative",
      message: "Entry Deleted",
      position: "top",
    });
  };

  const onUpdateEntry = (entryId, updates) => {
    const index = getEntryIndexById(entryId);
    Object.assign(entries.value[index], updates);
  };

  const getEntryIndexById = (entryId) => {
    return entries.value.findIndex((entry) => entry.id === entryId);
  };

  const saveEntries = () => {
    LocalStorage.set("entries", entries.value);
  };

  const loadEntries = () => {
    const savedEntries = LocalStorage.getItem("entries");
    if (savedEntries) {
      entries.value = savedEntries;
    }
  };

  return {
    // state
    entries,

    // getters
    balance,
    runningBalances,

    // actions
    addEntry,
    deleteEntry,
    onUpdateEntry,
    loadEntries,
  };
});
