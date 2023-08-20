import { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
import LinkBehavior from './LinkBehavior';

interface MuiButtonBaseOptions {
  defaultProps?: ComponentsProps['MuiButtonBase'];
  styleOverrides?: ComponentsOverrides<Theme>['MuiButtonBase'];
  variants?: ComponentsVariants['MuiButtonBase'];
}

const MuiButtonBase: MuiButtonBaseOptions = {
  defaultProps: {
    LinkComponent: LinkBehavior
  }
};

export default MuiButtonBase;