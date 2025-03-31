import React, { useState, useEffect } from 'react';
import '../styles/SearchBar.scss';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear timeout khi component unmount
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Xóa timeout cũ nếu có
    if (typingTimeout) clearTimeout(typingTimeout);

    // Tạo timeout mới
    const newTimeout = setTimeout(() => {
      onSearch(value);
    }, 500); // Debounce 500ms

    setTypingTimeout(newTimeout);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
        value={searchTerm}
        onChange={handleChange}
        autoFocus
      />
    </div>
  );
};

export default SearchBar;