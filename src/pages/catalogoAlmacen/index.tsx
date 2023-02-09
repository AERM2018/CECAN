import { CircularProgress, Pagination } from "@mui/material";
import { BaseStructure, Searcher, Table } from "components";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { ITable } from "interfaces/ITable.interface";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { startGetStorehouseCatalogData } from "store/requests/thunks";
import styles from "../../styles/modules/GenerateRecipe.module.scss";

const StorehouseCatalog: NextPage = () => {
    const {storehouseCatalog, pages} = useAppSelector((state) => state.storehouse)
    let { isLoading } = useAppSelector(
      (state) => state.ui
    );
    const dispatch = useAppDispatch()
    const [storehouseUtilityKey,setStorehouseUtilityKey] = useState("")
    const [page,setPage] = useState(1)

    useEffect(()=>{
        dispatch(startGetStorehouseCatalogData({concidence:storehouseUtilityKey,page}))
    },[page])

    const onStorehouseUtilityKeyChange = (e) => {
        setStorehouseUtilityKey(e.target.value);
        dispatch(startGetStorehouseCatalogData({concidence:e.target.value,page:1}))
    }
      const tableInformation: ITable = {
    headers: 
      [
          { id: "key", label: "Clave" },
          { id: "generic_name", label: "Nombre" },
          { id: "created_at", label: "Creado el" },
          { id: "updated_at", label: "Ultima actualización el" },
      ],
    rows: storehouseCatalog,
    elements: [
      "TEXT",
      "TEXT",
      "TEXT",
      "TEXT",
      "TEXT",
    ],
    percentages: [20, 30, 25,25],
    textDisplay: [
      "center",
      "center",
      "center",
      "center",
      "center",
    ] as CanvasTextAlign[],
  };
  
  const onChangePage = (e, page: number) => {
    setPage(page);
  }
    return(
        <BaseStructure
            pageName="Catálogo de Almacén"
        >
            <div className={styles.content_col}>
                <div className={styles.content}>
                    <Searcher
                        onChangeSearchValue={onStorehouseUtilityKeyChange}
                        value={storehouseUtilityKey}
                        placeholder="Busca utilidad de almacén"
                    />
                </div>
                {isLoading && <div className={styles.circularProgress}><CircularProgress /></div>}
                {!isLoading && 
                  <>
                    <Table {...tableInformation}/>
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
        </BaseStructure>
    )
}

export default StorehouseCatalog;