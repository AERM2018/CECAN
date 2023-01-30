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
import { useRouter } from "next/router";
import {
  startGettingRequestById,
  startSupplyingRequest,
} from "store/requests/thunks";
import {
  modifyActiveStorehouseUtilityQty,
  modifyUtilitiesQuantityToSupply,
} from "store/requests/requests.slice";
const SupplyStorehouseRequest: NextPage = () => {
  const dispatch = useAppDispatch();
  const { activeStorehouseRequest, activeRequest } = useAppSelector(
    (state) => state.storehouse
  );
  const router = useRouter();

  useEffect(() => {
    dispatch(startGettingRequestById(activeRequest.id));
  }, []);

  const onSubmitSupplyRequest = (e) => {
    e.preventDefault();
    dispatch(startSupplyingRequest(activeStorehouseRequest));
    router.back();
  };

  if (!activeStorehouseRequest) return <p>Loading</p>;
  const tableElements: ITable = {
    headers: [
      { id: "key", label: "Clave" },
      { id: "details.generic_name", label: "Nombre" },
      { id: "pieces", label: "Cant. solicitada" },
      { id: "last_pieces_supplied", label: "Ultima cant. suminstrada" },
      { id: "pieces_supplied", label: "Cant. a suminstrar" },
    ],
    rows: activeStorehouseRequest.utilities,
    keyName: "key",
    percentages: [15, 25, 15, 15, 15],
    textDisplay: [
      "center",
      "center",
      "center",
      "center",
      "center",
    ] as CanvasTextAlign[],
    elements: ["TEXT", "TEXT", "TEXT", "TEXT", "COUNTER"],
    onClick: (key: string, quantity: number) => {
      console.log("onclick", { key, quantity });
      dispatch(modifyUtilitiesQuantityToSupply({ key, quantity }));
    },
  };
  return (
    <BaseStructure pageName="Surtir solicitud de almácen">
      <div className={styles.container}>
        <div className={styles.container}>
          <div className={styles.recipe_data}>
            <div className={styles.recipe_data_item}>
              <p className={styles.font_bold}>Id de la solicitud: </p>
              <p>{activeStorehouseRequest.id}</p>
            </div>
            <div className={styles.recipe_data_item}>
              <p className={styles.font_bold}>Folio: </p>
              <p>{activeStorehouseRequest.folio}</p>
            </div>
            <div className={styles.recipe_data_item}>
              <p className={styles.font_bold}>Estatus: </p>
              <p>{activeStorehouseRequest.status.name}</p>
            </div>
            <div className={styles.recipe_data_item}>
              <p className={styles.font_bold}>Nombre del solicitante: </p>
              <p>{activeStorehouseRequest.user.full_name}</p>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <Table {...tableElements} />
        </div>
        <div className={styles.contaier}>
          <form onSubmit={onSubmitSupplyRequest}>
            {["Pendiente", "Incompleta"].includes(
              activeStorehouseRequest.status.name
            ) && <SubmitButton text="Suministar receta" />}
          </form>
        </div>
      </div>
    </BaseStructure>
  );
};

export default SupplyStorehouseRequest;
