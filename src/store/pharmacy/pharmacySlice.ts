import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Medicine } from "interfaces/IPharmacy.response.interface";
import { ITable } from "interfaces/ITable.interface";
import { dataPharmacy } from "resources/data";
import {
  IMedicineStock,
  IMedicineTotalStock,
} from "../../interfaces/IMedicineStock.interface";
export interface IPharmacyState {
  loading: boolean;
  pharmacyData: IMedicineStock[] | null;
  pharmacyDataLessQty: IMedicineTotalStock[] | null;
  pharmacyMedicineCatalogData: Medicine[] | null;
  pages: number;
}

const initialState: IPharmacyState = {
  pharmacyData: null,
  pharmacyDataLessQty: null,
  pharmacyMedicineCatalogData: null,
  loading: false,
  pages: 1,
};

export const pharmacySlice = createSlice({
  name: "pharmacy",
  initialState,
  reducers: {
    setPharmacyData: (state, action: PayloadAction<IMedicineStock[]>) => {
      state.pharmacyData = action.payload;
    },
    setPharmacyDataLessQty: (
      state,
      action: PayloadAction<IMedicineTotalStock[]>
    ) => {
      state.pharmacyDataLessQty = action.payload;
    },
    setPharmacyMedicineCatalogData: ( state,
      action: PayloadAction<Medicine[]>) => {
        state.pharmacyMedicineCatalogData = action.payload;
    },
    setPharmacyCatalogPages: (state, action: PayloadAction<number>) => {
      state.pages = action.payload;
    },
     setPharmacyInventoryPages: (state, action: PayloadAction<number>) => {
      state.pages = action.payload;
    }
  },
  extraReducers: (builder) => {},
});

export const { setPharmacyData, setPharmacyDataLessQty, setPharmacyMedicineCatalogData,setPharmacyCatalogPages,setPharmacyInventoryPages } =
  pharmacySlice.actions;
