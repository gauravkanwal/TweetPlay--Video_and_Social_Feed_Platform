import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Uploader from "./pages/Uploader";
import SearchVideo from "./pages/SearchVideo";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* All protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Uploader/>}/>
          <Route path="/search" element={<SearchVideo/>}/>
        </Route>{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
