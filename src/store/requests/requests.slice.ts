import {
  createAsyncThunk,
  createSlice,
  Dispatch,
  PayloadAction,
} from "@reduxjs/toolkit";
import { StorehouseUtility } from "interfaces/IAlmacenListaResponse.response.interface";
import {
  IMedicine,
  IMedicineCatalog,
} from "interfaces/IMedicineStock.interface";
import {
  Request,
  RequestWithUtilities,
} from "interfaces/IRequestStore.response.interface";
import { ITable } from "interfaces/ITable.interface";
import { dataPharmacy } from "resources/data";
import {
  IAlmacen,
  IAlmacenStore,
  IStorehouseRequest,
  IStorehouseRequestUtility,
  IStorehouseUtility,
} from "../../interfaces/IAlmacen.interface";

export interface IRequestsState {
  requests: IAlmacen[] | null;
  activeRequest: IAlmacen | null;
  activeStorehouseRequest: RequestWithUtilities | null;
  inventory: IAlmacenStore[] | null;
  inventoryLessQty: IAlmacenStore[] | null;
  activeStorehouseUtilities: IAlmacenStore[] | null;
  units: IStorehouseUtility[] | null;
  categories: IStorehouseUtility[] | null;
  presentations: IStorehouseUtility[] | null;
  storehouseCatalog: StorehouseUtility[] | null;
  loading: boolean;
  pages: number;
}

const initialState: IRequestsState = {
  requests: null,
  activeRequest: null,
  activeStorehouseRequest: null,
  inventory: null,
  inventoryLessQty: null,
  activeStorehouseUtilities: null,
  units: null,
  categories: null,
  presentations: null,
  storehouseCatalog: null,
  loading: false,
  pages: 1,
};

export const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<IAlmacen[]>) => {
      state.requests = action.payload;
    },
    setActiveRequest: (state, action: PayloadAction<IAlmacen>) => {
      state.activeRequest = action.payload;
    },
    setInventory: (state, action: PayloadAction<IAlmacenStore[]>) => {
      state.inventory = action.payload;
    },
    setInventoryLessQty: (state, action: PayloadAction<IAlmacenStore[]>) => {
      state.inventoryLessQty = action.payload;
    },
    setUnits: (state, action: PayloadAction<IStorehouseUtility[]>) => {
      state.units = action.payload;
    },
    setCategories: (state, action: PayloadAction<IStorehouseUtility[]>) => {
      state.categories = action.payload;
    },
    setPresentations: (state, action: PayloadAction<IStorehouseUtility[]>) => {
      state.presentations = action.payload;
    },
    setActiveStorehouseUtilities: (
      state,
      action: PayloadAction<IAlmacenStore>
    ) => {
      state.activeStorehouseUtilities = [
        ...state.activeStorehouseUtilities,
        action.payload,
      ];
    },
    modifyActiveStorehouseUtilityQty: (
      state,
      action: PayloadAction<{ key: string; quantity: number }>
    ) => {
      const { key, quantity } = action.payload;
      const utility = state.activeStorehouseUtilities?.find(
        (utility) => utility.key === key
      );
      if (utility) {
        utility.quantity = quantity;

        if (utility.quantity <= 0 && state.activeStorehouseUtilities) {
          state.activeStorehouseUtilities =
            state.activeStorehouseUtilities.filter(
              (medicine) => medicine.key !== key
            );
        }
      }
    },
    removeActiveStorehouseUtility: (state, action: PayloadAction<string>) => {
      state.activeStorehouseUtilities = state.activeStorehouseUtilities.filter(
        (utility) => utility.key != action.payload
      );
    },
    addActiveStorehouseUtility: (
      state,
      action: PayloadAction<IAlmacenStore>
    ) => {
      const medicineAlreadyInRecipe = state.activeStorehouseUtilities?.find(
        (medicine) => medicine.key === action.payload.key
      );
      if (medicineAlreadyInRecipe) {
        medicineAlreadyInRecipe.quantity += 1;
      } else {
        state.activeStorehouseUtilities
          ? state.activeStorehouseUtilities.push({
              key: action.payload.key,
              generic_name: action.payload.generic_name,
              quantity: 1,
            })
          : (state.activeStorehouseUtilities = [
              {
                key: action.payload.key,
                generic_name: action.payload.generic_name,
                quantity: 1,
              },
            ]);
      }
    },
    clearActiveStorehouseUtilities: (state, action: PayloadAction) => {
      state.activeStorehouseUtilities = null;
    },
    removeStorehouseRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((req) => req.id != action.payload);
    },
    setActiveStorehouseRequest: (
      state,
      action: PayloadAction<RequestWithUtilities>
    ) => {
      state.activeStorehouseRequest = action.payload;
    },
    modifyUtilitiesQuantityToSupply: (
      state,
      action: PayloadAction<{ key: string; quantity: number }>
    ) => {
      const { key, quantity } = action.payload;
      const utility = state.activeStorehouseRequest.utilities.find(
        (utility) => utility.key === key
      );
      if (utility) {
        if (quantity >= 0 && quantity <= utility.pieces) {
          utility.pieces_supplied = quantity;
        }
      } else {
      }
    },

    addActiveStorehouseUtilities: (
      state,
      action: PayloadAction<IAlmacenStore>
    ) => {
      const medicineAlreadyInRecipe = state.activeStorehouseUtilities?.find(
        (medicine) => medicine.key === action.payload.key
      );
      if (medicineAlreadyInRecipe) {
        medicineAlreadyInRecipe.quantity += 1;
      } else {
        state.activeStorehouseUtilities
          ? state.activeStorehouseUtilities.push({
              key: action.payload.key,
              generic_name: action.payload.generic_name,
              quantity: 1,
            })
          : (state.activeStorehouseUtilities = [
              {
                key: action.payload.key,
                generic_name: action.payload.generic_name,
                quantity: 1,
              },
            ]);
      }
    },
    findRequestByFolio: (state, action: PayloadAction<string>) => {
      const request = state.requests.find(
        (req) => req.folio.toString() == action.payload
      );
      state.requests = [];
      if (request) {
        state.requests = [request];
      }
    },
    setStorehouseCatalogData: ( state, action: PayloadAction<StorehouseUtility[]> ) => {
      state.storehouseCatalog = action.payload;
    },
    setCatalogPages: (state, action: PayloadAction<number>) => {
      state.pages = action.payload;
    },
    setInventoryPages: (state, action: PayloadAction<number>) => {
      state.pages = action.payload;
    }
  },
  extraReducers: (builder) => {},
});

export const {
  setActiveRequest,
  setRequests,
  setInventory,
  setUnits,
  setCategories,
  setPresentations,
  modifyActiveStorehouseUtilityQty,
  removeActiveStorehouseUtility,
  addActiveStorehouseUtility,
  clearActiveStorehouseUtilities,
  removeStorehouseRequest,
  setActiveStorehouseRequest,
  modifyUtilitiesQuantityToSupply,
  setInventoryLessQty,
  findRequestByFolio,
  setStorehouseCatalogData,
  setCatalogPages,
  setInventoryPages
} = requestsSlice.actions;
