import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ProfileSidebar from '../components/results/ProfileSidebar';
import MainContent from '../components/results/MainContent';
import PopularContent from '../components/results/PopularContent';
import ProjectsSection from '../components/results/ProjectsSection';
import IdentityVerification from '../components/results/IdentityVerification';
import { Twitter, Linkedin, Github, Youtube } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { performSearch } from '../firebase/searchService';

// Define types for our data structures
interface SocialLink {
  platform: string;
  url: string;
  username: string;
  followers: number;
  icon: React.ComponentType;
}

interface Activity {
  id: string;
  type: string;
  name: string;
  date: string;
  description: string;
  imageUrl?: string;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  url: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
}

interface Career {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  year: string;
  age: number;
}

interface PopularContentItem {
  id: string;
  type: string;
  platform: string;
  title: string;
  date: string;
  url: string;
  thumbnailUrl?: string;
  views: number;
  likes: number;
  comments: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  startDate: string;
  endDate: string | null;
  url?: string;
  githubUrl?: string;
  technologies: string[];
  teamSize: number;
  achievements: string[];
}

interface PossibleMatch {
  platform: string;
  username: string;
  url: string;
  confidenceScore: number;
  matchReason: string;
  id?: string;
  profileUrl?: string;
}

interface PersonData {
  name: string;
  image: string;
  currentPosition: string;
  location: string;
  description: string;
  recentActivities: Activity[];
  socialLinks: SocialLink[];
  blogPosts: BlogPost[];
  biography: string;
  timeline: TimelineEvent[];
  education: Education[];
  career: Career[];
  photos: Photo[];
  popularContent: PopularContentItem[];
  projects: Project[];
  possibleMatches: PossibleMatch[];
}

// Define component prop interfaces
interface ProfileSidebarProps {
  name: string;
  image: string;
  currentPosition: string;
  location: string;
  description: string;
  recentActivities: Activity[];
  socialLinks: SocialLink[];
  blogPosts?: BlogPost[];
}

interface MainContentProps {
  biography: string;
  timeline: TimelineEvent[];
  education: Education[];
  career: Career[];
  photos: Photo[];
}

interface PopularContentProps {
  content: PopularContentItem[];
}

interface ProjectsSectionProps {
  projects: Project[];
}

interface IdentityVerificationProps {
  searchQuery: string;
  possibleMatches: PossibleMatch[];
  onConfirm: (matches: PossibleMatch[]) => void;
}

export default function Results() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!query) {
          setError('No search query provided');
          setLoading(false);
          return;
        }
        
        // Use our enhanced search service that handles caching
        const results = await performSearch(query, currentUser?.uid);
        
        if (results) {
          setPersonData(results as PersonData);
          setNeedsVerification(false);
        } else {
          // No results found
          setError('No results found for this search query. Please try a different name or add more details.');
        }
      } catch (err) {
        console.error('Error fetching person data:', err);
        setError('An error occurred while fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [query, currentUser]);
  
  const handleVerificationConfirm = (confirmedMatches: PossibleMatch[]) => {
    setNeedsVerification(false);
    // In a real app, you would update the person data with the confirmed matches
    console.log('Confirmed matches:', confirmedMatches);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-lg text-gray-600">Searching for information about "{query}"...</p>
            <p className="mt-2 text-sm text-gray-500">This may take a moment as we search across multiple platforms.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-gray-600">Suggestions:</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                <li>Check the spelling of the name</li>
                <li>Try using both first and last name</li>
                <li>Add additional information like location or profession</li>
                <li>Try searching for a more well-known person</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!personData) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/3">
            <ProfileSidebar
              name={personData.name}
              image={personData.image}
              currentPosition={personData.currentPosition}
              location={personData.location}
              description={personData.description}
              recentActivities={personData.recentActivities}
              socialLinks={personData.socialLinks}
              blogPosts={personData.blogPosts}
            />
          </div>
          
          {/* Main Content */}
          <div className="md:w-2/3">
            {needsVerification && (
              <IdentityVerification
                searchQuery={query}
                possibleMatches={personData.possibleMatches}
                onConfirm={handleVerificationConfirm}
              />
            )}
            
            <MainContent
              biography={personData.biography}
              timeline={personData.timeline}
              education={personData.education}
              career={personData.career}
              photos={personData.photos}
            />
            
            {personData.projects && personData.projects.length > 0 && (
              <div className="mt-8">
                <ProjectsSection projects={personData.projects} />
              </div>
            )}
            
            {personData.popularContent && personData.popularContent.length > 0 && (
              <div className="mt-8">
                <PopularContent content={personData.popularContent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}