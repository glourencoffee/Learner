import React, { useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import {
  KnowledgeAreaTreeSelect,
  KnowledgeAreaTreeNode,
  KnowledgeAreaTreeRootNode,
  ProgressBackdrop,
  TreeNodeBreadcrumbs
} from '../../components';

interface ItemProps {
  secondaryAction?: React.ReactNode;
}

const Item = ({
  secondaryAction,
  children
}: React.PropsWithChildren<ItemProps>) =>
(
  <ListItem secondaryAction={secondaryAction}>
    <ListItemText
      sx={{
        marginRight: '0.5em'
      }}
    >
      {children}
    </ListItemText>
  </ListItem>
);

interface TopicSelectItemProps {
  root: KnowledgeAreaTreeRootNode;
  topics: KnowledgeAreaTreeNode[];
  onAddTopic?: (topicId: number) => void;
}

function TopicSelectItem({ root, topics, onAddTopic }: TopicSelectItemProps): JSX.Element {
  const [selectedTopic, setSelectedTopic] = useState<KnowledgeAreaTreeNode>(root);

  function handleActionClick(): void {
    if (!selectedTopic.isRoot()) {
      onAddTopic?.(selectedTopic.id);
      setSelectedTopic(root);
    }
  }

  const addAction = (
    <IconButton
      size='small'
      sx={{
        color: green[500]
      }}
      disabled={selectedTopic.isRoot()}
      onClick={handleActionClick}
    >
      <AddCircle />
    </IconButton>
  );

  function isNodeDisabled(node: KnowledgeAreaTreeNode): boolean {
    return (node.type === 'topic' && topics.some((topic) => topic.id === node.id));
  }

  return (
    <Item secondaryAction={addAction}>
      <KnowledgeAreaTreeSelect
        variant='standard'
        root={root}
        value={selectedTopic}
        onChange={setSelectedTopic}
        isBranchSelectable={() => false}
        isNodeDisabled={isNodeDisabled}
        showPath
      />
    </Item>
  );
}

interface TopicItemProps {
  topic: KnowledgeAreaTreeNode;
  onRemoveTopic?: () => void;
}

function TopicItem({ topic, onRemoveTopic }: TopicItemProps): JSX.Element {
  const removeAction = (
    <IconButton
      size='small'
      sx={{ color: red[500] }}
      onClick={onRemoveTopic}
    >
      <RemoveCircle />
    </IconButton>
  );

  function getNodeUrl(node: KnowledgeAreaTreeNode): string {
    switch (node.type) {
      case 'area':  return `/knowledgearea/${node.id}`;
      case 'topic': return `/topic/${node.id}`;
      
      default:
        return '/';
    }
  }

  return (
    <Item secondaryAction={removeAction}>
      <TreeNodeBreadcrumbs
        node={topic}
        getUrl={(node) => getNodeUrl(node as KnowledgeAreaTreeNode)}
        maxItems={3}
      />
    </Item>
  );
}

interface TopicListSelectState {
  root: KnowledgeAreaTreeNode;
  topics: KnowledgeAreaTreeNode[];
}

interface TopicListSelectWithRootProps
  extends TopicListSelectState
{
  onAddTopic?: (topicId: number) => void;
  onRemoveTopic?: (topicId: number, index: number) => void;
}

function TopicListSelectWithRoot({
  root,
  topics,
  onAddTopic,
  onRemoveTopic
}: TopicListSelectWithRootProps): JSX.Element {

  const topicItems = topics.map(
    (topic, index) => (
      <Collapse key={index} timeout={600}>
        <TopicItem
          topic={topic}
          onRemoveTopic={() => onRemoveTopic?.(topic.id, index)}
        />
      </Collapse>
    )
  );

  const items = (
    (topicItems.length > 0)
    ? topicItems
    : (
      <Collapse key={'no-topic'} timeout={600}>
        <Item>No topic selected.</Item>
      </Collapse>
    )
  );

  return (
    <List disablePadding>
      <TopicSelectItem
        root={root}
        topics={topics}
        onAddTopic={onAddTopic}
      />
      <Divider />
      <TransitionGroup component={null}>
        {items}
      </TransitionGroup>
    </List>
  );
}

export interface TopicListSelectProps {
  /**
   * The ids of the topics currently selected.
   * 
   * @default []
   */
  topicIds?: number[];

  /**
   * A callback function called when a topic is added.
   * 
   * @param topicId A topic id.
   * 
   * @default undefined
   */
  onAddTopic?: (topicId: number) => void;

  /**
   * A callback function called when a topic is removed.
   * 
   * @param topicId A topic id.
   * @param index The index of the topic in the list.
   * 
   * @default undefined
   */
  onRemoveTopic?: (topicId: number, index: number) => void;
}

/**
 * Renders a component that selects topics and lists them.
 * 
 * This component is controlled, which means that insertion and removal
 * logic should be handled by client, as otherwise it will have no effect.
 * 
 * @param props The properties of this component.
 */
export default function TopicListSelect(props: TopicListSelectProps): JSX.Element {
  const [state, setState] = useState<TopicListSelectState>();

  useEffect(() => {
    async function setTopics(): Promise<void> {
      let root;

      if (state === undefined) {
        root = new KnowledgeAreaTreeRootNode();
      }
      else {
        root = state.root;
      }

      const topicIds = new Set(props.topicIds ?? []);
      const topics   = new Array<KnowledgeAreaTreeNode>();

      // TODO: improve this lookup
      for (const topicId of topicIds) {
        const child = await root.getChild((child) => child.type === 'topic' && child.id === topicId);

        if (child === null) {
          console.log("Couldn't find a child topic with id " + topicId);
          continue;
        }
        else {
          topics.push(child);
        }
      }

      setState({root, topics});
    }

    setTopics();

  }, [props.topicIds]);

  if (state === undefined) {
    return <ProgressBackdrop open />;
  }
  else {
    return (
      <TopicListSelectWithRoot
        {...state}
        onAddTopic={props.onAddTopic}
        onRemoveTopic={props.onRemoveTopic}
      />
    );
  }
}