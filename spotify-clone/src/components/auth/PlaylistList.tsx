import React from 'react';
import '../styles/PlaylistList.scss';
import { Link } from 'react-router-dom'; // **Import Link**

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface PlaylistListProps {
  playlists: Playlist[];
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists }) => {
  return (
    <div className="playlist-list">
      <h2>Playlist nổi bật</h2>
      <div className="playlists">
        {playlists.map((playlist) => (
          <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="playlist-item-link"> {/* **Sử dụng Link** */}
            <div className="playlist-item">
              <img src={playlist.images[0]?.url} alt={playlist.name} />
              <p>{playlist.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlaylistList;