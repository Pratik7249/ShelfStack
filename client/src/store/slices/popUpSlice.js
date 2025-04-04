import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    issettingPopup: false,
    addBookPopup: false,
    readBookPopup: false,
    recordBookPopup: false,
    returnBookPopup: false,
    addNewAdminPopup: false,
  },
  reducers: {
    toggleSettingPopup(state) {
      state.issettingPopup = !state.issettingPopup; // ✅ Fixed
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },
    toggleRecordBookPopup(state) {
      state.recordBookPopup = !state.recordBookPopup;
    },
    toggleReturnBookPopup(state) {
      state.returnBookPopup = !state.returnBookPopup;
    },
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    closeAllPopup(state) {
      return {
        ...state,
        issettingPopup: false,
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        returnBookPopup: false,
        addNewAdminPopup: false,
      };
    },
  },
});

export const {
  toggleSettingPopup,
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleAddNewAdminPopup,
  closeAllPopup,
} = popupSlice.actions;

export default popupSlice.reducer;
