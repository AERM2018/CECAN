import { FC } from "react";
import { string } from "yup";
import styles from "./Table.module.scss";

type Props = {
  headers: any[];
  percentages: number[];
  textDisplay?: CanvasTextAlign[];
  percentageUnits?: string;
};

export const Headers: FC<Props> = ({
  headers,
  percentages,
  textDisplay,
  percentageUnits,
}) => {
  return (
    <div className={styles.headers}>
      {headers.map((header, index) => {
        return (
          <div
            key={header.id}
            className={styles.headerItem}
            style={{
              maxWidth: `${percentages[index]}${
                percentageUnits ? percentageUnits : "%"
              }`,
              minWidth: `${percentages[index]}${
                percentageUnits ? percentageUnits : "%"
              }`,
              textAlign: textDisplay ? textDisplay[index] : "start",
            }}
          >
            {header.label}
          </div>
        );
      })}
    </div>
  );
};
