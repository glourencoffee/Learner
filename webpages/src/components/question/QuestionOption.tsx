import { Avatar, ButtonBase, Stack } from '@mui/material';
import { blue, green, orange, red } from '@mui/material/colors';
import React from 'react';
import theme from '../../theme';

export type QuestionOptionColor = 'selected' | 'correct' | 'incorrect';

export type QuestionOptionBackgroundColor = (
  QuestionOptionColor | 'default'
);

export interface QuestionOptionProps {
  /**
   * The index of the option.
   * 
   * This is used to determine the option's letter: index 0 maps to
   * letter `'a'`; index 1, to letter `'b'`; and so on.
   */
  index: number;

  /**
   * The option's label.
   * 
   * This is the text containing a possible answer to a question.
   */
  label: React.ReactNode;

  /**
   * The background color of the question's letter.
   * 
   * This is seen as the option's main color.
   * 
   * @default undefined
   */
  color?: QuestionOptionColor;

  /**
   * The background color of the option component.
   * 
   * @default undefined
   */
  backgroundColor?: QuestionOptionBackgroundColor;

  /**
   * Whether the `onClick` action is disabled on an option.
   */
  disabled?: boolean;

  /**
   * A callback function for when the option is clicked.
   */
  onClick?: () => void;
}

/**
 * Renders an answer option for a question.
 * 
 * @param props The properties of this component.
 */
export default function QuestionOption({
  index,
  label,
  color,
  backgroundColor,
  disabled,
  onClick
}: QuestionOptionProps): JSX.Element {
  const indexLetter = String.fromCharCode('a'.charCodeAt(0) + index);

  let avatarBackgroundColor;
  
  switch (color) {
    case 'selected':
      avatarBackgroundColor = orange[500];
      break;

    case 'correct':
      avatarBackgroundColor = green[500];
      break;
    
    case 'incorrect':
      avatarBackgroundColor = red[500];
      break;
    
    default:
      avatarBackgroundColor = theme.palette.primary.dark;
  }

  let containerBackgroundColor;

  switch (backgroundColor) {
    case 'selected':
      containerBackgroundColor = orange[100];
      break;

    case 'correct':
      containerBackgroundColor = green[100];
      break;
    
    case 'incorrect':
      containerBackgroundColor = red[100];
      break;

    case 'default':
      containerBackgroundColor = blue[100];
      break;
  }

  return (
    <Stack
      direction='row'
      gap='0.75em'
      alignItems='center'
      justifyContent='start'
      sx={{
        width: '100%',
        backgroundColor: containerBackgroundColor,
        borderRadius: '20px',
        padding: '0.25em'
      }}
    >
      <ButtonBase
        tabIndex={-1}
        disabled={disabled}
        onClick={onClick}
      >
        <Avatar
          sx={{
            width: '1.6em',
            height: '1.6em',
            backgroundColor: avatarBackgroundColor
          }}
        >
          {indexLetter}
        </Avatar>
      </ButtonBase>
      {label}
    </Stack>
  );
}
