import cecanApi, { cecanApiPDF } from "api/cecanApi";
import { Dispatch } from "redux";
import {
  IPrescription,
  IPrescriptionToSupply,
} from "../../interfaces/IPrescription.interface";
import download from "downloadjs";
import { setMedicines } from "./recipesSlice";
import { IMedicinesResponse } from "../../interfaces/IMedicinesResponse.response.interface";
import { toast } from "react-hot-toast";
import { IPrescriptionResponse } from "../../interfaces/IPrescriptionsResponse.response.interface";
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
    const res = await fetch("https://staging-app.site/api/v1/prescriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      `https://staging-app.site/api/v1/prescriptions/${id}?pdf=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const blob = await res.blob();

    download(blob, "recipe.pdf", "application/pdf");
  };

export const startGettingRecipeById =
  (id: string) => async (dispatch: Dispatch) => {
    const response = await fetch(
      `https://staging-app.site/api/v1/prescriptions/${id}?`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    console.log(res.data.prescription);
    dispatch(setActiveRecipe(res.data.prescription));
  };

export const startSupplyingARecipie =
  (id: string, recipie: IPrescriptionToSupply, observations: string) =>
  async (dispatch: Dispatch) => {
    const response = await fetch(
      `https://staging-app.site/api/v1/prescriptions/${id}/complete`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicines: recipie.medicines.map((medicine) => ({
            medicine_key: medicine.medicine_key,
            pieces_supplied: medicine.pieces_supplied,
          })),
          observations,
        }),
      }
    );
    const res = await response.json();
    const { ok } = res;
    if (ok) {
      toast.success("Receta suministrada correctamente.");
    } else {
      toast.error("Error al obtener los medicamentos, intente de nuevo");
    }
    console.log(res.data.prescription);
    dispatch(setActiveRecipe(res.data.prescription));
  };

export const startGetMedicines = () => async (dispatch: Dispatch) => {
  const {
    data: { data, ok },
  } = await cecanApi.get<IMedicinesResponse>("/medicines");

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
