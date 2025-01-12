import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styles from "styles/modules/GenerateRecipe.module.scss";
import { Searcher, Sidebar, Table, TitleScreen, TopBar } from "components";
import { ITable } from "../../interfaces/ITable.interface";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import {
  startFilterUtilities,
  startGetStorehouseList,
} from "../../store/requests/thunks";
import { CircularProgress, Pagination } from "@mui/material";
const ListAlmacen: NextPage = () => {
  const { inventory, inventoryLessQty, pages } = useAppSelector(
    (state) => state.storehouse
  );
  let { isLoading } = useAppSelector(
      (state) => state.ui
    );
  const dispatch = useAppDispatch();
  const [utilityKey, setUtilityKey] = useState("");
  const [page, setPage] = useState(1);
  const [showUtilitiesLessQty, setShowUtilitiesLessQty] = useState(false);
  const tableElements: ITable = {
    headers: !showUtilitiesLessQty
      ? [
          { id: "key", label: "Clave" },
          { id: "lot_number", label: "No. de lote" },
          { id: "catalog_number", label: "No. de catálogo" },
          { id: "generic_name", label: "Nombre Generico" },
          { id: "storehouse_utility.final_presentation", label: "Presentación" },
          { id: "semaforization_color", label: "" },
          { id: "expires_at", label: "Expira el" },
          { id: "quantity_presentation_left", label: "Cantidad" },
        ]
      : [
          { id: "key", label: "Clave" },
          { id: "generic_name", label: "Nombre Generico" },
          { id: "storehouse_utility.final_presentation", label: "Presentación" },
          {
            id: "quantity_presentation_left",
            label: "Cant. total restante",
          },
        ],
    rows: inventory,
    percentages: !showUtilitiesLessQty
      ? [15, 15, 30, 40, 20, 0.5,13, 13]
      : [15, 40, 30, 15],
    textDisplay: !showUtilitiesLessQty
      ? ["center", "center", "center", "start", "start","center", "center", "center"]
      : ["center", "start", "start", "center"],
    elements: ["TEXT", "TEXT", "TEXT", "TEXT", "TEXT","CIRCLE-INDICATOR", "TEXT", "TEXT"],
    keyName: "key",
  };

  useEffect(() => {
      dispatch(startGetStorehouseList({ showLessQty: showUtilitiesLessQty, concidence:utilityKey, page }));
  }, [utilityKey, showUtilitiesLessQty, page]);

  const onUtilikyKeyChange = (e) => {
    setUtilityKey(e.target.value);
    dispatch(startGetStorehouseList({ showLessQty: showUtilitiesLessQty, concidence:utilityKey, page:1 }));
  };

  // const onSubmitUtilityKey = (e) => {
  //   e.preventDefault();
  //   const params = {
  //     utilityKey,
  //     inventory: showUtilitiesLessQty ? inventoryLessQty : inventory,
  //     from: showUtilitiesLessQty ? "catalogLessQty" : "catalog",
  //   };
  //   dispatch(
  //     startFilterUtilities(
  //       params["utilityKey"],
  //       params["inventory"],
  //       params["from"]
  //     )
  //   );
  // };

  const onChangePage = (e, value) => {
    setPage(value);
  };
  const onShowLessQtyChange = () => {
    setShowUtilitiesLessQty(!showUtilitiesLessQty);
    setUtilityKey("");
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <TitleScreen title="Inventario de Almacén" />
      <div className={styles.content}>
        <Sidebar />
        <div className={styles.content_col}>
          <div className={styles.content}>
            <Searcher
              value={utilityKey}
              onChangeSearchValue={onUtilikyKeyChange}
              placeholder="Busca por clave o nombre de utilidad de almácen"
            />
            <button
              onClick={onShowLessQtyChange}
              className={styles.button_filled}
            >
              {showUtilitiesLessQty
                ? "Mostrar todos los stocks"
                : "Mostrar por utilidades"}
            </button>
          </div>
          {isLoading && <div className={styles.circularProgress}><CircularProgress /></div>}
          {!isLoading && 
            <>
              <Table {...tableElements} />
              <div className={styles.pagination}>
                <Pagination
                  count={pages}
                  color="primary"
                  size="large"
                  shape="rounded"
                  onChange={onChangePage}
                  page={page}
                />
            </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default ListAlmacen;
