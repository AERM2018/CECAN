import { CircularProgress, Pagination } from "@mui/material";
import { BaseStructure, Searcher, Table } from "components";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { ITable } from "interfaces/ITable.interface";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { startGetPharmacyCatalog } from "store/pharmacy/thunks";
import styles from '../../styles/modules/GenerateRecipe.module.scss'

const PharmacyCatalog: NextPage = () => {
    const {pharmacyMedicineCatalogData, pages} = useAppSelector((state) => state.pharmacy)
    let { isLoading } = useAppSelector(
      (state) => state.ui
    );
    const dispatch = useAppDispatch()
    const [medicineKey, setMedicineKey] = useState("")
    const [page, setPage] = useState(1)

    useEffect(()=>{
        dispatch(startGetPharmacyCatalog({concidence:medicineKey, page}))
    },[page])

    const onMedicineKeyChange = (e: any) => {
      setMedicineKey(e.target.value)
      dispatch(startGetPharmacyCatalog({concidence:e.target.value, page:1}))

    }
      const tableInformation: ITable = {
    headers: 
      [
          { id: "key", label: "Clave" },
          { id: "name", label: "Nombre" },
          { id: "created_at", label: "Creado el" },
          { id: "updated_at", label: "Ultima actualización el" },
      ],
    rows: pharmacyMedicineCatalogData,
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

    const onChangePage = (e: any, page: number) => {
        setPage(page)
    }

    return (
        <BaseStructure
            pageName="Catálogo de farmacia"
        >
        <div className={styles.content_col}>
          <div className={styles.content}>
            <Searcher
              onChangeSearchValue={onMedicineKeyChange}
              value={medicineKey}
              placeholder="Buscar medicamento"
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
    );
}

export default PharmacyCatalog;