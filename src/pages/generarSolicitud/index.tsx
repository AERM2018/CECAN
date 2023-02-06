import { BaseStructure, Sidebar, TitleScreen, TopBar } from "components";
import { GenerateStorehouseRequest } from "components/storehouseRequest";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { NextPage } from "next";
import { useEffect } from "react";
import { startGetStorehouseList } from "store/requests/thunks";
import styles from "styles/modules/GenerateRequest.module.scss";

const GenerateRequest: NextPage = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <BaseStructure pageName="Generar solicitud de almácen">
        <div className={styles.generate}>
          <GenerateStorehouseRequest />
        </div>
      </BaseStructure>
    </>
  );
};

export default GenerateRequest;
