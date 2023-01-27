import { useEffect } from "react";
import { BaseStructure, Input, SubmitButton, Table } from "components";
import { ITable } from "../../interfaces/ITable.interface";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { NextPage } from "next";
import styles from "styles/modules/SupplyRecipe.module.scss";
import {
  startGenerateRecipe,
  startGettingRecipeById,
  startSupplyingARecipie,
} from "store/recipes/thunks";
import {
  modifyActiveMedicinesQuantity,
  modifyMedicinesQuantityToSupply,
} from "store/recipes/recipesSlice";
const SupplyRecipe: NextPage = () => {
  const dispatch = useAppDispatch();
  const { activePrescription } = useAppSelector((state) => state.historial);
  const { activeRecipe } = useAppSelector((state) => state.recipes);

  useEffect(() => {
    console.log({ activePrescription });
    dispatch(startGettingRecipeById(activePrescription.id));
  }, []);

  if (!activeRecipe) return <p>Loading</p>;
  const tableElements: ITable = {
    headers: [
      { id: "details.key", label: "Clave" },
      { id: "details.name", label: "Nombre" },
      { id: "pieces", label: "Cantidad solicitada" },
      { id: "pieces_supplied", label: "Cantidad suminstrada" },
    ],
    rows: activeRecipe.medicines,
    keyName: "medicine_key",
    percentages: [15, 30, 20, 20],
    textDisplay: ["center", "center", "center", "center"] as CanvasTextAlign[],
    elements: ["TEXT", "TEXT", "TEXT", "COUNTER"],
    onClick: (key: string, quantity: number) => {
      console.log({ key, quantity });
      dispatch(modifyMedicinesQuantityToSupply({ key, quantity }));
    },
  };
  console.log({ a: activeRecipe.medicines });
  return (
    <BaseStructure pageName="Surtir receta">
      <div className={styles.container}>
        <div className={styles.container}>
          <div className={styles.recipe_data}>
            <div className={styles.recipe_data_item}>
              <p className={styles.font_bold}>Id de receta: </p>
              <p>{activeRecipe.id}</p>
            </div>
            <div className={styles.recipe_data_item}>
              <p className={styles.font_bold}>Folio: </p>
              <p>{activeRecipe.folio}</p>
            </div>
            <div className={styles.recipe_data_item}>
              <p className={styles.font_bold}>Nombre del paciente: </p>
              <p>{activeRecipe.patient_name}</p>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <Table {...tableElements} />
        </div>
        <div className={styles.contaier}>
          <Formik
            initialValues={{
              observations: "",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(
                startSupplyingARecipie(
                  activePrescription.id,
                  activeRecipe,
                  values.observations
                )
              );
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Input
                  name="observations"
                  placeholder="Observaciones (opcionales)"
                  type="text"
                />
                <SubmitButton
                  isBlocked={
                    activeRecipe.prescription_status.name != "Pendiente"
                  }
                  text="Suministar receta"
                />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </BaseStructure>
  );
};

export default SupplyRecipe;
