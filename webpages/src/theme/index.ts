import { createTheme } from '@mui/material/styles';
import MuiButtonBase from './MuiButtonBase';
import MuiChip from './MuiChip';
import MuiLink from './MuiLink';
import palette from './Palette';

// A custom theme for this app
const theme = createTheme({
  palette,
  components: {
    MuiButtonBase,
    MuiChip,
    MuiLink
  }
});

export default theme;