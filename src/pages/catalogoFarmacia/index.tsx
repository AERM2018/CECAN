import { BaseStructure, Searcher, Table } from "components";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { ITable } from "interfaces/ITable.interface";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { startGetPharmacyCatalog } from "store/pharmacy/thunks";
import styles from '../../styles/modules/GenerateRecipe.module.scss'

const PharmacyCatalog: NextPage = () => {
    const {pharmacyMedicineCatalogData} = useAppSelector((state) => state.pharmacy)
    const dispatch = useAppDispatch()
    const [medicineKey, setMedicineKey] = useState("")

    useEffect(()=>{
        dispatch(startGetPharmacyCatalog(medicineKey))
    },[medicineKey])

    const onMedicineKeyChange = (e: any) => {
      setMedicineKey(e.target.value)
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
            <Table {...tableInformation}/>
        </div>
        </BaseStructure>
    );
}

export default PharmacyCatalog;