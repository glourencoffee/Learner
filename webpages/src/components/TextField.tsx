import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  TextFieldVariants,
  Typography
} from '@mui/material';

export type TextFieldLabelPositions = 'inside' | 'outside';

export type TextFieldProps<
  Variant extends TextFieldVariants = TextFieldVariants
> = (
  MuiTextFieldProps<Variant> & {
    /**
     * Where to place the label.
     * 
     * @default 'outside'
     */
    labelPosition?: TextFieldLabelPositions;
  }
);

/**
 * This component extends Material UI `<TextField>` so that its label can be placed
 * outside the input element, since Material UI always places the label inside the
 * input element.
 * 
 * If `props.labelPosition` is `'inside'`, behaves similarly to a Material UI
 * `<TextField>`. Otherwise, renders a text field with its label placed outside,
 * on top of the input element.
 * 
 * @param props The properties of this component.
 * @returns 
 */
export default function TextField(props: TextFieldProps): JSX.Element {
  const {
    variant,
    label,
    labelPosition,
    required,
    ...rest
  } = props;

  let labelElement;
  const InputLabelProps = rest.InputLabelProps ?? {};
  const InputProps = rest.InputProps ?? {};

  if (label && labelPosition !== 'inside') {
    // When used as a label for a Material UI <TextField> with variant
    // "standard", the <Typography> below results in an unnecessary gap
    // between the <label> component and the root of the <input> component.
    // This gap comes in part (see `InputProps` below) from the typography's
    // line height. Remove it for variant "standard".
    //
    // The line height also affects the other variants a little. For them,
    // adjust it to 1.8.
    const lineHeight = (variant === 'standard') ? 0 : 1.8;

    labelElement = (
      <Typography variant='overline' lineHeight={lineHeight}>
        {label}
        {required ? ' *' : undefined}
      </Typography>
    );

    // Show label only as a normal-sized text.
    InputLabelProps.shrink = false;

    // This shows the required asterisk next to the label's text.
    // Disable it, because the default asterisk uses the common
    // font style, not the overline variant (as above). That's
    // why we are setting our own asterisk above.
    InputLabelProps.required = false;

    InputLabelProps.sx = {
      ...InputLabelProps.sx, 

      // Make the label's position follow the parent's component layout.
      // By default, Material UI uses absolute positioning to lay the
      // label over the text input area. We don't want that. We want
      // the label to placed above the input area.
      position: 'static',

      // Besides using absolute positioning, Material UI transforms the
      // position of the label so that it is positioned somewhere at the
      // beginning. This results in a wrong offset effect when `position`
      // is `'static'`, as set above. So, disable this property as well.
      transform: 'none',

      // This option will only be meaningful for variant "standard".
      lineHeight: 1
    };

    // The variant "standard" adds a top margin in the root div of the
    // <input> component. This margin is intended to give extra space
    // for the <label>, which is placed there by absolute positioning.
    // Since we have defined our label element to static positioning,
    // this top margin would result in a too long gap between the label
    // and the input root. Remove it.
    if (variant === 'standard') {
      if (InputProps.slotProps === undefined) {
        InputProps.slotProps = {};
      }

      if (InputProps.slotProps.root === undefined) {
        InputProps.slotProps.root = {}
      }

      const rootStyle = InputProps.slotProps.root.style;

      InputProps.slotProps.root.style = { ...rootStyle, marginTop: 0 };
    }
  }
  else {
    labelElement = label;
  }

  return (
    <MuiTextField
      {...rest}
      variant={variant}
      label={labelElement}
      InputLabelProps={InputLabelProps}
      InputProps={InputProps}
    />
  );
}