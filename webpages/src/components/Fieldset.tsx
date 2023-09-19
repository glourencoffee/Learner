import {
  InputBaseComponentProps,
  Stack,
} from '@mui/material';
import TextField from './TextField';
import React from 'react';

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
 * The input root component requires a `ref` so that it can control the contained
 * element, which is an `<input>` or a `<textarea>`. However, we are not rendering
 * any input element at all, but rather a `<div>`. So, define a `<div>` component
 * with a forward reference so that React won't complain that a `ref` is expected,
 * though `ref` will be unused.
 */
const InputComponent = React.forwardRef(
  ({ children }: InputBaseComponentProps, _: React.ForwardedRef<HTMLTextAreaElement>) =>
(
  <Stack width='100%'>
    {children}
  </Stack>
));

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
  const {
    fullWidth,
    label,
    labelPosition = 'inside',
    helperText,
    error,
    disablePadding,
    children
  } = props;

  //==============================================================================
  // This component is implemented as <TextField> because using other UI elements
  // to make it look like a <TextField> results in a bad UX. This stems from the
  // fact that when a <fieldset> has a child <legend> element, the <legend> is
  // positioned *inside* of that <fieldset>, making its box different from that
  // of a <TextField>, which has its label positioned absolutely, *outside* of
  // its own <fieldset>. The result is a UI defect where the border of <fieldset>
  // is misaligned in comparison to that of a <TextField>. This is noticeable
  // when a <TextField> and a <fieldset> are layed out side by side.
  //
  // Although this problem could be workarounded by making <legend>'s position
  // absolute, this results in another bad UX where the <fieldset> has a full
  // border, that is, its border "crosses" the <legend> element.
  //
  // MUI <TextField> already solves these problems. Fortunaly, the <TextField>
  // component receives a prop `inputComponent` through `InputProps`, which
  // allow us to customize the internal component. We do that by using a <div>
  // for an internal component, instead of <input> or <textarea>. The result is
  // a MUI-fashioned <fieldset> that can work as a component group.
  //
  // See this thread: https://stackoverflow.com/questions/55032966
  //==============================================================================
  return (
    <TextField
      variant='outlined'
      multiline
      label={label}
      labelPosition={labelPosition}
      helperText={helperText}
      error={error}
      fullWidth={fullWidth}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: InputComponent,
        sx: {
          // Don't show text cursor, because we won't be editing anything.
          cursor: 'default',
          padding: disablePadding ? 0 : undefined
        }
      }}
      inputProps={{ children: children }}
    />
  );
}