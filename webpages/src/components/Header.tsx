import { AppBar, Link, Stack, Toolbar, Typography } from '@mui/material';
import Navigation from './Navigation';

const headerTitle = 'Learner';

function HomeLink(): JSX.Element {
  return (
    <Link
      href='/'
      underline='none'
      flexGrow={1}
    >
      <Stack
        flexDirection='row'
        gap='0.5em'
      >
        <img
          src='/logo.svg'
          alt='Logo'
          loading='lazy'
          width='32px'
          height='32px'
        />
        <Typography
          variant='h5'
          color='common.white'
        >
          {headerTitle}
        </Typography>
      </Stack>
    </Link>
  );
}

export default function Header(): JSX.Element {
  return (
    <AppBar position='sticky'>
      <Toolbar variant='dense' disableGutters>
        <Stack
          flexDirection='row'
          alignItems='center'
          padding='0 0.5em'
          gap='0.5em'
          flexGrow={1}
        > 
          <HomeLink />
          <Navigation />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}