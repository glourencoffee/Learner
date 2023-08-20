import { ComponentsOverrides, ComponentsProps, ComponentsVariants, LinkProps, Theme } from '@mui/material';
import LinkBehavior from './LinkBehavior';

interface MuiLinkOptions {
  defaultProps?: ComponentsProps['MuiLink'];
  styleOverrides?: ComponentsOverrides<Theme>['MuiLink'];
  variants?: ComponentsVariants['MuiLink'];
}

const MuiLink: MuiLinkOptions = {
  defaultProps: {
    component: LinkBehavior
  } as LinkProps
};

export default MuiLink;