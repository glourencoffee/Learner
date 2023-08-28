import { useField } from 'formik';
import TreeSelect, { TreeNode, TreeSelectProps } from './TreeSelect';

type FormTreeSelectProps = (
  Omit<TreeSelectProps, 'value'> &
  Omit<TreeSelectProps, 'onChange'> & {
    name: string;
  }
);

/**
 * This component extends `<TreeSelect>` so that is can be used with `<Form>`.
 * It requires a prop `name` which is the name of the form's field. The value
 * of that field is always a `TreeNode`. It should be processed by the `onSubmit`
 * prop of the associated form before being sent over POST or PUT.
 * 
 * @param props The properties of this component.
 */
export default function FormTreeSelect({ name, ...rest }: FormTreeSelectProps): JSX.Element {

  const [field, _, helpers] = useField(name);

  function handleChange(node: TreeNode): void {
    helpers.setValue(node);
  }

  return (
    <TreeSelect
      {...rest}
      name={name}
      value={field.value}
      onChange={handleChange}
    />
  );
}