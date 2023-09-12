import ChipSelect from './ChipSelect';
import ChipSelectOption from './ChipSelectItem';
import { QuestionType } from '../models';

export interface QuestionTypeSelectProps {
  /**
   * The set of selected question types.
   * 
   * @default []
   */
  value?: Set<QuestionType>;

  /**
   * A callback function called when the selected value changes.
   * 
   * @param value A set of selected question types.
   */
  onChange?: (value: Set<QuestionType>) => void;
}

/**
 * Renders a `<ChipSelect>` for question types.
 * 
 * @param props The properties of this component.
 */
export default function QuestionTypeSelect({
  value,
  onChange
}: QuestionTypeSelectProps): JSX.Element {
  return (
    <ChipSelect
      value={value}
      onChange={onChange}
    >
      <ChipSelectOption
        label='Boolean'
        value={QuestionType.BOOLEAN}
      />
      <ChipSelectOption
        label='Multiple-Choice'
        value={QuestionType.MULTIPLE_CHOICE}
      />
    </ChipSelect>
  );
}