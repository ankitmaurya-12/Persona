import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  setDoc,
  updateDoc,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Save a search query to history
export const saveSearchToHistory = async (userId: string, searchQuery: string) => {
  try {
    const docRef = await addDoc(collection(db, 'searchHistory'), {
      userId,
      query: searchQuery,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving search to history:', error);
    throw error;
  }
};

// Get search history for a user
export const getSearchHistory = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'searchHistory'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const historyData: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      historyData.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return historyData;
  } catch (error) {
    console.error('Error getting search history:', error);
    throw error;
  }
};

// Delete a search history item
export const deleteSearchHistoryItem = async (historyId: string) => {
  try {
    await deleteDoc(doc(db, 'searchHistory', historyId));
    return true;
  } catch (error) {
    console.error('Error deleting search history item:', error);
    throw error;
  }
};

// Check if we have recent cached results
const hasFreshCachedResults = (cachedResults: any): boolean => {
  if (!cachedResults || !cachedResults.lastUpdated) return false;
  
  // Convert Firestore timestamp to Date
  const lastUpdated = cachedResults.lastUpdated instanceof Timestamp 
    ? cachedResults.lastUpdated.toDate() 
    : new Date(cachedResults.lastUpdated);
  
  // Calculate time difference in hours
  const hoursSinceUpdate = (new Date().getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
  
  // Consider results fresh if they're less than 24 hours old
  return hoursSinceUpdate < 24;
};

// Perform a search using multiple APIs
export const performSearch = async (searchQuery: string, userId?: string) => {
  try {
    // If userId is provided, check for cached results first
    if (userId) {
      const cachedResults = await getSearchResults(userId, searchQuery);
      
      // If we have fresh cached results, return them
      if (cachedResults && hasFreshCachedResults(cachedResults)) {
        console.log('Using cached search results');
        return cachedResults.results;
      }
    }
    
    console.log('Performing new search with external APIs');
    
    // Normalize the search query
    const query = searchQuery.toLowerCase().trim();
    
    // Initialize results object
    let results: any = null;
    
    // Use multiple APIs to gather information
    try {
      // First, try to get basic information using People Data API
      results = await searchPersonAPI(query);
      
      // If we found basic info, enrich it with social media data
      if (results) {
        // Enrich with social media profiles
        const socialProfiles = await searchSocialMediaAPI(query, results.name);
        if (socialProfiles && socialProfiles.length > 0) {
          results.socialProfiles = socialProfiles;
        }
        
        // Enrich with news articles
        const articles = await searchNewsAPI(results.name);
        if (articles && articles.length > 0) {
          results.articles = articles;
        }
      }
    } catch (apiError) {
      console.error('Error with external APIs:', apiError);
      
      // Fallback to mock data if APIs fail
      results = getMockDataForQuery(query);
    }
    
    // If we still don't have results, use mock data as fallback
    if (!results) {
      results = getMockDataForQuery(query);
    }
    
    // If userId is provided, save the results to cache
    if (userId && results) {
      await saveSearchResults(userId, searchQuery, results);
    }
    
    return results;
  } catch (error) {
    console.error('Error performing search:', error);
    throw error;
  }
};

// Mock API function for People Data
const searchPersonAPI = async (query: string) => {
  // In a real implementation, this would call an actual API
  // For now, we'll simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return mock data based on the query
  return getMockDataForQuery(query);
};

// Mock API function for Social Media
const searchSocialMediaAPI = async (query: string, name: string) => {
  // In a real implementation, this would call actual social media APIs
  // For now, we'll simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, return mock social media profiles
  if (query.includes('steve') && query.includes('jobs')) {
    return [
      {
        platform: "Twitter",
        username: "stevejobs",
        url: "https://twitter.com/stevejobs",
        followers: 2500000
      },
      {
        platform: "LinkedIn",
        username: "stevejobs",
        url: "https://linkedin.com/in/stevejobs",
        followers: 1800000
      }
    ];
  } else if (query.includes('elon') && query.includes('musk')) {
    return [
      {
        platform: "Twitter",
        username: "elonmusk",
        url: "https://twitter.com/elonmusk",
        followers: 128000000
      },
      {
        platform: "LinkedIn",
        username: "elonmusk",
        url: "https://linkedin.com/in/elonmusk",
        followers: 4000000
      }
    ];
  }
  
  return [];
};

// Mock API function for News Articles
const searchNewsAPI = async (name: string) => {
  // In a real implementation, this would call an actual news API
  // For now, we'll simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // For demo purposes, return mock news articles
  if (name.toLowerCase().includes('steve jobs')) {
    return [
      {
        title: "The Visionary Who Transformed Technology",
        url: "https://example.com/steve-jobs-visionary",
        source: "Tech Magazine",
        date: "2011-10-06"
      },
      {
        title: "Remembering Steve Jobs: 10 Years Later",
        url: "https://example.com/remembering-steve-jobs",
        source: "Apple Insider",
        date: "2021-10-05"
      }
    ];
  } else if (name.toLowerCase().includes('elon musk')) {
    return [
      {
        title: "The Ambitious Vision of Elon Musk",
        url: "https://example.com/elon-musk-vision",
        source: "Business Insider",
        date: "2023-05-15"
      },
      {
        title: "Elon Musk's SpaceX Launches New Satellite Constellation",
        url: "https://example.com/spacex-satellite-launch",
        source: "Space News",
        date: "2023-09-22"
      }
    ];
  }
  
  return [];
};

// Helper function to get mock data based on query
const getMockDataForQuery = (query: string) => {
  if (query.includes('steve') && query.includes('jobs')) {
    return {
      name: "Steve Jobs",
      image: "https://images.unsplash.com/photo-1569585723035-0e9e6ff87cbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
      currentPosition: "Co-founder and former CEO of Apple Inc.",
      location: "Palo Alto, California",
      description: "Visionary entrepreneur who co-founded Apple and transformed the technology industry with revolutionary products like the Macintosh, iPod, iPhone, and iPad.",
      education: [
        {
          institution: "Reed College",
          degree: "Dropped out",
          field: "Liberal arts",
          startYear: 1972,
          endYear: 1974,
          description: "Attended Reed College but dropped out after one semester."
        }
      ],
      career: [
        {
          company: "Apple Inc.",
          title: "Co-founder and CEO",
          startYear: 1976,
          endYear: 2011,
          description: "Co-founded Apple and served as CEO, transforming it into one of the world's most valuable companies."
        },
        {
          company: "NeXT Computer",
          title: "Founder and CEO",
          startYear: 1985,
          endYear: 1997,
          description: "Founded NeXT after leaving Apple, later acquired by Apple in 1997."
        },
        {
          company: "Pixar",
          title: "CEO",
          startYear: 1986,
          endYear: 2006,
          description: "Acquired Pixar and served as CEO until it was acquired by Disney."
        }
      ],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1569585723035-0e9e6ff87cbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
          caption: "Steve Jobs presenting at an Apple event",
          year: 2010
        }
      ],
      videos: [
        {
          title: "Steve Jobs introduces the iPhone",
          url: "https://example.com/steve-jobs-iphone",
          platform: "YouTube",
          date: "2007-01-09"
        }
      ]
    };
  } else if (query.includes('elon') && query.includes('musk')) {
    return {
      name: "Elon Musk",
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
      currentPosition: "CEO of Tesla and SpaceX",
      location: "Austin, Texas",
      description: "Entrepreneur and business magnate who founded SpaceX and co-founded Tesla Motors, Neuralink, and The Boring Company.",
      education: [
        {
          institution: "University of Pennsylvania",
          degree: "Bachelor's Degree",
          field: "Physics and Economics",
          startYear: 1992,
          endYear: 1997,
          description: "Double major in Physics and Economics"
        }
      ],
      career: [
        {
          company: "Tesla",
          title: "CEO",
          startYear: 2008,
          endYear: null,
          description: "Leading electric vehicle and clean energy company"
        },
        {
          company: "SpaceX",
          title: "Founder and CEO",
          startYear: 2002,
          endYear: null,
          description: "Aerospace manufacturer and space transportation company"
        },
        {
          company: "X (Twitter)",
          title: "Owner and CEO",
          startYear: 2022,
          endYear: null,
          description: "Acquired Twitter and rebranded it as X"
        }
      ],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1547407139-3c921a66005c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
          caption: "Elon Musk at a SpaceX event",
          year: 2021
        }
      ],
      videos: [
        {
          title: "Elon Musk presents Tesla Cybertruck",
          url: "https://example.com/elon-musk-cybertruck",
          platform: "YouTube",
          date: "2019-11-21"
        }
      ]
    };
  } else {
    // Default fallback for unknown queries
    return {
      name: query,
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80", // Replace placeholder with Unsplash image
      currentPosition: "Unknown",
      location: "Unknown",
      description: "No detailed information available for this person.",
      recentActivities: [],
      socialLinks: [],
      blogPosts: [],
      biography: `No detailed biography available for ${query}.`,
      timeline: [],
      education: [],
      career: [],
      photos: [],
      popularContent: [],
      projects: [],
      possibleMatches: []
    };
  }
};

