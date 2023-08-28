import { useField, useFormikContext } from 'formik';
import TextField from './TextField';

export interface FormTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
}

/**
 * This component extends Material UI `<TextField>` for it to be used specifically
 * in a `<form>`. It adapts the `label` property so that it is layed out above the
 * input component, rather than inside of it. Also, it styles the label, input, and
 * helper text elements so that they get colored when this field has an invalid value
 * on its associated form.
 * 
 * @param props The properties of this component.
 * @returns 
 */
export default function FormTextField({
  name,
  label,
  placeholder,
  helperText
}: FormTextFieldProps): JSX.Element {

  const formik = useFormikContext();
  const [field, meta] = useField(name);

  const hasError = Boolean(meta.error);

  return (
    <TextField
      name={name}
      label={label}
      placeholder={placeholder}
      helperText={meta.error || helperText}

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