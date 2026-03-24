import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Uploader from "./pages/Uploader";
import SearchVideo from "./pages/SearchVideo";
import MainLayout from "./components/MainLayout";
import WatchPage from "./pages/WatchPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* All protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Uploader/>}/>
            <Route path="/search" element={<SearchVideo/>}/>
            <Route path="/watch/:videoId" element={<WatchPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
