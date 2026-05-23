import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import PublicSurvey from './pages/PublicSurvey';
import ExemplarForm from './pages/ExemplarForm';
import ScorerValidation from './pages/ScorerValidation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/q/:id/:stage" element={<PublicSurvey />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="session/:id" element={<SessionDetail />} />
          <Route path="exemplar" element={<ExemplarForm />} />
          <Route path="validation" element={<ScorerValidation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
