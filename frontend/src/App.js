import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { Solutions } from "./pages/Solutions";
import { MeetingRooms } from "./pages/MeetingRooms";
import { Headsets } from "./pages/Headsets";
import { WorkspaceExperience } from "./pages/WorkspaceExperience";
import { BusinessApps } from "./pages/BusinessApps";
import { About } from "./pages/About";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { SmartDeals } from "./pages/SmartDeals";
import { DealPost } from "./pages/DealPost";
import { Contact } from "./pages/Contact";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminSelection } from "./pages/AdminSelection";
import { AdminDashboard } from "./pages/AdminDashboard";
import { BlogEditor } from "./pages/BlogEditor";
import { AdminDealsDashboard } from "./pages/AdminDealsDashboard";
import { DealEditor } from "./pages/DealEditor";
import { Toaster } from "./components/ui/sonner";

// Suppress ResizeObserver errors (common React/Radix UI issue, doesn't affect functionality)
const suppressResizeObserverError = () => {
  const errorHandler = (event) => {
    if (
      event.message === 'ResizeObserver loop completed with undelivered notifications.' ||
      event.message === 'ResizeObserver loop limit exceeded'
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  };
  window.addEventListener('error', errorHandler);
};

suppressResizeObserverError();

// Layout wrapper for public pages
const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/solutions" element={<PublicLayout><Solutions /></PublicLayout>} />
            <Route path="/solutions/meeting-rooms" element={<PublicLayout><MeetingRooms /></PublicLayout>} />
            <Route path="/solutions/headsets" element={<PublicLayout><Headsets /></PublicLayout>} />
            <Route path="/solutions/workspace-experience" element={<PublicLayout><WorkspaceExperience /></PublicLayout>} />
            <Route path="/solutions/business-apps" element={<PublicLayout><BusinessApps /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
            <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            
            {/* Admin Routes (no header/footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/blog" element={<AdminDashboard />} />
            <Route path="/admin/blog/new" element={<BlogEditor />} />
            <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
