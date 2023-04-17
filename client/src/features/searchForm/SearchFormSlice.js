import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  matchingResorts: [],
  searchRequested: false,
  userSearchCenterCoordinates: {
    latitude: "",
    longitude: "",
  },
};
export const searchFormSlice = createSlice({
  name: "resorts2Display",
  initialState,
  reducers: {
    updateSearchRequested: (state, action) => {
      state.searchRequested = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(populateMatchingResorts.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(populateMatchingResorts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "success";
        state.matchingResorts = action.payload.matchingResorts;
        state.userSearchCenterCoordinates.latitude =
          action.payload.userSearchCenterCoordinates.latitude;
        state.userSearchCenterCoordinates.longitude =
          action.payload.userSearchCenterCoordinates.longitude;
      })
      .addCase(populateMatchingResorts.rejected, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.error = action.payload.message;
        state.status = "rejected";
      });
  },
});
export const populateMatchingResorts = createAsyncThunk(
  "resorts2Display/populateMatchingResorts",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/resortfinder",
        data
      );
      return response.data;
    } catch (err) {
      const errorData = {
        message: err.response?.data?.message || err.message,
        status: err.response?.status,
      };
      return thunkAPI.rejectWithValue(errorData);
    }
    
  }
);
export const { updateSearchRequested, clearError } = searchFormSlice.actions;
export default searchFormSlice.reducer;
