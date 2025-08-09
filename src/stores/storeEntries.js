import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { uid, Notify, LocalStorage } from "quasar";
import entriesService from "src/services/entriesService";
import { getDefaultEntry, getDefaultUpdateEntry } from "src/models/Entry";
import { useAuthStore } from "src/stores/authStore";
import { getDefaultEntryRequest } from "src/models/EntryList";

export const useStoreEntries = defineStore("entries", () => {
  //state
  const entries = ref([]);

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

  // actions
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
      await fetchEntries();

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

  const deleteEntry = async (entryId) => {
    try {
      await entriesService.deleteEntry(entryId);

      const index = getEntryIndexById(entryId);
      if (index !== -1) {
        entries.value.splice(index, 1);
      }

      Notify.create({
        color: "positive",
        message: "Entry deleted successfully!",
        position: "top",
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      Notify.create({
        color: "negative",
        message: "Failed to delete entry!",
        position: "top",
      });
    }
  };

  const getEntryIndexById = (entryId) => {
    return entries.value.findIndex((entry) => entry.id === entryId);
  };

  const onUpdateEntry = async (entryId, updates) => {
    const authStore = useAuthStore();
    const user = authStore.user;

    const index = getEntryIndexById(entryId);
    if (index === -1) return;

    const updatedEntryData = {
      ...entries.value[index],
      ...updates,
    };

    const entryPayload = getDefaultUpdateEntry({
      id: updatedEntryData.id,
      name: updatedEntryData.name,
      amount: updatedEntryData.amount,
      date: updatedEntryData.date,
      user,
    });

    try {
      const response = await entriesService.updateEntry(entryId, entryPayload);
      const updatedFromApi = response.data;

      entries.value[index] = {
        id: updatedFromApi.id,
        name: updatedFromApi.title,
        amount: updatedFromApi.amount,
        date: updatedFromApi.date,
      };

      Notify.create({
        color: "positive",
        message: "Entry updated successfully!",
        position: "top",
      });
    } catch (error) {
      console.error("Error updating entry:", error);
      Notify.create({
        color: "negative",
        message: "Failed to update entry!",
        position: "top",
      });
    }
  };

  const fetchEntries = async () => {
    try {
      const filters = getDefaultEntryRequest();
      const response = await entriesService.listEntries(filters);

      // Access the first key dynamically
      const monthlyKey = Object.keys(response.data)[0];
      const monthlyData = response.data[monthlyKey];

      if (!monthlyData || !Array.isArray(monthlyData.data)) {
        console.warn("Invalid response structure", response.data);
        entries.value = [];
        return;
      }

      // Extract entries
      entries.value = monthlyData.data.map((entry) => ({
        id: entry.id,
        name: entry.title,
        amount: entry.amount,
        date: entry.date,
      }));
    } catch (error) {
      console.error("Failed to fetch entries:", error);
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
    fetchEntries,
  };
});
