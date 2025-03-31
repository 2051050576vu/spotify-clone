import React, { useState, useEffect } from 'react';
import PlaylistList from '../components/auth/PlaylistList';
import { Link } from 'react-router-dom';

interface PlaylistResponse {
  items: {
    id: string;
    name: string;
    images: { url: string }[];
  }[];
}

const LibraryPage: React.FC = () => {
  const [userPlaylists, setUserPlaylists] = useState<PlaylistResponse['items'] | null>(null);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (accessToken) {
      fetch('https://api.spotify.com/v1/me2', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserPlaylists(data.items);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy playlist của người dùng:', error);
        });
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Thư viện của bạn</h2>
      {accessToken ? (
        userPlaylists && userPlaylists.length > 0 ? (
          <PlaylistList playlists={userPlaylists} />
        ) : (
          <p>Bạn chưa có playlist nào.</p>
        )
      ) : (
        <p>Vui lòng <Link to="/login">đăng nhập</Link> để xem thư viện của bạn.</p>
      )}
    </div>
  );
};

export default LibraryPage;