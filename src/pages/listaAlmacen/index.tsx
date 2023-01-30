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
const ListAlmacen: NextPage = () => {
  const { inventory, inventoryLessQty } = useAppSelector(
    (state) => state.storehouse
  );
  const dispatch = useAppDispatch();
  const [utilityKey, setUtilityKey] = useState("");
  const [showUtilitiesLessQty, setShowUtilitiesLessQty] = useState(false);
  const tableElements: ITable = {
    headers: !showUtilitiesLessQty
      ? [
          { id: "key", label: "Clave" },
          { id: "lot_number", label: "No. de lote" },
          { id: "catalog_number", label: "No. de catálogo" },
          { id: "genericName", label: "Nombre Generico" },
          { id: "presentation", label: "Presentación" },
          { id: "expires_at", label: "Expira el" },
          { id: "quantity", label: "Cantidad" },
        ]
      : [
          { id: "key", label: "Clave" },
          { id: "genericName", label: "Nombre Generico" },
          { id: "presentation", label: "Presentación" },
          {
            id: "total_quantity_presentation_left",
            label: "Cant. total restante",
          },
        ],
    rows: !showUtilitiesLessQty ? inventory : inventoryLessQty,
    percentages: !showUtilitiesLessQty
      ? [15, 15, 15, 30, 20, 10, 10]
      : [15, 40, 30, 15],
    textDisplay: !showUtilitiesLessQty
      ? ["center", "center", "center", "start", "start", "center", "center"]
      : ["center", "start", "start", "center"],
    elements: ["text", "text", "text", "text", "text", "text", "text"],
    keyName: "key",
  };

  useEffect(() => {
    if (!inventory || utilityKey == "") {
      dispatch(startGetStorehouseList({ showLessQty: showUtilitiesLessQty }));
    }
  }, [utilityKey, showUtilitiesLessQty]);

  const onUtilikyKeyChange = (e) => {
    setUtilityKey(e.target.value);
  };

  const onSubmitUtilityKey = (e) => {
    e.preventDefault();
    const params = {
      utilityKey,
      inventory: showUtilitiesLessQty ? inventoryLessQty : inventory,
      from: showUtilitiesLessQty ? "catalogLessQty" : "catalog",
    };
    dispatch(
      startFilterUtilities(
        params["utilityKey"],
        params["inventory"],
        params["from"]
      )
    );
  };

  const onShowLessQtyChange = () => {
    setShowUtilitiesLessQty(!showUtilitiesLessQty);
    setUtilityKey("");
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <TitleScreen title="Lista Almacén" />
      <div className={styles.content}>
        <Sidebar />
        <div className={styles.content_col}>
          <div className={styles.content}>
            <Searcher
              value={utilityKey}
              onChangeSearchValue={onUtilikyKeyChange}
              onSubmitSearch={onSubmitUtilityKey}
              placeholder="Busca por clave o nombre de utilidad de almácen"
            />
            <button
              onClick={onShowLessQtyChange}
              className={styles.button_filled}
            >
              {showUtilitiesLessQty
                ? "Mostrar todos los stocks"
                : "Mostrar utilidades con poco stock"}
            </button>
          </div>
          <Table {...tableElements} />
        </div>
      </div>
    </div>
  );
};

export default ListAlmacen;
