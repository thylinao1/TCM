import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import PublicSurvey from './pages/PublicSurvey';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/q/:id/:stage" element={<PublicSurvey />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="session/:id" element={<SessionDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
