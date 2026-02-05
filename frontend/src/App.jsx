import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import VideoMeet from "./pages/VideoMeet";
import Home from "./pages/Home";
import History from "./pages/History"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/history" element={<History/>}/>
      <Route path="/home" element={<Home />} />
      <Route path="/:url" element={<VideoMeet/>}/>
    </Routes>
  );
}

export default App;
