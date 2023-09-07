import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  TextFieldVariants,
  Typography
} from '@mui/material';
import './BaseTextField.css';

export type TextFieldLabelPositions = 'inside' | 'outside';

export type BaseTextFieldProps = (
  Omit<MuiTextFieldProps, 'variant'> & {
    /**
     * The variant to use.
     * 
     * @default 'outlined'
     */
    variant?: TextFieldVariants;

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
export default function BaseTextField(
  props: BaseTextFieldProps
): JSX.Element {
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

    // Must be set to `true`. Otherwise, `props.placeholder` is not shown.
    // See wall-text comment below.
    InputLabelProps.shrink = true;

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

    if (InputProps.slotProps === undefined) {
      InputProps.slotProps = {};
    }

    if (InputProps.slotProps.root === undefined) {
      InputProps.slotProps.root = {};
    }

    // The variant "standard" adds a top margin in the root div of the
    // <input> component. This margin is intended to give extra space
    // for the <label>, which is placed there by absolute positioning.
    // Since we have defined our label element to static positioning,
    // this top margin would result in a too long gap between the label
    // and the input root. Remove it.
    if (variant === 'standard') {
      const rootStyle = InputProps.slotProps.root.style;

      InputProps.slotProps.root.style = { ...rootStyle, marginTop: 0 };
    }

    // MUI is not very flexible for positioning a `TextField`'s label
    // above the text field component. The problem we have here is
    // wanting to show the placeholder text (`props.placeholder`),
    // which doesn't get shown when a custom label (`labelElement`)
    // is used together with the prop `InputLabelProps.shrink` set to
    // `false`. This is due to the behavior of `InputLabelProps`,
    // which is described below:
    // - If `InputLabelProps.shrink` is `false`, the custom label element
    //   is shown without a problem, but the placeholder is not shown at all.
    // - If `InputLabelProps.shrink` is `true`, the placeholder is shown,
    //   but the root element (`InputProps.slotProps.root`) will include
    //   a `<fieldset>` element with a `<span>` grandchild element. This
    //   `<span>` causes a bad effect of a blank space being shown.
    //
    // When `InputLabelProps.shrink` is `true`, the `<fieldset>` element
    // is structured as follows:
    // - `<fieldset>` has `<legend>` child. Removing either `<fieldset>` or
    //   `<legend>` results in a bad visual effect where `<fieldset>` occupies
    //   more space than it should. That is, `<TextField>`'s height increases
    //   beyond its standard. Therefore, both of these elements should be present.
    // - Under `<legend>`, there is a `<span>` element used as a container.
    //   If this `<span>` is removed or hidden (`display: none`) entirely,
    //   the `<TextField>` keeps its standard height and the placeholder is shown.
    //
    // This is what the code below is doing: applying a CSS class to hide this
    // span so that we can have a custom `<TextField>` with *both* an outer label
    // and a placeholder text.
    const rootClasses = InputProps.slotProps.root.className ?? '';
    InputProps.slotProps.root.className = rootClasses + ' hide-legend-span';
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