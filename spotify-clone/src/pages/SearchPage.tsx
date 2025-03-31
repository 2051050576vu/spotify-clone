import React, { useState } from "react";
import SearchBar from "../components/auth/SearchBar"; // **Đã sửa đường dẫn import**

// Định nghĩa các interface
interface Track {
  id?: string;
  name?: string;
  artists?: Array<{ name?: string }>;
  album?: { name?: string };
}

interface Artist {
  id?: string;
  name?: string;
}

interface Album {
  id?: string;
  name?: string;
  artists?: Array<{ name?: string }>;
}

interface Playlist {
  id?: string;
  name?: string;
  owner?: { display_name?: string };
}

interface SearchResult {
  tracks?: { items: Track[] };
  artists?: { items: Artist[] };
  albums?: { items: Album[] };
  playlists?: { items: Playlist[] };
}

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("access_token");

  const handleSearch = (query: string) => {
    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    const searchParams = new URLSearchParams({
      q: query.trim(),
      type: "track,artist,album,playlist",
      limit: "10",
    });

    fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error("Search error:", error);
        setError(error.message);
        setSearchResults(null);
      })
      .finally(() => setLoading(false));
  };

  // Sửa hàm renderResultsSection với generic type
  const renderResultsSection = <T extends Track | Artist | Album | Playlist>(
    title: string,
    items: T[] | undefined,
    renderItem: (item: T) => React.ReactNode
  ) => {
    // Thêm kiểm tra mảng hợp lệ
    if (!items || items.length === 0) return null;

    return (
      <div className="search-category">
        <h3>{title}</h3>
        <ul>
          {items
            .filter((item) => item?.id) // Lọc item không hợp lệ
            .map((item) => (
              <li key={item.id}>{renderItem(item)}</li>
            ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="search-page">
      <h2>Tìm kiếm</h2>
      <SearchBar onSearch={handleSearch} />

      {loading && <p>Đang tìm kiếm...</p>}
      {error && <p className="error-message">Đã xảy ra lỗi: {error}</p>}

      {!loading && !error && searchResults && (
        <div className="search-results">
          {/* Bài hát - Thêm optional chaining và giá trị mặc định */}
          {renderResultsSection<Track>(
            "Bài hát",
            searchResults.tracks?.items,
            (track) => (
              <>
                {track?.name || "Không có tên"} -
                {(track?.artists || [])
                  .map((artist) => artist?.name)
                  .filter(Boolean)
                  .join(", ") || "Nghệ sĩ không xác định"}
                <span className="album-name">
                  {" "}
                  ({track?.album?.name || "Album không xác định"})
                </span>
              </>
            )
          )}

          {/* Nghệ sĩ */}
          {renderResultsSection<Artist>(
            "Nghệ sĩ",
            searchResults.artists?.items,
            (artist) => artist?.name || "Nghệ sĩ không xác định"
          )}

          {/* Album */}
          {renderResultsSection<Album>(
            "Album",
            searchResults.albums?.items,
            (album) => (
              <>
                {album?.name || "Album không tên"} -
                {(album?.artists || [])
                  .map((a) => a?.name)
                  .filter(Boolean)
                  .join(", ") || "Nghệ sĩ không xác định"}
              </>
            )
          )}

          {/* Playlist */}
          {renderResultsSection<Playlist>(
            "Playlist",
            searchResults.playlists?.items,
            (playlist) => (
              <>
                {playlist?.name || "Playlist không tên"}
                <i>
                  (by{" "}
                  {playlist?.owner?.display_name || "Người dùng không xác định"}
                  )
                </i>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
