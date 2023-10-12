import { useEffect, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';

export interface SearchBarProps {
  /**
   * Label of the search bar's text field.
   */
  label?: string;

  /**
   * A placeholder text for the search bar's text field.
   */
  placeholder?: string;

  /**
   * The maximum length of the search bar's text field.
   */
  maxLength?: number;

  /**
   * A text to set in the search bar's text field.
   */
  text?: string;

  /**
   * A callback function called when search is triggered.
   * 
   * @param text The text in the search bar's text field.
   */
  onSearchTrigger?: (text: string) => void;
}

export default function SearchBar(props: SearchBarProps): JSX.Element {
  const [text, setText] = useState('');

  useEffect(() => {
    const newText = props.text ?? '';

    if (newText != text) {
      setText(newText);
    }

  }, [props.text]);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function handleButtonClick() {
    props.onSearchTrigger?.(text);
  }

  return (
    <Stack
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
      useFlexGap
      gap='0.5em'
    >
      <TextField
        label={props.label}
        placeholder={props.placeholder}
        inputProps={{ maxLength: props.maxLength }}
        value={text}
        onChange={handleTextChange}
      />
      <Button onClick={handleButtonClick}>
        Search
      </Button>
    </Stack>
  );
}