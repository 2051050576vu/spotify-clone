import React from 'react';
import '../styles/MainContent.scss';

interface MainContentProps {
  accessToken: string | null;
}

const SPOTIFY_CLIENT_ID = '031c99f173204993a3b8f2bef3f01aa5';
const REDIRECT_URI = 'http://localhost:3000'; // **Đảm bảo URL này khớp với Redirect URI bạn đã cấu hình trong ứng dụng Spotify của mình.**

const handleLogin = () => {
  const scope = 'user-read-private user-read-email playlist-read-private'; // Các quyền mà ứng dụng của bạn yêu cầu
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
  window.location.href = authUrl;
};

const MainContent: React.FC<MainContentProps> = ({ accessToken }) => {
  return (
    <div className="main-content">
      <h1>Chào mừng đến với Spotify Clone!</h1>
      {accessToken ? (
        <p>Đã đăng nhập thành công!</p>
      ) : (
        <>
          <p>Để tiếp tục, vui lòng đăng nhập vào Spotify.</p>
          <button onClick={handleLogin}>Đăng nhập với Spotify</button>
        </>
      )}
    </div>
  );
};

export default MainContent;