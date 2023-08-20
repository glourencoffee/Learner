import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import UnderConstruction from './pages/UnderConstruction';
import TopLevelKnowledgeAreas from './pages/TopLevelKnowledgeAreas';

function Layout(): JSX.Element {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Layout /> }>
          <Route index                 element={<UnderConstruction      />} />
          <Route path='questions'      element={<UnderConstruction      />} />
          <Route path='stats'          element={<UnderConstruction      />} />
          <Route path='knowledgeareas' element={<TopLevelKnowledgeAreas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}