// Save search results for a query
export const saveSearchResults = async (userId: string, searchQuery: string, results: any) => {
  try {
    // Check if results for this query already exist
    const q = query(
      collection(db, 'searchResults'),
      where('userId', '==', userId),
      where('query', '==', searchQuery)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing results
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, 'searchResults', docId), {
        results,
        lastUpdated: serverTimestamp()
      });
      return docId;
    } else {
      // Create new results
      const docRef = await addDoc(collection(db, 'searchResults'), {
        userId,
        query: searchQuery,
        results,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving search results:', error);
    throw error;
  }
};

// Get search results for a query
export const getSearchResults = async (userId: string, searchQuery: string) => {
  try {
    const q = query(
      collection(db, 'searchResults'),
      where('userId', '==', userId),
      where('query', '==', searchQuery)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting search results:', error);
    throw error;
  }
};

// Save a favorite person
export const saveFavoritePerson = async (userId: string, personData: any) => {
  try {
    // Check if this person is already favorited
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('personId', '==', personData.name)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Already favorited, update the data
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, 'favorites', docId), {
        personData,
        lastUpdated: serverTimestamp()
      });
      return docId;
    } else {
      // Add new favorite
      const docRef = await addDoc(collection(db, 'favorites'), {
        userId,
        personId: personData.name,
        personData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving favorite person:', error);
    throw error;
  }
};

// Get all favorite persons for a user
export const getFavoritePersons = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const favoritesData: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      favoritesData.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return favoritesData;
  } catch (error) {
    console.error('Error getting favorite persons:', error);
    throw error;
  }
};

// Remove a favorite person
export const removeFavoritePerson = async (favoriteId: string) => {
  try {
    await deleteDoc(doc(db, 'favorites', favoriteId));
    return true;
  } catch (error) {
    console.error('Error removing favorite person:', error);
    throw error;
  }
}; 