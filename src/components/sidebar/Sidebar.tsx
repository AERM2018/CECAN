import React, { FC } from "react";
import styles from "./Sidebar.module.scss";
import { SidebarItem } from "./SidebarItem";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { useGetAccess } from "hooks/useGetAccess";
import { useDispatch } from "react-redux";
import { login } from "store/auth/authSlice";

type Props = {};

export const Sidebar: FC<Props> = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const items = useGetAccess(user?.role.name);

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
