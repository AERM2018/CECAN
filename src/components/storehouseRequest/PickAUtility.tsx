import React, { useState } from "react";
import { FC, useEffect } from "react";
import { Modal } from "@mui/material";
import { addActiveMedicine } from "store/recipes/recipesSlice";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { toggleModal } from "store/ui/uiSlice";
import styles from "./GenerateStorehouseRequest.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Searcher } from "components";
import {
  startFilterUtilities,
  startGetStorehouseList,
} from "store/requests/thunks";
import { IAlmacenStore } from "interfaces/IAlmacen.interface";
import { addActiveStorehouseUtility } from "store/requests/requests.slice";

type PickAMedicineProps = {
  // medicines: IMedicineCatalog[] | null;
  // activeMedicines: IMedicine[] | null;
  isModalOpen: boolean;
};

export const PickAUtility: FC<PickAMedicineProps> = ({
  isModalOpen,
  // activeMedicines,
  // medicines,
}) => {
  const {
    storehouse: { activeStorehouseUtilities, inventory },
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const handleToggleModal = () => {
    dispatch(toggleModal());
  };
  const [utilityKey, setUtilityKey] = useState("");

  const onUtilityKeyChange = (e) => {
    e.preventDefault();
    setUtilityKey(e.target.value);
  };

  const onSubmitUtilityKey = (e) => {
    e.preventDefault();
    dispatch(
      startFilterUtilities(
        utilityKey,
        inventory as IAlmacenStore[],
        "generateRequest"
      )
    );
  };

  useEffect(() => {
    if (!inventory || utilityKey == "") {
      dispatch(startGetStorehouseList({ searchStocks: false }));
    }
  }, [utilityKey]);

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
        {inventory && inventory.length > 0 ? (
          <>
            <h2>Seleccione una utilidad a agregar</h2>
            <Searcher
              onChangeSearchValue={onUtilityKeyChange}
              onSubmitSearch={onSubmitUtilityKey}
              value={utilityKey}
              placeholder="Escriba la clave o nombre de la utilidad"
            />
          </>
        ) : (
          <h2>No hay mas medicinas para agregar</h2>
        )}

        <div className={styles.medicinesContainer}>
          {inventory && inventory.length > 0 ? (
            inventory
              .filter((utility) => {
                const activeMedicine = activeStorehouseUtilities?.find(
                  (activeUtility) => activeUtility.key === utility.key
                );
                return !activeMedicine;
              })
              .map((utility) => (
                <div
                  key={utility.key}
                  className={styles.medicine}
                  onClick={() => {
                    dispatch(addActiveStorehouseUtility(utility));
                    handleToggleModal();
                  }}
                >
                  <p>{utility.key}</p>
                  <p>{utility.genericName}</p>
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
