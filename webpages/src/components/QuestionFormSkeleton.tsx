import { Skeleton, Stack } from '@mui/material';

interface FieldProps {
  centralHeight: string;
}

const Field = ({ centralHeight }: FieldProps) =>
(
  <Stack>
    <Skeleton
      variant='text'
      width='100px'
    />
    <Skeleton
      variant='rounded'
      height={centralHeight}
    />
    <Skeleton
      variant='text'
      width='240px'
      height='16px'
      sx={{
        marginLeft: '1em'
      }}
    />
  </Stack>
);

const Button = () =>
(
  <Skeleton
    variant='rounded'
    width='80px'
    height='22px'
    sx={{
      marginTop: '0.25em'
    }}
  />
);

/**
 * Renders a skeleton of `<QuestionForm>`.
 */
export default function QuestionFormSkeleton(): JSX.Element {
  return (
    <Stack
      gap='1.25em'
      padding='2em'
    >
      <Field centralHeight='54px' />
      <Field centralHeight='190px' />
      <Field centralHeight='54px' />
      <Field centralHeight='110px' />
      <Field centralHeight='128px' />
      <Stack
        alignSelf='center'
        direction='row'
        gap='0.5em'
      >
        <Button />
        <Button />
      </Stack>
    </Stack>
  );
}