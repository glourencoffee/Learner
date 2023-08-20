import { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';

interface MuiChipOptions {
  defaultProps?: ComponentsProps['MuiChip'];
  styleOverrides?: ComponentsOverrides<Theme>['MuiChip'];
  variants?: ComponentsVariants['MuiChip'];
};

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    monospaced: true;
  }
}

const MuiChip: MuiChipOptions = {
  variants: [
    {
      props: { variant: 'monospaced' },
      style: {
        fontFamily: 'monospace'
      }
    }
  ]
};

export default MuiChip;