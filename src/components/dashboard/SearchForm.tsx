import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { saveSearchToHistory, performSearch } from '../../firebase/searchService';

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a name to search');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Perform the search with userId for caching
      const results = await performSearch(searchQuery, currentUser?.uid);
      
      if (!results) {
        setError('No results found for this search query. Please try a different name or add more details.');
        setLoading(false);
        return;
      }
      
      // Save search to history
      if (currentUser) {
        await saveSearchToHistory(currentUser.uid, searchQuery);
        // No need to save results again as performSearch already does this when userId is provided
      }
      
      // Navigate to results page
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
    } catch (err) {
      console.error('Error during search:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Find anyone on the internet
        </h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
          Enter a name to search across social media, professional networks, and more
        </p>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSearch} className="mt-8">
        <div className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
              placeholder="Enter a name (e.g., Steve Jobs, Elon Musk)"
              aria-label="Search query"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Try adding additional details like location, profession, or platform usernames for better results
        </p>
      </form>
      
      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-900">Search tips:</h2>
        <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
          <li>Include full name for more accurate results</li>
          <li>Add location information if known (e.g., "John Smith San Francisco")</li>
          <li>Include profession or company for professional searches</li>
          <li>For specific platforms, add the platform name (e.g., "Jane Doe LinkedIn")</li>
          <li>Use quotes for exact matches (e.g., "John A. Smith")</li>
        </ul>
      </div>
    </div>
  );
}