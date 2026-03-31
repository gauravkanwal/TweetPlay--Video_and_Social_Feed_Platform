import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Uploader from "./pages/Uploader";
import SearchVideo from "./pages/SearchVideo";
import MainLayout from "./components/MainLayout";
import WatchPage from "./pages/WatchPage";
import UpdateVideo from './pages/UpdateVideo'
import UpdatePlaylist from "./pages/UpdatePlaylist"
import Profile from "./pages/Profile";
import ShowPlaylist from "./pages/ShowPlaylist";
import CreatePlaylist from "./pages/CreatePlaylist";

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
            <Route path="/update-video/:videoId" element={<UpdateVideo/>}/>
            <Route path="/update-playlist/:playlistId" element={<UpdatePlaylist/>}/>
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/playlist/:playlistId" element={<ShowPlaylist />} /> 
            <Route path="/create-playlist" element={<CreatePlaylist />} /> 
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
