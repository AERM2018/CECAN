import styles from "./Forms.module.scss";
export const SubmitButton = ({
  text,
  isBlocked = false,
}: {
  text: string;
  isBlocked?: boolean;
}) => {
  return (
    <button disabled={isBlocked} type="submit" className={styles.submit}>
      <span>{text}</span>
    </button>
  );
};
