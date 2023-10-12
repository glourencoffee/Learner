import { Stack, Typography } from '@mui/material';

export default function UnderConstruction(): JSX.Element {
  return (
    <Stack
      width='100%'
      height='100%'
      alignItems='center'
      justifyContent='center'
      padding='2em'
      textAlign='center'
    >
      <Typography
        variant='h3'
        sx={{
          maxWidth: '10em'
        }}
      >
        This page is under construction.
      </Typography>
      <Typography variant='h5'>
        Coming soon...
      </Typography>
    </Stack>
  );
}