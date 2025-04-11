import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#F5F5F5', // Fundo principal
      paper: '#FFFFFF', // Pra componentes como cards
    },
    text: {
      primary: '#333333', // Texto legível
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;