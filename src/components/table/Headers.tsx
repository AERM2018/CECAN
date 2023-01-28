import { FC } from "react";
import styles from "./Table.module.scss";

type Props = {
  headers: any[];
  percentages: number[];
  textDisplay?: CanvasTextAlign[];
};

export const Headers: FC<Props> = ({ headers, percentages, textDisplay }) => {
  return (
    <div className={styles.headers}>
      {headers.map((header, index) => {
        return (
          <div
            key={header.id}
            className={styles.headerItem}
            style={{
              width: `${percentages[index]}%`,
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
