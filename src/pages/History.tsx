import React from 'react';
import Navbar from '../components/layout/Navbar';
import SearchHistory from '../components/dashboard/SearchHistory';

export default function History() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SearchHistory />
    </div>
  );
}