import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import styles from "./Searcher.module.scss";
export const Searcher = ({
  onSubmitSearch,
  value,
  placeholder,
  onChangeSearchValue,
}: {
  onSubmitSearch: Function;
  value: string;
  placeholder: string;
  onChangeSearchValue: Function;
}) => {
  return (
    <form onSubmit={(e) => onSubmitSearch(e)}>
      <input
        type="search"
        placeholder={placeholder}
        className={styles.buscador}
        value={value}
        onChange={(e) => onChangeSearchValue(e)}
      />
    </form>
  );
};
