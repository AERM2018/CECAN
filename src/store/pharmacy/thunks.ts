import cecanApi from "api/cecanApi";
import {
  IPharmacyCatalogResponse,
  IPharmacyDataResponse,
  Medicine,
  Stock,
} from "interfaces/IPharmacy.response.interface";
import { IAddMedicineResponse } from "interfaces/responses/IAddMedicine.response.interface";
import { toast } from "react-hot-toast";
import { Dispatch } from "redux";
import { setPharmacyData, setPharmacyDataLessQty, setPharmacyMedicineCatalogData } from "./pharmacySlice";
import { checkAuthorization } from "../../helpers/checkAuthorization";
import { IMedicineStock } from "../../interfaces/IMedicineStock.interface";
import { IInventory } from "interfaces/IInventoryPharmacy.interface";
import moment from "moment";
import { setMedicines } from "store/recipes/recipesSlice";

export const startGetPharmacyData =
  (filters?: {showLessQty?: boolean, concidence?: string}) => async (dispatch: Dispatch) => {
    const {showLessQty, concidence} = filters || {};
    try {
      let queryParams = "?";
      if(showLessQty) queryParams += "show_less_qty=true&";
      if(concidence != ""){
        const paramsForConcidence = {
          medicine_key: concidence,
          medicine_name: concidence,
        }
        Object.entries(paramsForConcidence).forEach(([key, value]) => {
          queryParams += `${key}=${value}&`;
        })
      }
      const {
        data: { data, ok },
      } = await cecanApi.get<IPharmacyDataResponse>(`/pharmacy_inventory${queryParams}`);
      if (ok) {
          const dataMedicines = data.inventory.map((record) => {
            return {
              lot_number: record.lot_number ? record.lot_number : "",
              key: record.medicine.key,
              name: record.medicine.name,
              pieces_left: record.total_pieces_left ? record.total_pieces_left : record.pieces_left,
              expires_at: record.expires_at ? moment(record.expires_at).format("DD/MM/YYYY") : "",
              semaforization_color: record.semaforization_color ? record.semaforization_color : "",
            } as IMedicineStock;
          })
          dispatch(setPharmacyData(dataMedicines));
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

export const startGetPharmacyCatalog = (concidence?:string) => async (dispatch: Dispatch) => {
  try {
    let queryParams = "?";
    if(concidence != ""){
      const filters ={
        key: concidence,
        name: concidence,
      }
      Object.entries(filters).forEach(([key, value]) => {
        queryParams += `${key}=${value}&`;
      })
    }
    const {
      data: { data, ok },
    } = await cecanApi.get<IPharmacyCatalogResponse>(`/medicines${queryParams}`);
    if (ok) {
      const dataMedicine = data.medicines.map((medicine) => (
          {
            ...medicine, 
            created_at: moment(medicine.created_at).format("DD/MM/YYYY hh:mm A"),
            updated_at: moment(medicine.updated_at).format("DD/MM/YYYY hh:mm A"),
          }   
        )
      )
      dispatch(setPharmacyMedicineCatalogData(dataMedicine));
    } else {
      toast.error("Error al obtener los datos del catálogo de farmacia");
      console.log(data);
    }
  } catch (error) {
    checkAuthorization(error.response.status);
    console.log(error);
  }
}