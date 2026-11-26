
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#795548",
      dark: "#4E342E",
      light: "#A1887F",
    },
    secondary: {
      main: "#D7A86E",
    },
    background: {
      default: "#F7F3EE",
      paper: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;
