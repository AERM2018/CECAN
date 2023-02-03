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

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    (async () => {
      const sessionData = await getSession();
      if (sessionData) {
        if (!sessionData.user.token && Router.pathname !== "/login") {
          window.location.href = "/login";
        } else if (sessionData.user.token && Router.pathname === "/login") {
          // window.location.href = "/catalogoFarmacia";
        }
      }
    })();
    // const token = localStorage.getItem("token");
    // console.log(token);
    // console.log({ session });
    // console.log((!token || token != "") && Router.pathname !== "/login");
  }, []);

  const theme = createTheme({
    palette: {
      primary: { main: "#214d99" },
    },
  });

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
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </>
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
