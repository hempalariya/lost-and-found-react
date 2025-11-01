import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../utils/api";

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData) => {
    try {
      const response = await axios.post("/auth", userData);
      return response.data;
    } catch (error) {
      console.log("error: ", error.message);
    }
  }
);

export const loginUser = createAsyncThunk("user/login", async (userData) => {
  try {
    const response = await axios.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.log("error: ", error.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: { loading: false, message: "", error: "" },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        (state.loading = false),
          (state.user = action.payload),
          (state.message = action.payload.message);
      })
      .addCase(registerUser.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        (state.loading = false),
          (state.user = action.payload),
          (state.message = "login successful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      });
  },
});

export default userSlice.reducer;
