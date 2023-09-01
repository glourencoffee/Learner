import { useField, useFormikContext } from 'formik';
import BaseTextField, { BaseTextFieldProps } from './BaseTextField';

/**
 * A text field used as a form field provides the prop `formField`, and must:
 * - provide the prop `name`
 * - provide neither the props `value`, `onChange`, nor `onBlur`, because
 *   the form field is uncontrolled from the client's perspective.
 */
type TextFieldWithFormFieldProps = (
  Omit<
    BaseTextFieldProps,
    'value'    |
    'onChange' |
    'onBlur'
  > & {
    formField: true;
    name: string;
  }
)

/**
 * A text field which is not used as a form field either provides the prop
 * `formField` as `false` or leaves it `undefined`. The prop `name` is optional.
 */
type TextFieldWithoutFormFieldProps = (
  BaseTextFieldProps & {
    formField?: false;
    name?: string;
  }
)

export type TextFieldProps = (TextFieldWithFormFieldProps | TextFieldWithoutFormFieldProps)

/**
 * This component extends `<BaseTextField>` to allow it to be used in a `<Form>` and
 * access the form's context. To use it as a form field, pass the prop `formField`
 * as `true`.
 * 
 * When used as a form field, it styles the label, input, and helper text elements so
 * that they get colored when this field has an invalid value on its associated form.
 * 
 * @param props The properties of this component.
 * @returns 
 */
export default function TextField({
  formField,
  name,
  ...props
}: TextFieldProps): JSX.Element {

  if (formField) {
    const formik = useFormikContext();
    const [field, meta] = useField(name);

    const hasError = Boolean(meta.error);

    return (
      <BaseTextField
        {...props}
        name={name}
        helperText={meta.error || props.helperText}

        InputProps={{
          error: hasError
        }}
        InputLabelProps={{
          error: hasError
        }}
        FormHelperTextProps={{
          error: hasError
        }}

        value={field.value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    );
  }
  else {
    return <BaseTextField name={name} {...props} />;
  }
}