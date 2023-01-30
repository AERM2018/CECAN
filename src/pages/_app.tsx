import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "store/store";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    // (async () => {
    //   const user = await getSession();
    //   console.log({ user });
    // })();
    // const token = localStorage.getItem("token");
    // console.log(token);
    // console.log({ session });
    // console.log((!token || token != "") && Router.pathname !== "/login");
    // if (!token && Router.pathname !== "/login") {
    //   window.location.href = "/login";
    // } else if (token && Router.pathname === "/login") {
    //   window.location.href = "/catalogoFarmacia";
    // }
  }, []);

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <Toaster
          toastOptions={{
            style: {
              fontSize: "2.2rem",
              height: "100%",
            },
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
