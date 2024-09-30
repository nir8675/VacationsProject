import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";
import { VacationModel } from "../Models/VacationModel";
import {
  addVacation,
  deleteVacation,
  updateVacation,
  initUser,
  initVacations,
  logoutUser,
} from "./reducers";

// Application state:
export type AppState = {
  vacations: VacationModel[];
  user: UserModel | null;
  auth: { token: string | null; loading: boolean };
};

// Creating Vacations slice:
const vacationSlice = createSlice({
  name: "vacations", // Internal use
  initialState: [] as VacationModel[],
  reducers: { initVacations, addVacation, deleteVacation, updateVacation },
});

// Create user slice:
const userSlice = createSlice({
  name: "user",
  initialState: null as UserModel | null,
  reducers: { initUser, logoutUser },
});

// Create auth slice:
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    loading: false,
  },
  reducers: {
    loginStart(state) {
      state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // Save token in localStorage
      state.loading = false;
    },
    loginFailure(state) {
      state.loading = false;
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem("token"); // Remove token from localStorage
      state.loading = false;
    },
  },
});

// Export action creators:
export const vacationActions = vacationSlice.actions;
export const userActions = userSlice.actions;
export const authActions = authSlice.actions;

// Main redux object:
export const store = configureStore({
  reducer: {
    vacations: vacationSlice.reducer, // Vacation state.
    user: userSlice.reducer, // User state
    auth: authSlice.reducer, // Auth state
  },
});
