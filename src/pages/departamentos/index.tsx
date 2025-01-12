import { useEffect } from "react";
import { Sidebar, TopBar, TitleScreen, Table } from "components";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { NextPage } from "next";

import styles from "styles/modules/PharmacyCatalog.module.scss";
import { ITable } from "../../interfaces/ITable.interface";
import {
  assignResponsibleDepartmentUser,
  startGetDepartments,
} from "store/fixedAsset/thunks";
import { startGetUsers } from "store/users/thunks";
import { CircularProgress } from "@mui/material";

const Departments: NextPage = (props) => {
  const { departments } = useAppSelector((state) => state.fixedAsset);
   let { isLoading } = useAppSelector(
      (state) => state.ui
    );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startGetDepartments());
    dispatch(startGetUsers());
  }, []);

  const tableInformation: ITable = {
    headers: [
      { id: "id", label: "ID Departamento" },
      { id: "name", label: "Nombre" },
      { id: "floor_number", label: "Número de piso" },
      { id: "created_at", label: "Fecha de creación" },
      { id: "resposible_user_id", label: "Encargado" },
    ],
    rows: departments,
    elements: ["TEXT", "TEXT", "TEXT", "TEXT", "SELECT-USER"],
    percentages: [15, 35, 20, 15, 15],
    textDisplay: [
      "center",
      "center",
      "center",
      "center",
      "center",
    ] as CanvasTextAlign[],
    keyName: "id",
    onClick: (idDepartment: string, id: string) => {
      dispatch(assignResponsibleDepartmentUser(idDepartment, id));
    },
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <TitleScreen title="Departamentos" />
      <div className={styles.content}>
        <Sidebar />
        {isLoading && <div className={styles.circularProgress}><CircularProgress /></div>}
          {!isLoading && 
            <>
                <Table {...tableInformation} />
            </>
          }
      </div>
    </div>
  );
};

export default Departments;
