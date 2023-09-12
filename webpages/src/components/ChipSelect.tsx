import { Stack } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

const ChipSelectContext = React.createContext<{
  isOptionSelected: (value: any) => boolean;
  setOptionSelected: React.Dispatch<React.SetStateAction<any>>;
} | undefined>(undefined);

export function useChipSelectContext() {
  return useContext(ChipSelectContext)!;
}

export interface ChipSelectProps<T> {
  value?: Set<T>;
  onChange?: (value: Set<T>) => void;
}

/**
 * Renders a box of selectable MUI `<Chip>`s.
 * 
 * @param props The properties of this component.
 */
export default function ChipSelect<T>({
  value,
  onChange,
  children
}: React.PropsWithChildren<ChipSelectProps<T>>): JSX.Element {
  const [selectedValue, setSelectedValue] = useState(new Set<T>());
  
  useEffect(
    () => setSelectedValue(value ?? new Set<T>()),
    [value]
  );

  function isOptionSelected(optionValue: T): boolean {
    return selectedValue.has(optionValue);
  }

  function setOptionSelected(optionValue: T): void {
    const newSelectedValue = new Set<T>(selectedValue);

    const existed = newSelectedValue.delete(optionValue);

    if (!existed) {
      newSelectedValue.add(optionValue);
    }

    setSelectedValue(newSelectedValue);
    onChange?.(newSelectedValue);
  }

  // type ItemProps = ChipSelectItemProps<ContainedType>;

  // const clonedChildren = React.Children.map(
  //   children,
  //   (child) => {
  //     if (React.isValidElement<React.ReactElement<ItemProps>>(child)) {
  //       child;
  //       return React.cloneElement<ItemProps>(
  //         child,
  //         {
  //           selected: (value) => selected.has(value)
  //           onClick: handleClick
  //         }
  //       )
  //     }
  //     else {
  //       return child;
  //     }
  //   }
  // );

  return (
    <ChipSelectContext.Provider value={{ isOptionSelected, setOptionSelected }}>
      <Stack
        direction='row'
        gap='0.5em'
        flexWrap='wrap'
        alignItems='center'
        justifyContent='center'
      >
        {children}
      </Stack>
    </ChipSelectContext.Provider>
  );
}