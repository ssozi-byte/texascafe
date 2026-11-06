import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { AppLayout } from './components/layout/Layout';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { HomePage } from './components/pages/HomePage';
import { OffersPage } from './components/pages/OffersPage';
import { useCafeData } from './hooks/useCafeData';

function App() {
  const data = useCafeData();

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage data={data} />} />
          <Route path="/about" element={<AboutPage data={data} />} />
          <Route path="/gallery" element={<GalleryPage data={data} />} />
          <Route path="/offers" element={<OffersPage data={data} />} />
          <Route path="/contact" element={<ContactPage data={data} />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<HomePage data={data} />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
