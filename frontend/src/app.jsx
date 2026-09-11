import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenHome from "./pages/CitizenHome";
import CitizenProfile from "./pages/CitizenProfile";
import StaffDashboard from "./components/staff/StaffDashboard";
import ServiceDetail from "./pages/ServiceDetails";
import ScrollToTop from "./components/ScrollToTop";
import Complaint from "./pages/Complaint";

function App() {
  return (
    <BrowserRouter>
          <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/citizen" element={<CitizenHome />} />
        <Route path="/citizen/profile" element={<CitizenProfile />} />
        <Route path="/inquiries" element={<Complaint />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/citizen/services/:serviceId" element={<ServiceDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;