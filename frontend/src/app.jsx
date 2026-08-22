import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenHome from "./pages/CitizenHome";
import CitizenProfile from "./pages/CitizenProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/citizen" element={<CitizenHome />} />
        <Route path="/citizen/profile" element={<CitizenProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;