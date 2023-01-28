import cecanApi from "api/cecanApi";
import {
  IPharmacyDataResponse,
  Stock,
} from "interfaces/IPharmacy.response.interface";
import { IAddMedicineResponse } from "interfaces/responses/IAddMedicine.response.interface";
import { toast } from "react-hot-toast";
import { Dispatch } from "redux";
import { setPharmacyData, setPharmacyDataLessQty } from "./pharmacySlice";
import { checkAuthorization } from "../../helpers/checkAuthorization";
import { IMedicineStock } from "../../interfaces/IMedicineStock.interface";
import { IInventory } from "interfaces/IInventoryPharmacy.interface";
import moment from "moment";
import { setMedicines } from "store/recipes/recipesSlice";

export const startGetPharmacyData =
  (showLessQty?: boolean) => async (dispatch: Dispatch) => {
    try {
      const {
        data: { data, ok },
      } = await cecanApi.get<IPharmacyDataResponse>("/pharmacy_inventory");
      if (ok) {
        console.log(data.inventory);
        if (data.inventory === null) {
          toast.error("No hay inventario disponible");
        } else {
          if (showLessQty) {
            const dataMedicinesLessQty = data.inventory
              .map((invetoryRecord) => {
                const { stocks, pieces_left_by_semaforization_color, ...rest } =
                  invetoryRecord;
                return {
                  key: rest.medicine.key,
                  name: rest.medicine.name,
                  pieces_left: rest.total_pieces_left,
                };
              })
              .filter((inventoryRecord) => inventoryRecord.pieces_left <= 100);
            dispatch(setPharmacyDataLessQty(dataMedicinesLessQty));
            return;
          }
          const dataMedicines = [];
          data.inventory.forEach((medicine: IInventory) => {
            if (medicine.stocks.length > 0) {
              medicine.stocks.map((stock: Stock) => {
                const medicineStock: IMedicineStock = {
                  key: medicine.medicine.key,
                  id: medicine.medicine.key,
                  name: medicine.medicine.name,
                  lot_number: stock.lot_number,
                  pieces_left: stock.pieces_left,
                  expires_at: moment(stock.expires_at).format("DD/MM/YYYY"),
                };
                dataMedicines.push(medicineStock);
              });
            } else {
              const medicineStock: IMedicineStock = {
                key: medicine.medicine.key,
                id: medicine.medicine.key,
                name: medicine.medicine.name,
                lot_number: "No definido",
                pieces_left: 0,
                expires_at: "No definido",
              };
              dataMedicines.push(medicineStock);
            }
          });
          dispatch(setPharmacyData(dataMedicines));
        }
      } else {
        toast.error("Error al obtener los datos de la farmacia");
        console.log(data);
      }
    } catch (error) {
      checkAuthorization(error.response.status);
      console.log(error);
    }
  };
export const startFilterMedicine =
  (concidence: string, medicines: IMedicineStock[], from: string) =>
  async (dispatch: Dispatch) => {
    concidence = concidence.toLocaleLowerCase();
    medicines = medicines.filter((medicine: IMedicineStock) =>
      concidence != ""
        ? medicine.key.toLocaleLowerCase().includes(concidence) ||
          medicine.name.toLocaleLowerCase().includes(concidence)
        : true
    );
    switch (from) {
      case "catalog":
        dispatch(setPharmacyData(medicines));
        break;
      case "generatePrescription":
        dispatch(setMedicines(medicines));
        break;
      case "catalogLessQty":
        dispatch(setPharmacyDataLessQty(medicines));
        break;
      default:
        break;
    }
  };

export const startAddAMedicine =
  ({ key, name }, resetForm: Function) =>
  async (dispatch: Dispatch) => {
    try {
      const {
        data: { data, ok },
        status,
      } = await cecanApi.post<IAddMedicineResponse>("/medicines", {
        key,
        name,
      });

      if (status === 201) {
        toast.success("Medicina agregada correctamente");
        resetForm();
      } else {
        toast.error("Error al agregar la medicina");
      }
    } catch (error) {
      checkAuthorization(error.response.status);
      console.log(error);
    }
  };

export const startAddStock =
  ({ key, lot_number, expires_at, pieces }, resetForm: Function) =>
  async (dispatch: Dispatch) => {
    console.log(lot_number);
    try {
      const {
        data: { data, ok },
        status,
      } = await cecanApi.post<IAddMedicineResponse>(
        `/medicines/${key}/pharmacy_inventory`,
        {
          key,
          lot_number,
          expires_at: moment.utc(expires_at),
          pieces: parseInt(pieces),
        }
      );

      if (status === 201) {
        console.log(data);
        toast.success("Medicina agregada correctamente");
        resetForm();
      } else {
        toast.error("Error al agregar la medicina");
      }
    } catch (error) {
      checkAuthorization(error.response.status);
      console.log(error);
    }
  };
