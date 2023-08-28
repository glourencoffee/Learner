import { Backdrop, CircularProgress } from '@mui/material';

export interface ProgressBackdropProps {
  open: boolean;
}

/**
 * Renders a Material UI `<Backdrop>` that blocks the screen
 * with a `<CircularProgress>` if `props.open` is `true`.
 * 
 * Renders nothing `props.open` is `false`.
 * 
 * @param props The properties of this component.
 */
export default function ProgressBackdrop(props: ProgressBackdropProps): JSX.Element {
  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={props.open}
    >
      <CircularProgress />
    </Backdrop>
  );
}