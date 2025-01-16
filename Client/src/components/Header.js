import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">
        <img src="logo.webp" alt="" />
         Blogosphere</Link>
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/add">Add Blog</Link>
      </nav>
    </header>
  );
};

export default Header;
