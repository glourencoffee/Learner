import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  styled
} from '@mui/material';
import { ChevronLeft, Menu as MenuIcon } from '@mui/icons-material';

interface NavigationLink {
  readonly title: string;
  readonly path: string;
}

const navLinks: NavigationLink[] = [
  {
    title: 'Questions',
    path: '/question'
  },
  {
    title: 'Statistics',
    path: '/stats'
  },
  {
    title: 'Knowledge Areas',
    path: '/knowledgearea'
  }
];

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

export type NavigationElementLocation = 'expanded-navbar' | 'collapsed-navbar' | 'drawer-header';

export interface NavigationProps {
  /**
   * A function called for rendering an element in different locations.
   * 
   * @param location The location where the rendered element will be placed.
   * @returns An element.
   * @default undefined
   */
  renderElement?: (location: NavigationElementLocation) => JSX.Element;

  /**
   * The width of the drawer.
   * 
   * @default 240
   */
  drawerWidth?: number;
}

/**
 * Renders an adaptative navigation with links to main pages.
 * 
 * This component renders a `Box` which takes the full width of its parent.
 * The content of that box is dependent on the viewport size, as follows.
 * 
 * If the viewport is medium or above, the content of that box is a row-direction
 * flex box with navigation links. If the function `props.renderElement` is defined,
 * it is called with the location parameter `'expanded-navbar'` and the element
 * returned is placed before the navigation links, inside that flex box.
 * 
 * Conversely, if the screen size is less than medium, the content of that box is
 * a grid box with a menu icon button on the left. If `props.renderElement` is
 * defined, it is called with the location parameter `'collapsed-navbar'` and
 * the element returned is placed on the center of the grid box.
 * 
 * When the menu icon is pressed, it renders a MUI `<Drawer>`, which contains the
 * collapsed navigation links. The `<Drawer>` element also contains a header with
 * size equal to that of a MUI `<Toolbar>`. If `props.renderElement` is defined,
 * it is called with the location parameter `'drawer-header'` and the element
 * returned is rendered inside the drawer's header.
 *
 * @param props The properties of this component.
 */
export default function Navigation(props: NavigationProps): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleDrawerOpen(): void {
    setDrawerOpen(true);
  };

  function handleDrawerClose(): void {
    setDrawerOpen(false);
  };

  const {
    drawerWidth = 240,
    renderElement
  } = props;

  const listItems = navLinks.map(
    (link) => (
      <ListItem key={link.path} disablePadding>
        <ListItemButton href={link.path} onClick={handleDrawerClose}>
          <ListItemText
            sx={{ color: 'common.white' }}
          >
            {link.title}
          </ListItemText>
        </ListItemButton>
      </ListItem>
    )
  );

  const buttons = navLinks.map(
    (link) => (
      <Button
        key={link.path}
        href={link.path}
        onClick={handleDrawerClose}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        {link.title}
      </Button>
    )
  );

  return (
    <Box width='100%'>
      <Box // This box is only visible on extra-small screens.
        flexGrow={1}
        display={{ xs: 'grid', md: 'none' }}
        gridTemplateColumns='1fr auto 1fr'
        alignItems='center'
      >
        <IconButton
          size='large'
          onClick={handleDrawerOpen}
          color='inherit'
          sx={{
            justifySelf: 'start'
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box gridColumn='2 / 3' justifySelf='center'>
          {!drawerOpen && renderElement?.('collapsed-navbar')}
        </Box>
        <Drawer
          anchor='left'
          open={drawerOpen}
          onClose={handleDrawerClose}
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'primary.dark'
            },
          }}
        >
          <DrawerHeader>
            {renderElement?.('drawer-header')}
            <IconButton
              onClick={handleDrawerClose}
              sx={{ color: 'common.white' }}
            >
              <ChevronLeft />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {listItems}
          </List>
        </Drawer>
      </Box>
      <Box // This box is only visible on medium-sized screens and above.
        flexGrow={1}
        display={{ xs: 'none', md: 'flex' }}
        alignItems='center'
        gap='1.5em'
        padding='0 1em'
      >
        {renderElement?.('expanded-navbar')}
        <Stack direction='row'>
          {buttons}
        </Stack>
      </Box>
    </Box>
  );
}