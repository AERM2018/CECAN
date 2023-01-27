import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IMedicine,
  IMedicineCatalog,
} from "interfaces/IMedicineStock.interface";
import {
  IPrescription,
  IPrescriptionToSupply,
} from "interfaces/IPrescription.interface";
import { ITable } from "interfaces/ITable.interface";
export interface IPharmacyState {
  medicines: IMedicineCatalog[] | null;
  activeMedicines: IMedicine[] | null;
  activeIndication: string | null;
  loading: boolean;
}

const initialState: IPharmacyState = {
  medicines: null,
  activeMedicines: null,
  activeIndication: null,
  loading: false,
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setMedicines: (state, action: PayloadAction<IMedicineCatalog[]>) => {
      state.medicines = action.payload;
    },
    setActiveMedicines: (state, action: PayloadAction<IMedicine[]>) => {
      state.activeMedicines = action.payload;
    },
    setActiveIndication: (state, action: PayloadAction<string>) => {
      state.activeIndication = action.payload;
    },
    removeActiveMedicine: (state, action: PayloadAction<string>) => {
      state.activeMedicines = state.activeMedicines!.filter(
        (medicine) => medicine.key !== action.payload
      );
    },

    modifyActiveMedicinesQuantity: (
      state,
      action: PayloadAction<{ key: string; quantity: number }>
    ) => {
      const { key, quantity } = action.payload;
      const medicine = state.activeMedicines?.find(
        (medicine) => medicine.key === key
      );
      if (medicine) {
        medicine.quantity = quantity;

        if (medicine.quantity <= 0 && state.activeMedicines) {
          state.activeMedicines = state.activeMedicines.filter(
            (medicine) => medicine.key !== key
          );
        }
      }
    },

    modifyMedicinesQuantityToSupply: (
      state,
      action: PayloadAction<{ key: string; quantity: number }>
    ) => {
      const { key, quantity } = action.payload;
      const medicine = state.activeRecipe.medicines.find(
        (medicine) => medicine.medicine_key === key
      );
      if (medicine) {
        if (quantity >= 0 && quantity <= medicine.pieces) {
          medicine.pieces_supplied = quantity;
        }
      }
    },

    addActiveMedicine: (state, action: PayloadAction<IMedicineCatalog>) => {
      const medicineAlreadyInRecipe = state.activeMedicines?.find(
        (medicine) => medicine.key === action.payload.key
      );
      if (medicineAlreadyInRecipe) {
        medicineAlreadyInRecipe.quantity += 1;
      } else {
        state.activeMedicines
          ? state.activeMedicines.push({
              key: action.payload.key,
              name: action.payload.name,
              quantity: 1,
            })
          : (state.activeMedicines = [
              {
                key: action.payload.key,
                name: action.payload.name,
                quantity: 1,
              },
            ]);
      }
    },
    setActiveRecipe: (state, action: PayloadAction<IPrescriptionToSupply>) => {
      state.activeRecipe = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setMedicines,
  setActiveMedicines,
  setActiveIndication,
  modifyActiveMedicinesQuantity,
  modifyMedicinesQuantityToSupply,
  addActiveMedicine,
  removeActiveMedicine,
  setActiveRecipe,
} = recipesSlice.actions;
