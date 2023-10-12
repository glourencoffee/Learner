import { DifficultyLevel } from '../../models';
import { ChipSelect, ChipSelectOption } from '../../components';

export interface DifficultyLevelSelectProps {
  /**
   * The set of selected difficulty levels.
   * 
   * @default []
   */
  value?: Set<DifficultyLevel>;

  /**
   * A callback function called when the selected value changes.
   * 
   * @param value A set of selected difficulty levels.
   */
  onChange?: (value: Set<DifficultyLevel>) => void;
}

/**
 * Renders a `<ChipSelect>` for difficulty levels.
 * 
 * @param props The properties of this component.
 */
export default function DifficultyLevelSelect({
  value,
  onChange
}: DifficultyLevelSelectProps): JSX.Element {
  return (
    <ChipSelect
      value={value}
      onChange={onChange}
    >
      <ChipSelectOption
        label='Easy'
        value={DifficultyLevel.EASY}
      />
      <ChipSelectOption
        label='Medium'
        value={DifficultyLevel.MEDIUM}
      />
      <ChipSelectOption
        label='Hard'
        value={DifficultyLevel.HARD}
      />
    </ChipSelect>
  );
}