import { useEffect } from "react";
import { BaseStructure, Input, SubmitButton } from "components";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "styles/modules/AddStock.module.scss";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { startGetStorehouseCatalogData, startGetStorehouseList } from "store/requests/thunks";
import { startAddStockStorehouse } from "../../store/requests/thunks";
const AddStockStorehouse = () => {
  const dispatch = useAppDispatch();

  const { storehouseCatalog } = useAppSelector((state) => state.storehouse);

  useEffect(() => {
    dispatch(startGetStorehouseCatalogData({ limit: 100 }));
  }, []);

  return (
    <BaseStructure pageName="Añadir nuevo stock inventario">
      <Formik
        initialValues={{
          key: "",
          quantity_presentation: "",
          lot_number: "",
          catalog_number: "",
          expires_at: "",
        }}
        validationSchema={Yup.object({})}
        onSubmit={(values, { resetForm }) => {
          dispatch(startAddStockStorehouse(values, resetForm));
        }}
      >
        {(formik) => (
          <>
            <form onSubmit={formik.handleSubmit} className={styles.form}>
              <Input
                name="key"
                placeholder="Clave de la medicina"
                type="select"
                options={storehouseCatalog?.map((item) => ({
                  value: item.key,
                  label: item.generic_name,
                }))}
              />
              <Input
                name="quantity_presentation"
                placeholder="Presentación (piezas)"
                type="text"
              />
              <Input
                name="catalog_number"
                placeholder="Número de catalogo"
                type="text"
              />
              <Input name="lot_number" placeholder="Lote" type="text" />
              <Input
                name="expires_at"
                placeholder="Fecha de expiración"
                type="date"
              />
              <SubmitButton text="Añadir stock" />
            </form>
          </>
        )}
      </Formik>
    </BaseStructure>
  );
};

export default AddStockStorehouse;
