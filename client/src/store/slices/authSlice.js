import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define base API URL
const API_URL = "http://localhost:5000/api/v1";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    error: null,
    message: null,
    loading: false,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    optVerificationRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    optVerificationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    optVerificationFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    logoutRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailed(state, action) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearState(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
    }
  },
});

export const { registerRequest, registerSuccess, registerFailure, optVerificationRequest, optVerificationSuccess, optVerificationFailed, loginRequest, loginSuccess, loginFailed, logoutRequest, logoutSuccess, logoutFailed, getUserRequest, getUserSuccess, getUserFailed, forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailed, resetPasswordRequest, resetPasswordSuccess, resetPasswordFailed, updatePasswordRequest, updatePasswordSuccess, updatePasswordFailed, clearState } = authSlice.actions;

export const registerUser = (data) => async (dispatch) => {
  dispatch(authSlice.actions.registerRequest());
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(authSlice.actions.registerSuccess(res.data));
  } catch (error) {
    dispatch(authSlice.actions.registerFailure(error.response.data.message)); 
  }
};

export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(authSlice.actions.optVerificationRequest());
  try {
    const res = await axios.post(`${API_URL}/auth/verify-otp`, {email, otp}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(authSlice.actions.optVerificationSuccess(res.data));
  } catch (error) {
    dispatch(authSlice.actions.optVerificationFailed(error.response.data.message)); 
  }
};

export const loginUser = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  try {
    const res = await axios.post(`${API_URL}/auth/login`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(authSlice.actions.loginSuccess(res.data));
  } catch (error) {
    dispatch(authSlice.actions.loginFailed(error.response.data.message)); 
  }
};

export const logoutUser = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    const res = await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true,
    });
    dispatch(authSlice.actions.logoutSuccess(res.data.message));
    dispatch(authSlice.actions.clearState());
  } catch (error) {
    dispatch(authSlice.actions.logoutFailed(error.response.data.message)); 
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    const res = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true,
    });
    dispatch(authSlice.actions.getUserSuccess(res.data));
  } catch (error) {
    dispatch(authSlice.actions.getUserFailed(error.response.data.message)); 
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  try {
    const res = await axios.post(`${API_URL}/auth/password/forgot`, {email}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(authSlice.actions.forgotPasswordSuccess(res.data));
  } catch (error) {
    dispatch(authSlice.actions.forgotPasswordFailed(error.response.data.message)); 
  }
};

export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());
  try {
    const res = await axios.put(
      `${API_URL}/auth/password/reset/${token}`, 
      data, 
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    dispatch(authSlice.actions.resetPasswordSuccess(res.data));
  } catch (error) {
    dispatch(authSlice.actions.resetPasswordFailed(error.response?.data?.message || "Something went wrong"));
  }
};


export const updatePassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  try {
    const res = await axios.put(`${API_URL}/auth/password/update`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
  } catch (error) {
    dispatch(authSlice.actions.updatePasswordFailed(error.response.data.message));
  }
};

export const clearAuthState = () => (dispatch) => {
  dispatch(authSlice.actions.clearState());
};

export default authSlice.reducer;
