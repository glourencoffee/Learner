import { Suspense, useMemo } from 'react';
import {  
  ButtonBase,
  Chip,
  ChipProps,
  Skeleton,
  Tooltip
} from '@mui/material';
import { Topic } from '../models';
import { Resource, createResource } from '../requests/createResource';
import { getTopic } from '../api/topic';

interface ChipWithoutLabelProps extends Omit<ChipProps, 'label'> {}

interface TopicChipWithResourceProps extends ChipWithoutLabelProps {
  topicResource: Resource<Topic>;
}

const PATH_SEPARATOR = ' / ';

function TopicChipWithResource({
  topicResource,
  ...props
}: TopicChipWithResourceProps): JSX.Element {
  const topic = topicResource.data.read();

  const path        = topic.path ?? [];
  const fullPath    = path.concat(topic.name);
  const partialPath = fullPath.slice(-2);

  const fullPathString    = fullPath.join(PATH_SEPARATOR);
  const partialPathString = partialPath.join(PATH_SEPARATOR);

  return (
    <Tooltip title={fullPathString} arrow>
      <ButtonBase href={`/topic/${topic.id}`}>
        <Chip
          {...props}
          label={partialPathString}
        />
      </ButtonBase>
    </Tooltip>
  );
}

function TopicChipSkeleton(): JSX.Element {
  return (
    <Skeleton
      variant='rounded'
      width={80}
      height={24}
      sx={{
        borderRadius: '18px'
      }}
    />
  );
}

export interface TopicChipProps extends ChipWithoutLabelProps {
  /**
   * The id of a topic.
   */
  topicId: number;
}

/**
 * Renders a MUI `<Chip>` for a topic's name together with a MUI `<Tooltip>`
 * for that topic's path.
 * 
 * @param props The properties of this component.
 */
export default function TopicChip({ topicId, ...props }: TopicChipProps): JSX.Element {
  const resource = useMemo(
    () => createResource(getTopic(topicId, { withPath: true })),
    [topicId]
  );

  return (
    <Suspense fallback={<TopicChipSkeleton />}>
      <TopicChipWithResource
        {...props}
        topicResource={resource}
      />
    </Suspense>
  );
}