import React from 'react';
import Navbar from '../components/layout/Navbar';
import SearchForm from '../components/dashboard/SearchForm';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SearchForm />
    </div>
  );
}