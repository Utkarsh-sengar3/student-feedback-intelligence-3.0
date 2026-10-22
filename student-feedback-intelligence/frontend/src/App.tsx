import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { useTheme } from './hooks/useTheme';

// Pages
import Overview from './pages/Overview';
import SentimentAnalysis from './pages/SentimentAnalysis';
import CourseIntelligence from './pages/CourseIntelligence';
import FacultyIntelligence from './pages/FacultyIntelligence';
import UniversityInsights from './pages/UniversityInsights';
import AspectAnalysis from './pages/AspectAnalysis';
import ConcernDetection from './pages/ConcernDetection';
import SeverityPriority from './pages/SeverityPriority';
import Recommendations from './pages/Recommendations';
import Reviews from './pages/Reviews';
import SemanticSearch from './pages/SemanticSearch';
import Assistant from './pages/Assistant';
import Models from './pages/Models';
import Methodology from './pages/Methodology';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <AppLayout theme={theme} onToggleTheme={toggle}>
        <Routes>
          {/* Core Intelligence */}
          <Route path="/" element={<Overview />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          <Route path="/sentiment" element={<SentimentAnalysis />} />
          <Route path="/analyze" element={<Navigate to="/sentiment" replace />} />
          
          <Route path="/course-intelligence" element={<CourseIntelligence />} />
          <Route path="/faculty-intelligence" element={<FacultyIntelligence />} />
          <Route path="/university-insights" element={<UniversityInsights />} />

          {/* Aspects & Concerns */}
          <Route path="/aspects" element={<AspectAnalysis />} />
          <Route path="/concerns" element={<ConcernDetection />} />
          <Route path="/severity" element={<SeverityPriority />} />
          <Route path="/recommendations" element={<Recommendations />} />

          {/* Exploration & Search */}
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/search" element={<SemanticSearch />} />

          {/* System & Models */}
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/models" element={<Models />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
