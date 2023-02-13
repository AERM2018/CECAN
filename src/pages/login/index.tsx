import { Field, FormikProvider, useFormik } from "formik";
import styles from "styles/modules/Login.module.scss";
import * as Yup from "yup";
import { TopBar } from "components";
import { useAppDispatch } from "hooks/hooks";
import { useGetAccess } from "hooks/useGetAccess";
import { startLogin } from "../../store/auth/thunks";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const validationSchema = Yup.object({
  username: Yup.string().required("Requerido"),
  password: Yup.string().required("Requerido"),
});

const Login: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const items = useGetAccess(data.user.role.name);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        startLogin({
          username: values.username,
          password: values.password,
        })
      );
      // router.push()
    },
  });

  const { data, status } = useSession();

  //If data exists, redirect to home page
    const items = useGetAccess(data.user.user.role.name || "");
    if(items && items.length != 0){
      router.push(items[0].path)
    }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>CENTRO ESTATAL DE CANCEROLOGÍA</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.form}>
            <div>
              <div className={styles.input}>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Usuario"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                {formik.errors.username ? (
                  <div className={styles.error}>{formik.errors.username}</div>
                ) : null}
              </div>
              <div className={styles.input}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.errors.password ? (
                  <div className={styles.error}>{formik.errors.password}</div>
                ) : null}
              </div>
            </div>

            <button type="submit" className={styles.button}>
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
