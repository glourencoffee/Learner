import { Chip } from '@mui/material';
import { useChipSelectContext } from './ChipSelect';

export interface ChipSelectOptionProps<ContainedType> {
  label: string;
  value: ContainedType;
}

export default function ChipSelectOption<ContainedType>({
  label,
  value
}: ChipSelectOptionProps<ContainedType>): JSX.Element {

  const { isOptionSelected, setOptionSelected } = useChipSelectContext();

  return (
    <Chip
      label={label}
      color={isOptionSelected(value) ? 'primary' : undefined}
      onClick={() => setOptionSelected(value)}
    />
  );
}