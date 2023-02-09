import { Field, useField } from "formik";
import { FC, useState } from "react";
import styles from "./Forms.module.scss";
type Props = {
  name: string;
  placeholder: string;
  type: string;
  disabled?: boolean;
  options?: { value: string; label: any }[];
};
export const Input: FC<Props> = ({
  name,
  placeholder,
  type,
  options,
  disabled = false,
}) => {
  const [field, meta, helpers] = useField(name);
  field.onChange = (e) => {
    helpers.setValue(e.target.value);
  };

  if (type === "select") {
    return (
      <Field
        name={name}
        as="select"
        className={styles.input}
        placeholder={placeholder}
        {...field}
      >
        <option value="" selected disabled>
         {placeholder || "Seleccione una opción"}
        </option>

        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
    );
  }
  return (
    <div className={styles.containerInput}>
      <Field
        name={name}
        type={type}
        render={({ field, form: { isSubmitting } }) => (
          <input
            {...field}
            disabled={disabled}
            className={styles.input}
            placeholder={placeholder}
            value={field.value}
          />
        )}
      />

      {meta.touched && meta.error && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </div>
  );
};
