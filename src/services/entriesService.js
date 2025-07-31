import { api } from "src/boot/axios";

export default {
  // Create new income data entry
  async createEntry(entryData) {
    return api.post("/data", entryData);
  },

  // Get a single entry by ID
  async getEntry(id) {
    return api.get(`/data/${id}`);
  },

  // Update entry by ID
  async updateEntry(id, updatedData) {
    return api.put(`/data/${id}`, updatedData);
  },

  // Delete entry by ID
  async deleteEntry(id) {
    return api.delete(`/data/${id}`);
  },

  // List all entries (POST /data/list if you need filters)
  async listEntries(filters = {}) {
    return api.post("/data/list", filters);
  },
};
