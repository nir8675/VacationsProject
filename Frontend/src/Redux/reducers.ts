import { Action, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";
import { VacationModel } from "../Models/VacationModel";

// Init all Vacations
export function initVacations(
  currentState: VacationModel[],
  action: PayloadAction<VacationModel[]>
) {
  const newState: VacationModel[] = action.payload; // Here, action.payload is all Vacations to init.
  return newState;
}

// Add Vacation:
export function addVacation(
  currentState: VacationModel[],
  action: PayloadAction<VacationModel>
) {
  const newState: VacationModel[] = [...currentState];
  newState.push(action.payload); // Here, action.payload is a Vacation to add.
  return newState.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

// Update Vacation:
export function updateVacation(
  currentState: VacationModel[],
  action: PayloadAction<VacationModel>
) {
  const newState: VacationModel[] = [...currentState];
  const index = newState.findIndex((v) => v.id === action.payload.id);
  if (index !== -1) {
    newState[index] = action.payload; // Update the vacation details with the new data
  }
  return newState;
}


// Delete Vacation:
export function deleteVacation(
  currentState: VacationModel[],
  action: PayloadAction<number>
) {
  const newState: VacationModel[] = [...currentState];
  const index = newState.findIndex((v) => v.id === action.payload);
  if (index !== -1) {
    newState.splice(index, 1);
  }
  return newState;
}

// Initialize User:
export function initUser(
  currentState: UserModel,
  action: PayloadAction<UserModel>
) {
  const newState: UserModel = action.payload;
  return newState;
}

// Logout User:
export function logoutUser(currentState: UserModel, action: Action) {
  const newState: UserModel = null;
  return newState;
}
