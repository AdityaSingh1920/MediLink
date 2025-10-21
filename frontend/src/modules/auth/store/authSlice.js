import { createSlice } from "@reduxjs/toolkit";

// Load persisted data from localStorage
const accessToken = localStorage.getItem("accessToken");
const userInfoString = localStorage.getItem("userInfo");

let userInfo = null;
try {
  userInfo = userInfoString ? JSON.parse(userInfoString) : null;
} catch (error) {
  console.error("Failed to parse userInfo:", error);
  localStorage.removeItem("userInfo");
}

const initialState = {
  authLoading: false,
  userInfo: userInfo || null,
  accessToken: accessToken || null,
  isAuthenticated: !!(accessToken && userInfo),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userInfo = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.authLoading = false;

    
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
    },

    // Update token after refresh
    refreshTokenSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },

    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },

    logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.authLoading = false;

      // Clear storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
    },

    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
  },
});

export const {
  loginSuccess,
  refreshTokenSuccess,
  setAuthLoading,
  logout,
  updateUserInfo,
} = authSlice.actions;

export default authSlice.reducer;