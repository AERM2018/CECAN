import { Searcher, Sidebar, Table, TitleScreen, TopBar } from "components";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import React, { useEffect } from "react";
import { ITable } from "../../interfaces/ITable.interface";
import styles from "styles/modules/GenerateRecipe.module.scss";
import { startGetFixedAssests } from "store/fixedAsset/thunks";

const FixedAsset = () => {
  const { fixedAssets } = useAppSelector((state) => state.fixedAsset);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startGetFixedAssests());
  }, []);

  const tableElements: ITable = {
    headers: [
      { id: "key", label: "Etiqueta o clave" },
      { id: "description", label: "Descripción" },
      { id: "model", label: "Modelo" },
      { id: "brand", label: "Marca" },
      { id: "department_name", label: "Departamento" },
      { id: "director_user_name", label: "Director" },
      { id: "administrator_user_name", label: "Subdirector" },
      { id: "created_at", label: "Fecha de adquisición" },
    ],
    rows: fixedAssets,
    keyName: "folio",
    percentages: [10, 25, 10, 10, 20, 30, 30, 10],
    percentageUnits: "vw",
    textDisplay: [
      "center",
      "center",
      "center",
      "center",
      "center",
      "center",
      "center",
      "center",
    ],
    elements: ["TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT"],
    onClick: (id: number) => {
      console.log(id);
    },
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <TitleScreen title="Activo fijo" />
      <div className={`${styles.content}`}>
        <Sidebar />
        <div className={styles.content_col}>
          <div className={styles.content}>
            {/* <Searcher /> */}
            <button className={styles.button_filled}>
              Cargar datos desde archivo csv
            </button>
          </div>
          <Table {...tableElements} />
        </div>
      </div>
    </div>
  );
};

export default FixedAsset;
