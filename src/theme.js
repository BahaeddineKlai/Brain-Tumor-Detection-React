import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // blue
        },
        secondary: {
            main: "#009688", // teal
        },
    },
    shape: {
        borderRadius: 12,
    },
});

export default theme;
