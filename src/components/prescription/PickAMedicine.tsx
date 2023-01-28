import React, { useState } from "react";
import {
  IMedicine,
  IMedicineCatalog,
  IMedicineStock,
} from "../../interfaces/IMedicineStock.interface";
import { FC, useEffect } from "react";
import { Modal } from "@mui/material";
import { addActiveMedicine } from "store/recipes/recipesSlice";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { toggleModal } from "store/ui/uiSlice";
import styles from "./Prescription.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Searcher } from "components";
import { startFilterMedicine } from "store/pharmacy/thunks";
import { startGetMedicines } from "store/recipes/thunks";

type PickAMedicineProps = {
  // medicines: IMedicineCatalog[] | null;
  // activeMedicines: IMedicine[] | null;
  isModalOpen: boolean;
};

export const PickAMedicine: FC<PickAMedicineProps> = ({
  isModalOpen,
  // activeMedicines,
  // medicines,
}) => {
  const {
    recipes: { activeMedicines, medicines, activeIndication },
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const handleToggleModal = () => {
    dispatch(toggleModal());
  };

  const [renderMedicine, setRenderMedicine] = useState(medicines);
  const [medicineKey, setmedicineKey] = useState("");

  const onMedicineKeyChange = (e) => {
    e.preventDefault();
    setmedicineKey(e.target.value);
  };

  const onSubmitMedicineKey = (e) => {
    e.preventDefault();
    dispatch(
      startFilterMedicine(
        medicineKey,
        medicines as IMedicineStock[],
        "generatePrescription"
      )
    );
    console.log("medicines", { medicines });
    // setRenderMedicine(
    //   medicines?.filter((medicine) => {
    //     const activeMedicine = activeMedicines?.find(
    //       (activeMedicine) => activeMedicine.key === medicine.key
    //     );
    //     return !activeMedicine;
    //   })
    // );
  };

  useEffect(() => {
    if (!medicines || medicineKey == "") {
      dispatch(startGetMedicines());
    }
    // setRenderMedicine(
    //   medicines?.filter((medicine) => {
    //     const activeMedicine = activeMedicines?.find(
    //       (activeMedicine) => activeMedicine.key === medicine.key
    //     );
    //     return !activeMedicine;
    //   })
    // );
  }, [medicineKey]);

  return (
    <Modal
      open={isModalOpen}
      onClose={handleToggleModal}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={styles.modal}>
        {renderMedicine && renderMedicine.length > 0 ? (
          <>
            <h2>Seleccione una medicina a agregar</h2>
            <Searcher
              onChangeSearchValue={onMedicineKeyChange}
              onSubmitSearch={onSubmitMedicineKey}
              value={medicineKey}
              placeholder="Escriba la clave o nombre de medicina"
            />
          </>
        ) : (
          <h2>No hay mas medicinas para agregar</h2>
        )}

        <div className={styles.medicinesContainer}>
          {medicines && medicines.length > 0 ? (
            medicines
              .filter((medicine) => {
                const activeMedicine = activeMedicines?.find(
                  (activeMedicine) => activeMedicine.key === medicine.key
                );
                return !activeMedicine;
              })
              .map((medicine) => (
                <div
                  key={medicine.key}
                  className={styles.medicine}
                  onClick={() => {
                    dispatch(addActiveMedicine(medicine));
                    handleToggleModal();
                  }}
                >
                  <p>{medicine.key}</p>
                  <p>{medicine.name}</p>
                  <FontAwesomeIcon icon={faPlusCircle} />
                </div>
              ))
          ) : (
            <div className={styles.svgContainer}>
              <img className={styles.svg} src="./svg/medicine.svg" />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
