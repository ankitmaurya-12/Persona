import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, Search, Trash2 } from 'lucide-react';
import { getSearchHistory, deleteSearchHistoryItem } from '../../firebase/searchService';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: {
    toDate: () => Date;
  };
}

export default function SearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchSearchHistory = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const historyData = await getSearchHistory(currentUser.uid);
      setHistory(historyData as SearchHistoryItem[]);
    } catch (err) {
      console.error('Error fetching search history:', err);
      setError('Failed to load search history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, [currentUser]);

  const handleDeleteHistoryItem = async (id: string) => {
    if (!currentUser) return;

    try {
      setDeleteLoading(id);
      await deleteSearchHistoryItem(id);
      
      // Update the local state to remove the deleted item
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting search history item:', err);
      setError('Failed to delete search history item');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No search history</h3>
        <p className="mt-1 text-sm text-gray-500">Start searching to build your history.</p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Search className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search History</h1>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Search className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Search
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {history.map((item) => (
            <li key={item.id}>
              <div className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <Link to={`/results?q=${encodeURIComponent(item.query)}`} className="text-sm font-medium text-indigo-600 truncate hover:underline">
                      {item.query}
                    </Link>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <Clock className="mr-1 h-4 w-4" />
                        {item.timestamp.toDate().toLocaleDateString()} at {item.timestamp.toDate().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Click to view results
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        disabled={deleteLoading === item.id}
                        className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                          deleteLoading === item.id 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        }`}
                        aria-label="Delete search history item"
                      >
                        {deleteLoading === item.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />
                        ) : (
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}