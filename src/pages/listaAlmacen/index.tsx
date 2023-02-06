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
          { id: "storehouse_utility.final_presentation", label: "Presentación" },
          { id: "expires_at", label: "Expira el" },
          { id: "quantity_presentation_left", label: "Cantidad" },
        ]
      : [
          { id: "key", label: "Clave" },
          { id: "genericName", label: "Nombre Generico" },
          { id: "storehouse_utility.final_presentation", label: "Presentación" },
          {
            id: "quantity_presentation_left",
            label: "Cant. total restante",
          },
        ],
    rows: inventory,
    percentages: !showUtilitiesLessQty
      ? [15, 15, 30, 40, 20, 13, 13]
      : [15, 40, 30, 15],
    textDisplay: !showUtilitiesLessQty
      ? ["center", "center", "center", "start", "start", "center", "center"]
      : ["center", "start", "start", "center"],
    elements: ["text", "text", "text", "text", "text", "text", "text"],
    keyName: "key",
  };

  useEffect(() => {
      dispatch(startGetStorehouseList({ showLessQty: showUtilitiesLessQty, concidence:utilityKey }));
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
      <TitleScreen title="Inventario de Almacén" />
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
                : "Mostrar por utilidades"}
            </button>
          </div>
          <Table {...tableElements} />
        </div>
      </div>
    </div>
  );
};

export default ListAlmacen;
