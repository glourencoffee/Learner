import { Suspense, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography
} from '@mui/material';
import usePromise from 'react-promise-suspense';
import { nanoid } from 'nanoid';
import { getTopLevelKnowledgeAreas } from '../../requests/knowledgeArea';
import SearchBar from '../../components/SearchBar';
import AlphabeticPagination from '../../components/AlphabeticPagination';

interface TopLevelKnowledgeArea {
  id?: number;
  name: string;
}

function TopLevelKnowledgeAreaCard(props: TopLevelKnowledgeArea): JSX.Element {
  let idElement;

  if (props.id !== undefined) {
    idElement = (
      <Chip
        variant='monospaced'
        size='small'
        color='secondary'
        label={`id: ${props.id}`}
      />
    );
  }

  const viewUrl = `/knowledgearea/${props.id}`;
  
  return (
    <Card sx={{ maxWidth: 400, width: '100%' }}>
      <CardActionArea href={viewUrl}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Typography>
            {props.name}
          </Typography>
          {idElement}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

interface TopLevelKnowledgeAreaPaginationProps {
  areas: TopLevelKnowledgeArea[];
}

function TopLevelKnowledgeAreaPagination({ areas }: TopLevelKnowledgeAreaPaginationProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState<string | undefined>();

  const pages = new Set(
    areas.map(area => {
      const codePoint = area.name.codePointAt(0);
      
      return (
        (codePoint !== undefined)
        ? String.fromCodePoint(codePoint)
        : ''
      );
    })
  );

  function onPageChange(page?: string): void {
    setCurrentPage(page);
  }

  let currentPageAreas;

  if (currentPage !== undefined) {
    currentPageAreas = areas.filter(
      area => area.name.startsWith(currentPage)
    );
  }
  else {
    currentPageAreas = areas;
  }

  const areaCards = currentPageAreas.map(area => (
    <TopLevelKnowledgeAreaCard
      key={nanoid()}
      {...area}
    />
  ));

  return (
    <Stack
      flexDirection='column'
      alignItems='center'
      useFlexGap
      gap='1em'
      marginTop='1em'
    >
      <AlphabeticPagination
        variant='outlined'
        shape='rounded'
        pages={pages}
        allPageEnabled
        selectedPage={currentPage}
        onChange={onPageChange}
      />
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap='0.5em'
        padding='1em'
        width='100%'
      >
        {areaCards}
      </Box>
    </Stack>
  );
}

interface TopLevelKnowledgeAreaSearchResultsProps {
  nameFilter?: string;
}

function TopLevelKnowledgeAreaSearchResults(
  { nameFilter }: TopLevelKnowledgeAreaSearchResultsProps
): JSX.Element {

  const areas = usePromise(getTopLevelKnowledgeAreas, [{nameFilter}]);

  if (areas.length > 0) {
    return (
      <TopLevelKnowledgeAreaPagination areas={areas} />
    );
  }
  else if (nameFilter?.length) {
    return (
      <Typography>
        Found no knowledge area with name containing '{nameFilter}'.
      </Typography>
    );
  }
  else {
    return (
      <Typography>
        No knowledge area found.
      </Typography>
    );
  }
}

export default function TopLevelKnowledgeAreas(): JSX.Element {
  const [nameFilter, setNameFilter] = useState('');

  function handleSearchTrigger(text: string): void {
    setNameFilter(text);
  }

  return (
    <Stack
      flexDirection='column'
      alignItems='center'
      useFlexGap
      gap='1em'
      marginTop='1em'
    >
      <SearchBar
        label='Knowledge area name'
        placeholder='e.g. Computer Science'
        maxLength={40}
        text={nameFilter}
        onSearchTrigger={handleSearchTrigger}
      />
      <Suspense fallback={<CircularProgress />}>
        <TopLevelKnowledgeAreaSearchResults nameFilter={nameFilter} />
      </Suspense>
    </Stack>
  );
}