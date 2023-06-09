import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { normalizeErrorResponse } from "../utilities/errorUtils";

const initialState = {
  isLoggedIn: false,
  isLoggingIn: false,
  isSigningUp: false,
  isEditing: false,
  // token: null,
  seasonPass: null,
  userName: null,
};

// async signin request to api; returns jwt;
export const signin = createAsyncThunk(
  "user/signin",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/signin",
        data
      );
      return response.data;
    } catch (err) {
      const normalizedError = normalizeErrorResponse(err);
      return thunkAPI.rejectWithValue(normalizedError);
    }
  }
);

export const signup = createAsyncThunk(
  "user/signup",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/signup",
        data
      );
      return response.data;
    } catch (err) {
      const normalizedError = normalizeErrorResponse(err);
      return thunkAPI.rejectWithValue(normalizedError);
    }
  }
);

export const editUser = createAsyncThunk(
  "user/editUser",
  async (data, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      };
      const response = await axios.put(
        "http://localhost:5001/api/user/updateinfo",
        data,
        { headers }
      );
      return response.data;
    } catch (err) {
      const normalizedError = normalizeErrorResponse(err);
      return thunkAPI.rejectWithValue(normalizedError);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (token, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(
        "http://localhost:5001/api/user/delete",
        { headers }
      );
      return response.data;
    } catch (err) {
      const normalizedError = normalizeErrorResponse(err);
      return thunkAPI.rejectWithValue(normalizedError);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetIsLoggingin: (state) => {
      state.isLoggingIn = false;
    },
    resetIsSigningUp: (state) => {
      state.isSigningUp = false;
    },
    resetIsEditing: (state) => {
      state.isEditing = false;
    },
    signOut: (state) => {
      return initialState;
    },
    signinOauth20: (state, action) => {
      state.isLoggedIn = true;
      state.userName = action.payload.userName;
      state.seasonPass = action.payload.seasonPass
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        // state.token = action.payload.token;
        state.seasonPass = action.payload.seasonPass;
        state.userName = action.payload.userName;
        state.status = "success";
        state.error = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.status = "rejected";
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.seasonPass = action.payload.seasonPass;
        state.userName = action.payload.userName;
        state.status = "fulfilled";
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.status = "rejected";
      })
      .addCase(editUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.seasonPass = action.payload.seasonPass;
        state.userName = action.payload.userName;
        state.status = "fulfilled";
        state.error = null;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, () => {
        return initialState;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  signOut,
  resetIsLoggingin,
  resetIsSigningUp,
  resetIsEditing,
  signinOauth20
} = userSlice.actions;
export default userSlice.reducer;
