import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.scss';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Trang chủ</Link>
        </li>
        <li>
          <Link to="/search">Tìm kiếm</Link>
        </li>
        <li>
          <Link to="/library">Thư viện của bạn</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;