import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { normalizeErrorResponse } from "../utilities/errorUtils";
const baseURl = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  googleAuth: false,
  isLoggedIn: false,
  isLoggingIn: false,
  isSigningUp: false,
  isEditing: false,
  seasonPass: null,
  userName: null,
  showSignInModal: false,
  showSignUpModal: false,
  showSettingsModal: false,
  showDeleteUserModal: false,
};

// async signin request to api; returns jwt;
export const signin = createAsyncThunk(
  "user/signin",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURl}/api/auth/signin`,
        data,
        {
          withCredentials: true // include cookie
        }
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
        `${baseURl}/api/auth/signup`,
        data,
        {
          withCredentials: true // include cookie
        }
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
      const response = await axios.put(
        `${baseURl}/api/user/updateinfo`,
        data,
        {
          withCredentials: true // include cookie
        }
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
  async ( thunkAPI ) => {
    try {
      const response = await axios.delete(
        `${baseURl}/api/user/delete`,
        {
          withCredentials: true // include cookie
        }
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
      state.googleAuth = true;
      state.userName = action.payload.userName;
      state.seasonPass = action.payload.seasonPass;
    },
    openSingInModal: (state) => {
      state.showSignInModal = true;
    },
    closeSignInModal: (state) => {
      state.showSignInModal = false;
    },
    openSignUpModal: (state) => {
      state.showSignUpModal = true;
    },
    closeSignUpModal: (state) => {
      state.showSignUpModal = false;
    },
    openSettingsModal: (state) => {
      state.showSettingsModal = true;
    },
    closeSettingsModal: (state) => {
      state.showSettingsModal = false;
    },
    openDeleteUserModal: (state) => {
      state.showDeleteUserModal = true;
    },
    closeDeleteUserModal: (state) => {
      state.showDeleteUserModal = false;
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
    
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
  signinOauth20,
  openSignUpModal,
  closeSignUpModal,
  openSingInModal,
  closeSignInModal,
  openSettingsModal,
  closeSettingsModal,
  openDeleteUserModal,
  closeDeleteUserModal
} = userSlice.actions;
export default userSlice.reducer;
