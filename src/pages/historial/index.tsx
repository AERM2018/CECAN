import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styles from "styles/modules/GenerateRecipe.module.scss";
import { Searcher, Sidebar, TitleScreen, TopBar } from "components";
import { Table } from "../../components/table/Table";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  setActivePrescriptionHistory,
  deletePrescription,
} from "store/historial/historialSlice";
import { ITable } from "../../interfaces/ITable.interface";
import {
  startDeletePrescription,
  startDownloadRecipe,
  startFilterPrescriptionHistory,
  startGetHistorialPrescriptions,
} from "store/recipes/thunks";
import { CircularProgress, Modal } from "@mui/material";
import { useSession } from "next-auth/react";

const Historial: NextPage = () => {
  const { prescriptions, activePrescription } = useAppSelector(
    (state) => state.historial
  );
  let { isLoading } = useAppSelector(
    (state) => state.ui
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [folio, setfolio] = useState("");

  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (!prescriptions || folio == "") {
      if (status == "authenticated") {
        dispatch(
          startGetHistorialPrescriptions(
            !["Farmacia", "Admin"].includes(data.user.user.role.name)
              ? data.user.user.id
              : ""
          )
        );
      }
    }
  }, [dispatch, folio, status]);

  const tableElements: ITable = {
    headers: [
      { id: "folio", label: "Folio" },
      { id: "id", label: "ID" },
      { id: "patient_name", label: "Nombre del paciente" },
      { id: "status", label: "Estatus" },
      { id: "actions", label: "Acciones" },
    ],
    keyName: "id",
    rows: prescriptions,
    percentages: [5, 20, 40, 15, 20],
    elements: ["TEXT", "TEXT", "TEXT", "TEXT", "ACTIONS-P-E-D"],
    textDisplay: ["center", "center", "center", "center", "center"],
    onClick: (id: string) => {
      dispatch(startDownloadRecipe(id));
    },
    onClick2: (id: string) => {
      // Edit prescription
      dispatch(setActivePrescriptionHistory(id));
      router.push("/supplyRecipe");
    },
    onClick3: (id: string) => {
      dispatch(startDeletePrescription(id));
    },
  };

  const onFolioChange = (e) => {
    e.preventDefault();
    setfolio(e.target.value);
  };

  const onSubmitFolio = (e) => {
    e.preventDefault();
    dispatch(startFilterPrescriptionHistory(folio, prescriptions));
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <TitleScreen title="Historial de recetas" />
      <div className={styles.content}>
        <Sidebar />
        <div className={styles.content_col}>
          <div className={styles.content}>
            <Searcher
              placeholder="Busca el folio de la receta"
              onChangeSearchValue={onFolioChange}
              onSubmitSearch={onSubmitFolio}
              value={folio}
            />
          </div>
          {isLoading && <div className={styles.circularProgress}><CircularProgress /></div>}
          {!isLoading && 
            <>
            <Table {...tableElements} />
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default Historial;
