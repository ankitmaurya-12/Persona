import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { User, Settings, Save, AlertCircle } from 'lucide-react';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  location: string;
  joinDate: string;
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
    privacyLevel: 'public' | 'private' | 'friends';
  };
}

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    photoURL: '',
    bio: '',
    location: '',
    joinDate: '',
    preferences: {
      emailNotifications: true,
      darkMode: false,
      privacyLevel: 'public'
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchUserProfile() {
      if (!currentUser) return;

      try {
        // Get user profile from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // User profile exists in Firestore
          const userData = userDoc.data() as Omit<UserProfile, 'email' | 'displayName' | 'photoURL'>;
          
          setProfile({
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || 'https://via.placeholder.com/150',
            ...userData,
          });
        } else {
          // Create a new user profile in Firestore
          const newUserProfile = {
            bio: '',
            location: '',
            joinDate: new Date().toISOString(),
            preferences: {
              emailNotifications: true,
              darkMode: false,
              privacyLevel: 'public'
            }
          };

          await setDoc(userDocRef, newUserProfile);

          setProfile({
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || 'https://via.placeholder.com/150',
            ...newUserProfile,
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setError('');
    setSuccess('');
    
    try {
      // Update profile in Firebase Auth
      await updateProfile(currentUser, {
        displayName: profile.displayName,
        photoURL: profile.photoURL
      });

      // Update profile in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        bio: profile.bio,
        location: profile.location,
        preferences: profile.preferences
      });

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              User Profile
            </h1>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Settings className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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

        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <div className="flex-shrink-0 h-16 w-16">
              <img
                className="h-16 w-16 rounded-full"
                src={profile.photoURL || 'https://via.placeholder.com/150'}
                alt="Profile"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {profile.displayName || 'User'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit}>
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Display name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      profile.displayName || 'Not set'
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <textarea
                        name="bio"
                        rows={3}
                        value={profile.bio}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      profile.bio || 'No bio provided'
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      profile.location || 'Not specified'
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Profile photo URL</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="photoURL"
                        value={profile.photoURL}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      profile.photoURL || 'Not set'
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Member since</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(profile.joinDate).toLocaleDateString()}
                  </dd>
                </div>
                
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Preferences</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            id="emailNotifications"
                            name="emailNotifications"
                            type="checkbox"
                            checked={profile.preferences.emailNotifications}
                            onChange={handlePreferenceChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                            Email notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="darkMode"
                            name="darkMode"
                            type="checkbox"
                            checked={profile.preferences.darkMode}
                            onChange={handlePreferenceChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-900">
                            Dark mode
                          </label>
                        </div>
                        <div>
                          <label htmlFor="privacyLevel" className="block text-sm text-gray-700">
                            Privacy level
                          </label>
                          <select
                            id="privacyLevel"
                            name="privacyLevel"
                            value={profile.preferences.privacyLevel}
                            onChange={handlePreferenceChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="friends">Friends only</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <span className="ml-2 flex-1 w-0 truncate">Email notifications</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span>{profile.preferences.emailNotifications ? 'Enabled' : 'Disabled'}</span>
                          </div>
                        </li>
                        <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <span className="ml-2 flex-1 w-0 truncate">Dark mode</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span>{profile.preferences.darkMode ? 'Enabled' : 'Disabled'}</span>
                          </div>
                        </li>
                        <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <span className="ml-2 flex-1 w-0 truncate">Privacy level</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="capitalize">{profile.preferences.privacyLevel}</span>
                          </div>
                        </li>
                      </ul>
                    )}
                  </dd>
                </div>
              </dl>
              
              {isEditing && (
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    Save
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 