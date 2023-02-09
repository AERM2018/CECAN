import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUiState {
  isModalOpen: boolean;
  isLoading: boolean;
}

const initialState: IUiState = {
  isModalOpen: false,
  isLoading: true,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
});

export const { toggleModal,setLoading } = uiSlice.actions;
