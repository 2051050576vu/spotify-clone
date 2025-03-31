import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../pages/styles/PlaylistDetailPage.scss";

interface PlaylistDetailsResponse {
  name: string;
  images: { url: string }[];
  tracks: {
    items: {
      track: {
        id: string;
        name: string;
        artists: { name: string }[];
        album: {
          name: string;
          images: { url: string }[];
        };
        duration_ms: number;
      };
    }[];
  };
}

const PlaylistDetailPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const [playlistDetails, setPlaylistDetails] =
    useState<PlaylistDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("access_token");
  console.log("Playlist ID:", playlistId); // Kiểm tra giá trị

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!playlistId) {
      navigate("/");
      return;
    }

    setLoading(true);

    // Sửa endpoint API đúng
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }
        if (response.status === 404) {
          throw new Error("Playlist không tồn tại");
        }
        if (!response.ok) {
          throw new Error("Lỗi khi lấy chi tiết playlist");
        }
        return response.json();
      })
      .then((data) => {
        // Validate response structure
        if (data?.id) {
          setPlaylistDetails({
            name: data.name,
            images: data.images || [],
            tracks: {
              items:
                data.tracks?.items?.filter((item: any) => item.track?.id) || [],
            },
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error.message);
        navigate("/not-found", { state: { error: error.message } });
      })
      .finally(() => setLoading(false));
  }, [playlistId, accessToken, navigate]);

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="playlist-detail-page">
      {loading ? (
        <p className="loading">Đang tải thông tin playlist...</p>
      ) : playlistDetails ? (
        <div className="playlist-detail">
          <div className="playlist-header">
            {playlistDetails.images[0]?.url ? (
              <img
                src={playlistDetails.images[0].url}
                alt={playlistDetails.name}
                className="playlist-image"
              />
            ) : (
              <div className="placeholder-image">No Image</div>
            )}
            <h1>{playlistDetails.name || "Untitled Playlist"}</h1>
          </div>

          <div className="playlist-tracks">
            <h2>Danh sách bài hát</h2>
            {playlistDetails.tracks.items.length > 0 ? (
              <ul>
                {playlistDetails.tracks.items.map((item, index) => (
                  <li key={item.track.id || index} className="track-item">
                    {item.track.album.images[0]?.url ? (
                      <img
                        src={item.track.album.images[0].url}
                        alt={item.track.name}
                        className="track-album-image"
                      />
                    ) : (
                      <div className="placeholder-track-image">No Image</div>
                    )}

                    <div className="track-info">
                      <p className="track-name">
                        {item.track.name || "Unknown Track"}
                      </p>
                      <p className="track-artists">
                        {item.track.artists
                          .map((artist) => artist.name)
                          .filter(Boolean)
                          .join(", ") || "Unknown Artist"}
                      </p>
                    </div>

                    <span className="track-duration">
                      {formatDuration(item.track.duration_ms)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-tracks">
                Không có bài hát nào trong playlist này
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="error-message">Không tìm thấy thông tin playlist</p>
      )}
    </div>
  );
};

export default PlaylistDetailPage;
