import cecanApi, { cecanApiPDF, getToken } from "api/cecanApi";
import { Dispatch } from "redux";
import {
  IPrescription,
  IPrescriptionToSupply,
} from "../../interfaces/IPrescription.interface";
import download from "downloadjs";
import { setMedicines } from "./recipesSlice";
import { IMedicinesResponse } from "../../interfaces/IMedicinesResponse.response.interface";
import { toast } from "react-hot-toast";
import {
  IPrescriptionResponse,
  IPrescriptionWithMedicinesResponse,
  PrescriptionData,
} from "../../interfaces/IPrescriptionsResponse.response.interface";
import { Headers } from "../../components/table/Headers";
import {
  deletePrescription,
  setPrescriptionHistory,
} from "store/historial/historialSlice";
import { setActiveRecipe } from "store/recipes/recipesSlice";
import { URL } from "url";

export const startGenerateRecipe =
  ({ patient_name, instructions, observations, medicines }: IPrescription) =>
  async (dispatch: Dispatch) => {
    const res = await fetch(`${process.env.API_BASE_URL}/prescriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_name,
        instructions,
        observations,
        medicines: medicines.map((medicine) => ({
          medicine_key: medicine.key,
          pieces: medicine.quantity,
        })),
      }),
    });

    const blob = await res.blob();

    download(blob, "recipe.pdf", "application/pdf");
  };

export const startDownloadRecipe =
  (id: string) => async (dispatch: Dispatch) => {
    const res = await fetch(
      `${process.env.API_BASE_URL}/prescriptions/${id}?pdf=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    const blob = await res.blob();

    download(blob, "recipe.pdf", "application/pdf");
  };

export const startGettingRecipeById =
  (id: string) => async (dispatch: Dispatch) => {
    const {
      data: { data, ok },
    } = await cecanApi.get<IPrescriptionWithMedicinesResponse>(
      `/prescriptions/${id}`
    );
    data.prescription.medicines = data.prescription.medicines.map(
      (medicine) => ({ ...medicine, pieces_supplied: 0 })
    );
    dispatch(setActiveRecipe(data.prescription));
  };

export const startSupplyingARecipie =
  (id: string, recipie: IPrescriptionToSupply, observations: string) =>
  async (dispatch: Dispatch) => {
    try {
      const {
        data: { data, ok },
      } = await cecanApi.put<IPrescriptionWithMedicinesResponse>(
        `/prescriptions/${id}/complete`,
        JSON.stringify({
          medicines: recipie.medicines.map((medicine) => ({
            medicine_key: medicine.medicine_key,
            pieces_supplied: medicine.pieces_supplied,
          })),
          observations,
        })
      );
      if (ok) {
        toast.success("Receta suministrada correctamente.");
      } else {
        toast.error("Error al obtener los medicamentos, intente de nuevo");
      }
      dispatch(setActiveRecipe(data.prescription));
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

export const startGetMedicines = (concidence?:string) => async (dispatch: Dispatch) => {
  const filters = {
    "name": concidence,
    "key": concidence,
  }
  const queryParams = concidence && concidence != "" ? Object.keys(filters).map(key => key + '=' + filters[key]).join('&') : "";
  const {
    data: { data, ok },
  } = await cecanApi.get<IMedicinesResponse>(`/medicines?${queryParams}`);

  if (ok) {
    dispatch(setMedicines(data.medicines));
  } else {
    toast.error("Error al obtener los medicamentos, intente de nuevo");
  }
};

export const startGetHistorialPrescriptions =
  (id?: string) => async (dispatch: Dispatch) => {
    const {
      data: { data, ok },
    } = await cecanApi.get<IPrescriptionResponse>(
      `/prescriptions${id === "" ? "" : `?user_id=${id}`}`
    );

    if (ok) {
      dispatch(
        setPrescriptionHistory(
          data.prescriptions.map((prescription) => ({
            folio: prescription.folio,
            id: prescription.id,
            patient_name: prescription.patient_name,
            observations: prescription.observations,
            instructions: prescription.instructions,
            status: prescription.prescription_status.name,
          }))
        )
      );
    } else {
      toast.error("Error al obtener los medicamentos, intente de nuevo");
    }
  };

export const startFilterPrescriptionHistory =
  (folio: string, prescriptions: any) => async (dispatch: Dispatch) => {
    dispatch(
      setPrescriptionHistory(
        prescriptions.filter((prescription) => prescription.folio == folio)
      )
    );
  };

export const startDeletePrescription =
  (id: string) => async (dispatch: Dispatch) => {
    try {
      const data = await cecanApi.delete(`/prescriptions/${id}`);

      if (data.status === 204) {
        dispatch(deletePrescription(id));
        toast.success("Receta eliminada correctamente");
      } else {
        toast.error("Ocurrio un error, intentelo más tarde.");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };
