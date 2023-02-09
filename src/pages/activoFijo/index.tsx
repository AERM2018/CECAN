import { Searcher, Sidebar, Table, TitleScreen, TopBar } from "components";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import React, { useEffect, useState } from "react";
import { ITable } from "../../interfaces/ITable.interface";
import styles from "styles/modules/GenerateRecipe.module.scss";
import {
  startGetFixedAssests,
  startUploadingFixedAssetFile,
} from "store/fixedAsset/thunks";
import { CircularProgress, createTheme, Pagination, ThemeProvider } from "@mui/material";

const FixedAsset = () => {
  const { pages, fixedAssets } = useAppSelector((state) => state.fixedAsset);
  let { isLoading } = useAppSelector(
      (state) => state.ui
    );
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(startGetFixedAssests(query, currentPage));
  }, [currentPage, query]);

  const onChangePage = (e, page: number) => {
    setCurrentPage(page);
  };

  const onChangeQuery = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1)
  };

  const onSubmitQuery = (e) => {
    e.preventDefault();
    dispatch(startGetFixedAssests(query, 1));
  };

  const onSumbitFile = () => {
    const input = document.getElementById("file") as HTMLInputElement;
    input.addEventListener(
      "change",
      (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(
          startUploadingFixedAssetFile(e.target.files, () =>
            dispatch(startGetFixedAssests("", 1))
          )
        );
      },
      false
    );
    input.click();
  };
  const tableElements: ITable = {
    headers: [
      { id: "key", label: "Etiqueta o clave" },
      { id: "description", label: "Descripción" },
      { id: "model", label: "Modelo" },
      { id: "brand", label: "Marca" },
      { id: "department_name", label: "Departamento" },
      { id: "director_user_name", label: "Director" },
      { id: "administrator_user_name", label: "Administrador" },
      { id: "created_at", label: "Fecha de adquisición" },
    ],
    rows: fixedAssets,
    keyName: "folio",
    percentages: [10, 35, 10, 10, 30, 30, 30, 10],
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

  const theme = createTheme({
    palette: {
      primary: { main: "#214d99" },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <TopBar />
        <TitleScreen title="Activo fijo" />
        <div className={`${styles.content}`}>
          <Sidebar />
          <div className={styles.content_col}>
            <div className={styles.content}>
              <Searcher
                value={query}
                onChangeSearchValue={onChangeQuery}
                onSubmitSearch={onSubmitQuery}
                placeholder="Busca por algún campo de la tabla"
              />
              <button className={styles.button_filled} onClick={onSumbitFile}>
                Importar datos desde csv
              </button>
              <input
                className={styles.custom_file_input}
                id="file"
                type="file"
              />
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
                  page={currentPage}
                />
              </div>
            </>
            }   

          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FixedAsset;
