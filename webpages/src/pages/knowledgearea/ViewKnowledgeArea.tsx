import React, { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { Navigate, Params, useLocation, useParams } from 'react-router-dom';
import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import {
  ChevronRight,
  Edit,
  ExpandMore,
  NorthEast,
  SouthWest
} from '@mui/icons-material';
import { nanoid } from 'nanoid';
import { Resource, createResource } from '../../requests';
import { getChildrenOfKnowledgeArea, getKnowledgeArea } from '../../api';
import { ProgressBackdrop } from '../../components';

function ItemLabelIconButton({ href, children }: PropsWithChildren<{ href: string }>): JSX.Element {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>): void {
    // Don't let parent element (<TreeItem>) know that a click happened here.
    // Otherwise, it will expand/collapse this component, which is bad UX.
    event.stopPropagation();
  }

  return (
    <IconButton
      size='small'
      href={href}
      onClick={handleClick}
    >
      {children}
    </IconButton>
  );
}

interface ItemLabelProps {
  id: number;
  name: string;
  type: 'area' | 'topic';
}

function ItemLabel({ id, name, type }: ItemLabelProps): JSX.Element {
  let viewUrl;
  let editUrl;

  if (type === 'area') {
    viewUrl = `/knowledgearea/${id}`;
    editUrl = `/knowledgearea/${id}/edit`;
  }
  else {
    viewUrl = `/topic/${id}`;
    editUrl = `/topic/${id}/edit`;
  }

  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
    >
      <Stack
        direction='row'
        gap='0.5em'
      >
        <Typography>{name}</Typography>
        <Chip
          variant='monospaced'
          size='small'
          label={type}
        />
        <Chip
          variant='monospaced'
          size='small'
          label={`id: ${id}`}
        />
      </Stack>
      <Stack direction='row'>
        <ItemLabelIconButton href={editUrl}>
          <Edit />
        </ItemLabelIconButton>
        <ItemLabelIconButton href={viewUrl}>
          <NorthEast />
        </ItemLabelIconButton>
      </Stack>
    </Stack>
  );
}

interface ItemResultProps {
  id: number,
  name: string;
  childrenResource: Resource<Awaited<ReturnType<typeof getChildrenOfKnowledgeArea>>>;
}

function ItemResult({ id, name, childrenResource }: ItemResultProps): React.ReactNode {
  const children = childrenResource.data.read();
  const childElements = children.map((child) => <Item key={nanoid()} {...child} />);

  return (
    <TreeItem
      nodeId={`area-${id}`}
      label={
        <ItemLabel id={id} name={name} type='area' />
      }
    >
      {childElements}
    </TreeItem>
  );
}

interface ItemProps {
  id: number;
  name: string;
  type: 'area' | 'topic';
}

function Item(props: ItemProps): JSX.Element {
  if (props.type === 'area') {
    const childrenResource = createResource(getChildrenOfKnowledgeArea(props.id));

    return (
      <Suspense fallback={'Loading...'}>
        <ItemResult {...props} childrenResource={childrenResource} />
      </Suspense>
    );
  }
  else {
    return (
      <TreeItem
        nodeId={`topic-${props.id}`}
        label={
          <ItemLabel {...props} />
        }
      />
    );
  }
}

async function getKnowledgeAreaWithChildren(areaId: number) {
  const [area, children] = await Promise.all([
    getKnowledgeArea(areaId),
    getChildrenOfKnowledgeArea(areaId)
  ]);

  return {
    area,
    children
  };
}

interface ViewKnowledgeAreaResultProps {
  resource: Resource<Awaited<ReturnType<typeof getKnowledgeAreaWithChildren>>>;
}

function ViewKnowledgeAreaResult({ resource }: ViewKnowledgeAreaResultProps): React.ReactNode {
  const { area, children } = resource.data.read();

  if (children.length < 1) {
    return (
      <Stack
        height='100%'
        alignItems='center'
        justifyContent='center'
      >
        <Typography
          variant='h5'
          textAlign='center'
        >
          {area.name} does not have any contents yet.
        </Typography>
      </Stack>
    );
  }

  let iconButtonElement;

  // If this area has a parent, show a button that redirects it
  // to its parent's page.
  if (area.parentId !== null) {
    const parentViewUrl = `/knowledgearea/${area.parentId}`;

    iconButtonElement = (
      <IconButton
        size='small'
        href={parentViewUrl}
      >
        <SouthWest fontSize='small' />
      </IconButton>
    );
  }

  const items = children.map((child) => <Item key={nanoid()} {...child} />);

  return (
    <Stack
      gap='1em'
      padding='1em'
      justifyContent='center'
    >
      <Stack
        direction='row'
        alignItems='center'
        gap='0.25em'
      >
        <Typography variant='h5'>
          {area.name}
        </Typography>
        {iconButtonElement}
      </Stack>
      <Paper elevation={3} sx={{ padding:'0.5em' }}>
        <TreeView
          defaultExpandIcon={<ChevronRight />}
          defaultCollapseIcon={<ExpandMore />}
        >
          {items}
        </TreeView>
      </Paper>
    </Stack>
  );
}

interface ValidatedParams {
  areaId: number | null;
}

function validateParams(params: Readonly<Params<string>>): ValidatedParams {
  const { areaId } = params;

  return {
    areaId: parseInt(areaId ?? '') || null 
  };
}

export default function ViewKnowledgeArea(): JSX.Element {
  const location = useLocation();
  const params = validateParams(useParams());
  const [areaId, setAreaId] = useState(params.areaId);

  useEffect(() => {
    setAreaId(params.areaId);
  }, [location])

  if (areaId === null) {
    return <Navigate to='/' />;
  }
  
  const resource = createResource(getKnowledgeAreaWithChildren(areaId));

  return (
    <Suspense fallback={<ProgressBackdrop open />}>
      <ViewKnowledgeAreaResult resource={resource} />
    </Suspense>
  );
}