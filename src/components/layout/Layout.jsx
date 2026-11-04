import { Footer } from './Footer';
import { Header } from './Header';

// Shared app shell used across pages. It keeps the navigation, brand, footer and responsive
// mobile drawer consistent wherever pages render.
export function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
