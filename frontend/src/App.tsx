import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { HealthBanner } from './components/HealthBanner';
import { HomePage } from './pages/HomePage';
import { PeoplePage } from './pages/PeoplePage';
import { PersonDetailPage } from './pages/PersonDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SkillsPage } from './pages/SkillsPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { SearchPage } from './pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <HealthBanner />
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/:id" element={<PersonDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/skills/:id" element={<SkillDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
