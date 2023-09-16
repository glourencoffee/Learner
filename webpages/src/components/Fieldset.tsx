import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Typography
} from '@mui/material';
import theme from '../theme';

export type FieldsetLabelPositions = 'inside' | 'outside';

export interface FieldsetProps {
  /**
   * A label to display with the fieldset.
   * 
   * @default undefined
   */
  label?: string;

  /**
   * Where to place `props.label`, if provided.
   * 
   * @default 'inside'
   */
  labelPosition?: FieldsetLabelPositions;

  /**
   * Whether the component uses all width of its parent.
   * 
   * @default false
   */
  fullWidth?: boolean;

  /**
   * A helper text to display below the fieldset.
   * 
   * @default undefined
   */
  helperText?: string;

  /**
   * Whether to style the component with error colors.
   * 
   * @default false
   */
  error?: boolean;

  /**
   * Whether to disable the fieldset's padding.
   * 
   * @default false
   */
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
  let legendElement;

  if (props.label) {
    if (props.labelPosition === 'outside') {
      labelElement = (
        <FormLabel error={props.error}>
          <Typography
            variant='overline'
            color='inherit'
            lineHeight={1}
            gutterBottom
            noWrap
          >
            {props.label}
          </Typography>
        </FormLabel>
      );
    }
    else {
      legendElement = (
        <Box
          component='legend'
          sx={{
            position: 'absolute',
            top: '-14px',
            left: '9px',
            backgroundColor: theme.palette.background.default,
            zIndex: -1
          }}
        >
          <FormLabel error={props.error}>
            <Typography
              variant='caption'
              color='inherit'
              padding='0 3px'
              noWrap
            >
              {props.label}
            </Typography>
          </FormLabel>
        </Box>
      );
    }
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
    <FormControl fullWidth={props.fullWidth}>
      {labelElement}
      <Stack
        component='fieldset'
        borderRadius='4px'
        sx={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: props.error ? 'error.main' : undefined,
          zIndex: -1
        }}
        gap='1em'
        padding={props.disablePadding ? 0 : '0.7em'}
        margin={0}
      >
        {legendElement}
        {props.children}
      </Stack>
      {helperTextElement}
    </FormControl>
  );
}