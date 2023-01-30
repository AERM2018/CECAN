import { AddMedicineButton } from "components/addMedicineButton";
import { SubmitButton } from "components/forms";
import { PickAMedicine } from "components/prescription/PickAMedicine";
import { Table } from "components/table";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { ITable } from "interfaces/ITable.interface";
import { FC } from "react";
import {
  modifyActiveStorehouseUtilityQty,
  removeActiveStorehouseUtility,
} from "store/requests/requests.slice";
import { startGeneratingRequest } from "store/requests/thunks";
import { toggleModal } from "store/ui/uiSlice";
import { PickAUtility } from "./PickAUtility";
import styles from "../../styles/modules/GenerateRequest.module.scss";

export const GenerateStorehouseRequest: FC = () => {
  const dispatch = useAppDispatch();
  const {
    storehouse: { activeStorehouseUtilities },
    ui: { isModalOpen },
  } = useAppSelector((state) => state);

  const tableElements: ITable = {
    headers: [
      { id: "key", label: "Clave" },
      { id: "genericName", label: "Nombre generico" },
      { id: "quantity", label: "Cantidad" },
      { id: "remove", label: "" },
    ],
    rows: activeStorehouseUtilities,
    percentages: [10, 30, 30, 20],
    elements: ["TEXT", "TEXT", "COUNTER", "REMOVE"],
    textDisplay: ["center", "center", "center", "center"] as CanvasTextAlign[],
    onClick: (key: string, quantity: number) => {
      dispatch(modifyActiveStorehouseUtilityQty({ key, quantity }));
    },
    onClick2: (key: string) => {
      dispatch(removeActiveStorehouseUtility(key));
    },
  };

  const openModal = () => dispatch(toggleModal());

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      dispatch(startGeneratingRequest(activeStorehouseUtilities));
    },
  });

  return (
    <>
      <Table {...tableElements} />
      <AddMedicineButton showModal={openModal} />
      {isModalOpen && <PickAUtility isModalOpen={isModalOpen} />}
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.sizedBox}></div>
        <SubmitButton text="Generar solicitud" />
      </form>
    </>
  );
};
