import React, { useState, useEffect } from 'react';
import PlaylistList from '../components/auth/PlaylistList';
import { Link } from 'react-router-dom';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}

const HomePage: React.FC = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Điều chỉnh cấu trúc dữ liệu response
        if (data && Array.isArray(data.items)) {
          setFeaturedPlaylists(data.items);
        } else {
          console.error('Dữ liệu playlist không hợp lệ:', data);
          setFeaturedPlaylists([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy playlist:', error);
        setFeaturedPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  return (
    <div>
      <h2>Chào mừng đến với Spotify Clone!</h2>
      {accessToken ? (
        loading ? (
          <p>Đang tải playlist...</p>
        ) : featuredPlaylists.length > 0 ? (
          <PlaylistList playlists={featuredPlaylists} />
        ) : (
          <p>Không có playlist nào để hiển thị.</p>
        )
      ) : (
        <p>Vui lòng <Link to="/login">đăng nhập</Link> để xem nội dung.</p>
      )}
    </div>
  );
};

export default HomePage;