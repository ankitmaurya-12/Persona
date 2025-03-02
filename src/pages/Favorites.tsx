import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { getFavoritePersons, removeFavoritePerson } from '../firebase/searchService';
import { Star, Trash2, ExternalLink, User, MapPin, Calendar } from 'lucide-react';

interface FavoritePerson {
  id: string;
  personId: string;
  personData: {
    name: string;
    image: string;
    currentPosition?: string;
    location?: string;
    description?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
      username: string;
    }>;
    createdAt: {
      toDate: () => Date;
    };
  };
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoritePerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchFavorites() {
      if (!currentUser) return;

      try {
        setLoading(true);
        const favoritesData = await getFavoritePersons(currentUser.uid);
        setFavorites(favoritesData as FavoritePerson[]);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [currentUser]);

  const handleRemoveFavorite = async (id: string) => {
    if (!currentUser) return;

    try {
      setDeleteLoading(id);
      await removeFavoritePerson(id);
      
      // Update the local state to remove the deleted item
      setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove favorite');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Favorite Persons</h1>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <User className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Find More People
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start adding people to your favorites.</p>
            <div className="mt-6">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <User className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Find People
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={favorite.personData.image || 'https://via.placeholder.com/150'}
                        alt={favorite.personData.name}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {favorite.personData.name}
                      </h3>
                      {favorite.personData.currentPosition && (
                        <p className="text-sm text-gray-500">
                          {favorite.personData.currentPosition}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      disabled={deleteLoading === favorite.id}
                      className={`inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white ${
                        deleteLoading === favorite.id 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                      }`}
                      aria-label="Remove from favorites"
                    >
                      {deleteLoading === favorite.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />
                      ) : (
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  
                  {favorite.personData.location && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{favorite.personData.location}</span>
                    </div>
                  )}
                  
                  {favorite.personData.description && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {favorite.personData.description}
                      </p>
                    </div>
                  )}
                  
                  {favorite.personData.socialLinks && favorite.personData.socialLinks.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Social Profiles
                      </h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {favorite.personData.socialLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                          >
                            {link.platform}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        Added on {favorite.personData.createdAt.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      to={`/results?q=${encodeURIComponent(favorite.personData.name)}`}
                      className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Details
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 