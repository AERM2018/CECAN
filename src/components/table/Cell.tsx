import { createTableComponent } from "helpers/createTableComponent";
import React, { FC } from "react";
import styles from "./Table.module.scss";

type CellProps = {
  percentage: number;
  percentageUnits?: string;
  textDisplay?: CanvasTextAlign;
  content: string;
  type: string;
  id: string;
  onClick?: (id: string) => void;
  onClick2?: (id: string) => void;
  onClick3?: (id: string) => void;
};

export const Cell: FC<CellProps> = ({
  percentage,
  percentageUnits,
  textDisplay,
  content,
  type,
  id,
  onClick,
  onClick2,
  onClick3,
}) => {
  const component = createTableComponent({
    type,
    content,
    onClick,
    onClick2,
    onClick3,
    id,
  });
  return (
    <div
      className={styles.cell}
      style={{
        maxWidth: `${percentage}${percentageUnits ? percentageUnits : "%"}`,
        minWidth: `${percentage}${percentageUnits ? percentageUnits : "%"}`,
        textAlign: textDisplay ? textDisplay : "start",
      }}
    >
      {component}
    </div>
  );
};
