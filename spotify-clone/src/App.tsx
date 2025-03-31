import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/auth/Sidebar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import MainContent from './components/auth/MainContent';
import PlaylistDetailPage from './pages/PlaylistDetailPage'; // **Import PlaylistDetailPage**
import './App.scss';

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    let token = null;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      token = params.get('access_token');
    }

    setAccessToken(token);
    if (token) {
      localStorage.setItem('access_token', token);
    }
    window.location.hash = '';
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/login" element={<MainContent accessToken={accessToken} />} />
            <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} /> {/* **Thêm route mới** */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;