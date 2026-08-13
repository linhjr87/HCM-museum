import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Hall from './routes/Hall';
import NotFound from './routes/NotFound';
import Room1 from './routes/Room1';
import Room2 from './routes/Room2';
import Room3 from './routes/Room3';
import Room4 from './routes/Room4';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Hall />} />
        <Route path="/phong-1" element={<ErrorBoundary><Room1 /></ErrorBoundary>} />
        <Route path="/phong-2" element={<ErrorBoundary><Room2 /></ErrorBoundary>} />
        <Route path="/phong-3" element={<ErrorBoundary><Room3 /></ErrorBoundary>} />
        <Route path="/phong-4" element={<ErrorBoundary><Room4 /></ErrorBoundary>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
