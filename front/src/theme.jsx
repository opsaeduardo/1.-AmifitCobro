import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#3498db' },
        secondary: { main: '#2ecc71' },
    },
    customColors: {
        yellow: '#F4D100',
        black: '#000000',
    },
});

export default theme;