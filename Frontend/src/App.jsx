import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* All protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />

        </Route>{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
