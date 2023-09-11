import {
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Typography
} from '@mui/material';

export interface FieldsetProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  disablePadding?: boolean;
}

/**
 * This component renders a `<fieldset>` in a `<Form>` field style.
 * It takes a `label`, a `helperText`, and an `error` props and renders
 * them similarly to a `<TextField>`.
 * 
 * It is useful for grouping many child components which constitute a single
 * form field.
 * 
 * @param props The properties of this component.
 */
export default function Fieldset(props: React.PropsWithChildren<FieldsetProps>): JSX.Element {
  let labelElement;

  if (props.label) {
    labelElement = (
      <FormLabel error={props.error}>
        <Typography
          variant='overline'
          color='inherit'
          lineHeight={1}
          gutterBottom
        >
          {props.label}
        </Typography>
      </FormLabel>
    );
  }
  
  let helperTextElement;

  if (props.helperText) {
    helperTextElement = (
      <FormHelperText
        error={props.error}
        margin='dense'
      >
        {props.helperText}
      </FormHelperText>
    );
  }

  return (
    <FormControl>
      {labelElement}
      <Stack
        component='fieldset'
        borderRadius='4px'
        sx={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: props.error ? 'error.main' : undefined
        }}
        gap='1em'
        padding={props.disablePadding ? 0 : '1em'}
        margin={0}
      >
        {props.children}
      </Stack>
      {helperTextElement}
    </FormControl>
  );
}