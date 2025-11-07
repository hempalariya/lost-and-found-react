import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/api";

export const fetchLostReports = createAsyncThunk(
  "reports/fetchFound",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/report/lost-report");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchFoundReports = createAsyncThunk(
  "reports/fetchLost",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/report/found-report");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    lost: [],
    found: [],
    loading: false,
    error: "",
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchLostReports.pending, (state) => {
        state.loading = true
    })
    .addCase(fetchLostReports.fulfilled, (state, action) => {
        state.loading = false;
        state.lost = action.payload
    })
    .addCase(fetchLostReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to load lost reports"
    })
    .addCase(fetchFoundReports.pending, (state) => {
        state.loading = true
    })
    .addCase(fetchFoundReports.fulfilled, (state, action) => {
        state.loading = false
        state.found = action.payload
    })
    .addCase(fetchFoundReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to load found reports"
    })
  }
});

export default reportSlice.reducer
