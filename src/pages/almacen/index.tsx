import React, { useEffect } from "react";
import { NextPage } from "next";
import styles from "styles/modules/GenerateRecipe.module.scss";
import { TopBar, TitleScreen, Sidebar, Table } from "components";
import { ITable } from "interfaces/ITable.interface";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  startDeletingRequest,
  startDownloadingRequest,
  startGetRequestStorehouse,
  startGettingRequestById,
} from "../../store/requests/thunks";
import { useRouter } from "next/router";
import { setActiveRequest } from "store/requests/requests.slice";
const Almacen: NextPage = () => {
  const { requests } = useAppSelector((state) => state.storehouse);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(startGetRequestStorehouse());
  }, []);

  const tableElements: ITable = {
    headers: [
      { id: "folio", label: "Folio" },
      { id: "created_at", label: "Fecha de solicitud" },
      { id: "name", label: "Nombre del solicitante" },
      { id: "status", label: "Estatus" },
      { id: "actions", label: "Acciones" },
    ],
    rows: requests,
    keyName: "id",
    percentages: [5, 30, 30, 15, 20],
    textDisplay: ["center", "center", "center", "center", "center"],
    elements: ["TEXT", "TEXT", "TEXT", "TEXT", "ACTIONS-P-E-D"],
    onClick: (id: string) => {
      dispatch(startDownloadingRequest(id));
    },
    onClick2: (id: string) => {
      console.log({ id });
      dispatch(setActiveRequest(requests.find((req) => req.id == id)));
      router.push("/surtirSolicitudAlmacen");
    },
    onClick3: (id: string) => {
      dispatch(startDeletingRequest(id));
    },
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <TitleScreen title="Solicitudes" />
      <div className={styles.content}>
        <Sidebar />
        <Table {...tableElements} />
      </div>
    </div>
  );
};

export default Almacen;
