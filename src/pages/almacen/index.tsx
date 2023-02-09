import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styles from "styles/modules/GenerateRecipe.module.scss";
import { TopBar, TitleScreen, Sidebar, Table, Searcher } from "components";
import { ITable } from "interfaces/ITable.interface";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  startDeletingRequest,
  startDownloadingRequest,
  startGetRequestStorehouse,
  startGettingRequestById,
} from "../../store/requests/thunks";
import { useRouter } from "next/router";
import {
  findRequestByFolio,
  setActiveRequest,
} from "store/requests/requests.slice";
import { CircularProgress } from "@mui/material";
const Almacen: NextPage = () => {
  const { requests } = useAppSelector((state) => state.storehouse);
  let { isLoading } = useAppSelector(
      (state) => state.ui
  );  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [requestFolio, setRequestFolio] = useState("");

  useEffect(() => {
    if (!requests || requestFolio == "") dispatch(startGetRequestStorehouse());
  }, [requestFolio]);

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
      dispatch(setActiveRequest(requests.find((req) => req.id == id)));
      router.push("/surtirSolicitudAlmacen");
    },
    onClick3: (id: string) => {
      dispatch(startDeletingRequest(id));
    },
  };

  const onRequestFolioChange = (e) => {
    setRequestFolio(e.target.value);
  };

  const onSubmitRequestFolio = (e) => {
    e.preventDefault();
    dispatch(findRequestByFolio(requestFolio));
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <TitleScreen title="Solicitudes" />
      <div className={styles.content}>
        <Sidebar />
        <div className={styles.content_col}>
          <div className={styles.content}>
            <Searcher
              value={requestFolio.toString()}
              onChangeSearchValue={onRequestFolioChange}
              onSubmitSearch={onSubmitRequestFolio}
              placeholder="Busca por folio de solicitud"
            />
          </div>
         {isLoading && <div className={styles.circularProgress}><CircularProgress /></div>}
          {!isLoading && 
            <>
              <Table {...tableElements}/>
              <div className={styles.pagination}>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default Almacen;
