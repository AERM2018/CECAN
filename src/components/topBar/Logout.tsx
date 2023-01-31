import React, { FC } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./Topbar.module.scss";
import { useAppDispatch } from "hooks/hooks";
import { useRouter } from "next/router";
import { logout } from "store/auth/authSlice";
type Props = {
  username: string;
};

export const Logout: FC<Props> = ({ username }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useSession;
  const handleLogout = () => {
    signOut({
      callbackUrl: `${process.env.NEXTAUTH_URL}/login`,
    });
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/login");
  };
  return (
    <div className={styles.logout} onClick={handleLogout}>
      <FontAwesomeIcon icon={faCircleUser} />
      <h2>{username}</h2>
    </div>
  );
};
