import React, { FC, useEffect } from "react";
import styles from "./Sidebar.module.scss";
import { SidebarItem } from "./SidebarItem";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { useGetAccess } from "hooks/useGetAccess";
import { useDispatch } from "react-redux";
import { login } from "store/auth/authSlice";
import { useSession } from "next-auth/react";

type Props = {};

export const Sidebar: FC<Props> = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { data, status } = useSession();
  const items = useGetAccess(
    status != "authenticated" ? "" : data.user.user.role.name
  );

  useEffect(() => {}, [user]);

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <SidebarItem
          key={item.text}
          icon={item.icon}
          text={item.text}
          path={item.path}
        />
      ))}
    </div>
  );
};
