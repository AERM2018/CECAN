import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import { store } from "store/store";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { Toaster } from "react-hot-toast";
import { useAppDispatch } from "hooks/hooks";
import { startLogin, renewToken } from "store/auth/thunks";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/system";
import { useGetAccess } from "hooks/useGetAccess";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    (async () => {
      const sessionData = await getSession();
      // For now, we are not using the session data, until we have a way to get the user allowed routes inside this hook
      // if(!sessionData){
      // }
      Router.push("/login");
    })();
    // const token = localStorage.getItem("token");
    // console.log(token);
    // console.log({ session });
    // console.log((!token || token != "") && Router.pathname !== "/login");
  }, []);

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <>
          <Toaster
            toastOptions={{
              style: {
                fontSize: "2.2rem",
                height: "100%",
              },
            }}
          />
          <Component {...pageProps} />
        </>
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
