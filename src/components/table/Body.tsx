import { IMedicineStock } from "interfaces/IMedicineStock.interface";
import React, { FC } from "react";
import { Cell } from "./Cell";
import styles from "./Table.module.scss";
import { IMedicine } from "../../interfaces/IMedicineStock.interface";
import { ITable } from "interfaces/ITable.interface";

export const Body: FC<ITable> = ({
  headers,
  rows,
  percentages,
  percentageUnits,
  textDisplay,
  elements,
  keyName = "key",
  onClick,
  onClick2,
  onClick3,
}) => {
  if (!rows) return null;
  return (
    <div className={styles.body}>
      {rows.map((row, index) => (
        <div key={index} className={styles.row}>
          {headers.map(({ id }, index) => {
            let content: string, keyname: string;
            if (id.toString().includes(".")) {
              const props = id.toString().split(".");
              let deepProp = props.reduce((acc, curr, index) => {
                return acc[props[index]];
              }, row);
              content = deepProp;
              keyname = row[props.reverse[0]];
            } else {
              content = row[id];
              keyname = row[keyName];
            }
            return (
              <Cell
                id={keyname}
                key={index}
                textDisplay={textDisplay ? textDisplay[index] : "start"}
                content={content}
                percentage={percentages[index]}
                percentageUnits={percentageUnits}
                type={elements[index]}
                onClick={onClick}
                onClick2={onClick2}
                onClick3={onClick3}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
