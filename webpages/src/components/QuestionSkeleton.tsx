import { Paper, Skeleton, Stack } from '@mui/material';

interface ChipSkeletonProps {
  width?: string;
}

const ChipSkeleton = ({ width }: ChipSkeletonProps) =>
(
  <Skeleton
    variant='rounded'
    width={width ?? '60px'}
    height='24px'
    sx={{
      borderRadius: '20px'
    }}
  />
);

const TitleSkeleton = () =>
(
  <Skeleton
    variant='text'
    width='100px'
    height='40px'
  />
);

const AnswerOptionSkeleton = () =>
(
  <Stack
    direction='row'
    gap='0.75em'
    alignItems='center'
  >
    <Skeleton
      variant='circular'
      width='32px'
      height='32px'
    />
    <Stack sx={{ width: '100%' }}>
      <Skeleton
        variant='text'
        width='100%'
        height='20px'
      />
      <Skeleton
        variant='text'
        width='80%'
        height='20px'
      />
    </Stack>
  </Stack>
);

/**
 * Renders a MUI `<Skeleton>` for `<Question>`.
 */
export default function QuestionSkeleton(): JSX.Element {
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25em',
        padding: '1em'
      }}
    >
      <Stack
        direction='row'
        gap='0.5em'
        flexWrap='wrap'
      >
        <ChipSkeleton width='90px' />
        <ChipSkeleton width='48px' />
        <ChipSkeleton width='120px' />
      </Stack>
      <Stack>
        <TitleSkeleton />
        <Skeleton variant='text' />
        <Skeleton variant='text' />
        <Skeleton variant='text' width='80%' />
      </Stack>
      <Stack gap='0.75em'>
        <TitleSkeleton />
        <Stack gap='0.5em'>
          <AnswerOptionSkeleton />
          <AnswerOptionSkeleton />
        </Stack>
      </Stack>
      <Skeleton
        variant='rounded'
        width='92px'
        height='32px'
        sx={{
          alignSelf: 'center'
        }}
      />
    </Paper>
  );
}