import {
  AppBar,
  Box,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import Navigation from './Navigation';

const Logo = () =>
(
  <Box
    component='img'
    src='/logo.svg'
    alt='Logo'
    loading='eager'
    width='32px'
    height='32px'
    sx={{ marginRight: '0.5em' }}
  />
);

interface TitleProps {
  showLogo?: boolean;
}

function Title({ showLogo }: TitleProps): JSX.Element {
  let logoElement;

  if (showLogo) {
    logoElement = <Logo />;
  }

  return (
    <Stack direction='row'>
      {logoElement}
      <Typography
        variant='h5'
        noWrap
        component='a'
        href='/'
        sx={{
          fontWeight: 700,
          color: 'common.white',
          textDecoration: 'none',
        }}
      >
        Learner
      </Typography>
    </Stack>
  );
}

export default function Header(): JSX.Element {
  return (
    <AppBar position='static'>
      <Toolbar disableGutters>
        <Navigation
          renderElement={
            (location) => <Title showLogo={location !== 'collapsed-navbar'}/>
          }
        />
      </Toolbar>
    </AppBar>
  );
}