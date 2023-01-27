import { useEffect, useState } from "react";
import { Sidebar, TopBar, TitleScreen, Table } from "components";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { NextPage } from "next";

import styles from "styles/modules/PharmacyCatalog.module.scss";
import { setPharmacyData } from "store/pharmacy/pharmacySlice";
import { dataPharmacy } from "resources/data";
import {
  startFilterMedicine,
  startGetPharmacyData,
} from "../../store/pharmacy/thunks";
import { ITable } from "../../interfaces/ITable.interface";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PharmacyCatalog: NextPage = (props) => {
  let { pharmacyData } = useAppSelector((state) => state.pharmacy);
  const dispatch = useAppDispatch();

  const [medicineKey, setmedicineKey] = useState("");

  useEffect(() => {
    if (!pharmacyData || medicineKey == "") {
      dispatch(startGetPharmacyData());
    }
  }, [medicineKey]);

  const tableInformation: ITable = {
    headers: [
      { id: "lot_number", label: "Lote" },
      { id: "id", label: "Clave" },
      { id: "name", label: "Nombre" },
      { id: "expires_at", label: "Expira el" },
      { id: "pieces", label: "Cantidad" },
    ],
    rows: pharmacyData,
    elements: ["TEXT", "TEXT", "TEXT", "TEXT", "TEXT"],
    percentages: [25, 20, 20, 20, 15],
    textDisplay: [
      "center",
      "center",
      "center",
      "center",
      "center",
      "center",
    ] as CanvasTextAlign[],
    onClick: (id: string) => {
      console.log(id);
    },
  };

  const onMedicineKeyChange = (e) => {
    e.preventDefault();
    setmedicineKey(e.target.value);
  };

  const onSubmitMedicineKey = (e) => {
    e.preventDefault();
    dispatch(startFilterMedicine(medicineKey, pharmacyData));
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <TitleScreen title="Catálogo Farmacía" />
      <div className={styles.content}>
        <Sidebar />
        <div className={styles.content_col}>
          <div className={styles.content}>
            <form onSubmit={(e) => onSubmitMedicineKey(e)}>
              <input
                type="search"
                placeholder="Busca una clave de medicina"
                className={styles.buscador}
                value={medicineKey}
                onChange={(e) => onMedicineKeyChange(e)}
              />
            </form>
          </div>
          <Table {...tableInformation} />
        </div>
      </div>
    </div>
  );
};

export default PharmacyCatalog;
