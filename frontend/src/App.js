import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Solutions } from "./pages/Solutions";
import { MeetingRooms } from "./pages/MeetingRooms";
import { Headsets } from "./pages/Headsets";
import { WorkspaceExperience } from "./pages/WorkspaceExperience";
import { BusinessApps } from "./pages/BusinessApps";
import { About } from "./pages/About";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Contact } from "./pages/Contact";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/meeting-rooms" element={<MeetingRooms />} />
            <Route path="/solutions/headsets" element={<Headsets />} />
            <Route path="/solutions/workspace-experience" element={<WorkspaceExperience />} />
            <Route path="/solutions/business-apps" element={<BusinessApps />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
