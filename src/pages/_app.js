import "@/styles/globals.css";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "@/context/AuthProvider";
import configureAmplify from "@/config/serviceConfig";
const theme = createTheme({
  palette: {
    primary: {
      main: "#e2765a",
    },
  },
});
export default function App({ Component, pageProps }) {
  configureAmplify();
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
