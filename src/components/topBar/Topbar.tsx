import styles from "./Topbar.module.scss";
import { Logout } from "./Logout";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authSlice } from "../../store/auth/authSlice";
import { useSession } from "next-auth/react";
import { renewToken } from "store/auth/thunks";
import { useEffect } from "react";

export const TopBar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data, status } = useSession();

  return (
    <div className={styles.topBar}>
      <div className={styles.logos}>
        <img className={styles.image} src="./SSALogo.png" alt="" />
        <div className={styles.text}>
          <h2>CENTRO ESTATAL DE CANCEROLOGÍA</h2>
          <img className={styles.image} src="./cecan-logo.png" alt="" />
        </div>
        1
      </div>

      <Logout
        username={
          status != "authenticated" ? "Usuario" : data.user.user.full_name
        }
      />
    </div>
  );
};
