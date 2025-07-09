// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold">TechMatch</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-500">Dashboard</Link>
        <Link to="/upload-resume" className="hover:text-blue-500">Upload</Link>
        <Link to="/suggestions" className="hover:text-blue-500">Suggestions</Link>
        <Link to="/profile" className="hover:text-blue-500">Profile</Link>
        <Link to="/login" className="hover:text-blue-500">Login</Link>
      </div>
    </nav>
  );
}
