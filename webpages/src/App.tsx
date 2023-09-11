import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Stack } from '@mui/material';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Header from './components/Header';
import ErrorPage from './pages/ErrorPage';
import UnderConstruction from './pages/UnderConstruction';
import {
  TopLevelKnowledgeAreas,
  NewKnowledgeArea,
  EditKnowledgeArea,
  ViewKnowledgeArea
} from './pages/knowledgearea';
import {
  EditTopic,
  NewTopic
} from './pages/topic';
import {
  NewQuestion,
  EditQuestion
} from './pages/question';

function renderErrorPage({ error }: FallbackProps): React.ReactNode {
  return <ErrorPage error={error} />;
}

function Layout(): JSX.Element {
  return (
    <Stack id='layout' height='stretch'>
      <Header />
      <ErrorBoundary fallbackRender={renderErrorPage}>
        <Stack component='main' height='stretch'>
          <Outlet />
        </Stack>
      </ErrorBoundary>
    </Stack>
  );
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index                 element={<UnderConstruction      />} />
          <Route path='questions'      element={<UnderConstruction      />} />
          <Route path='stats'          element={<UnderConstruction      />} />
          <Route path='knowledgearea'>
            <Route index          element={ <TopLevelKnowledgeAreas /> } />
            <Route path='new'     element={ <NewKnowledgeArea       /> } />
            <Route path=':areaId'>
              <Route index        element={ <ViewKnowledgeArea /> } />
              <Route path='edit'  element={ <EditKnowledgeArea /> } />
            </Route>
          </Route>
          <Route path='topic'>
            <Route path='new'     element={ <NewTopic /> } />
            <Route path=':topicId'>
              <Route index        element={ <UnderConstruction /> } />
              <Route path='edit'  element={ <EditTopic /> } />
            </Route>
          </Route>
          <Route path='question'>
            <Route path='new'     element={ <NewQuestion /> } />
            <Route path=':questionId'>
              <Route index        element={ <UnderConstruction /> } />
              <Route path='edit'  element={ <EditQuestion /> } />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}