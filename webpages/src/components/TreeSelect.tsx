import { useField } from 'formik';
import BaseTreeSelect, { TreeNode, BaseTreeSelectProps } from './BaseTreeSelect';

export interface TreeSelectWithFormFieldProps extends
  Omit<
    BaseTreeSelectProps,
    'value'    |
    'onChange' |
    'onBlur'
  >
{
  formField: true;
  name: string;
};

export interface TreeSelectWithoutFormFieldProps extends BaseTreeSelectProps {
  formField?: false;
  name?: string;
}

export type TreeSelectProps = (TreeSelectWithFormFieldProps | TreeSelectWithoutFormFieldProps);

/**
 * This component extends `<BaseTreeSelect>` so that is can be used with `<Form>`.
 * It requires a prop `name` which is the name of the form's field. The value
 * of that field is always a `TreeNode`. It should be processed by the `onSubmit`
 * prop of the associated form before being sent over POST or PUT.
 * 
 * @param props The properties of this component.
 */
export default function TreeSelect({ formField, name, ...props }: TreeSelectProps): JSX.Element {

  if (formField) {
    const [field, meta, helpers] = useField(name);

    function handleChange(node: TreeNode): void {
      helpers.setValue(node);
    }

    const hasError = Boolean(meta.error);

    return (
      <BaseTreeSelect
        {...props}
        helperText={meta.error || props.helperText}
        error={hasError}
        name={name}
        value={field.value}
        onChange={handleChange}
      />
    );
  }
  else {
    return <BaseTreeSelect name={name} {...props} />;
  }
}