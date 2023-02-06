import { useEffect, useState } from "react";
import {
  Sidebar,
  TopBar,
  TitleScreen,
  Table,
  Searcher,
  SubmitButton,
  BaseStructure,
} from "components";
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
import { IMedicineStock } from "interfaces/IMedicineStock.interface";

const PharmacyCatalog: NextPage = (props) => {
  let { pharmacyData, pharmacyDataLessQty } = useAppSelector(
    (state) => state.pharmacy
  );
  const dispatch = useAppDispatch();

  const [medicineKey, setmedicineKey] = useState("");
  const [showLessQty, setShowLessQty] = useState(false);

  useEffect(() => {
    // if (!pharmacyData) {
      dispatch(startGetPharmacyData({showLessQty,concidence:medicineKey}));
    // }
  }, [medicineKey, showLessQty]);

  const tableInformation: ITable = {
    headers: !showLessQty
      ? [
          { id: "lot_number", label: "Lote" },
          { id: "key", label: "Clave" },
          { id: "name", label: "Nombre" },
          { id: "semaforization_color", label: "" },
          { id: "expires_at", label: "Expira el" },
          { id: "pieces_left", label: "Cantidad Disponible" },
        ]
      : [
          { id: "key", label: "Clave" },
          { id: "name", label: "Nombre" },
          { id: "pieces_left", label: "Cantidad total disponible" },
        ],
    rows: pharmacyData,
    elements: [
      "TEXT",
      "TEXT",
      "TEXT",
      ...(!showLessQty ? ["CIRCLE-INDICATOR","TEXT", "TEXT","TEXT"] : []),
    ],
    percentages: !showLessQty ? [15, 15, 30,0.1,15, 20] : [30, 30, 30],
    textDisplay: [
      "center",
      "center",
      "center",
      ...(!showLessQty ? ["center", "center", "center","center"] : []),
    ] as CanvasTextAlign[],
  };

  const onMedicineKeyChange = (e) => {
    e.preventDefault();
    setmedicineKey(e.target.value);
  };

  const onSubmitMedicineKey = (e) => {
    e.preventDefault();
    if (showLessQty) {
      dispatch(
        startFilterMedicine(
          medicineKey,
          pharmacyDataLessQty as IMedicineStock[],
          "catalogLessQty"
        )
      );
    } else {
      dispatch(startFilterMedicine(medicineKey, pharmacyData, "catalog"));
    }
  };

  const onShowLessQtyStocks = () => {
    setShowLessQty(!showLessQty);
  };

  return (
    <BaseStructure
     pageName="Invetario de Farmacía"
    >
      <div className={styles.content_col}>
          <div className={styles.content}>
            <Searcher
              placeholder="Busca por clave o nombre de medicamento"
              onChangeSearchValue={onMedicineKeyChange}
              onSubmitSearch={onSubmitMedicineKey}
              value={medicineKey}
            />
            <button
              className={styles.button}
              onClick={() => onShowLessQtyStocks()}
            >
              {!showLessQty
                ? "Ver por medicina"
                : "Ver por los stocks"}
            </button>
          </div>
          <Table {...tableInformation} />
    </div>
    </BaseStructure>
    // <div className={styles.container}>
    //   <TopBar />
    //   <TitleScreen title="Invetario de Farmacía" />
    //   <div className={styles.content}>
    //     <Sidebar />
        
    //   </div>
    // </div>
  );
};

export default PharmacyCatalog;
