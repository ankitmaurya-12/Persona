# PersonFinder Application

A web application that allows users to search for detailed information about people across the internet.

## Features

- User authentication with Firebase
- Search for people by name
- View detailed profiles with social media links, education, career, and more
- Save favorite profiles
- View search history
- Caching of search results for faster subsequent searches

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Enable Firestore Database
4. Update the Firebase configuration in `src/firebase/config.ts` with your project credentials

## Deploying Firestore Security Rules and Indexes

To fix the search functionality and favorites, you need to deploy the Firestore security rules and indexes:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init`
   - Select Firestore
   - Choose your project
   - Use the existing `firestore.rules` file
   - Use the existing `firestore.indexes.json` file
4. Deploy the rules and indexes: `firebase deploy --only firestore`

**Important**: The application requires specific Firestore indexes to function correctly. If you see errors like:

```
Error getting favorite persons: FirebaseError: The query requires an index.
```

This means you need to deploy the indexes by running:

```
firebase deploy --only firestore:indexes
```

Alternatively, you can click on the URL in the error message to create the required index directly in the Firebase console.

## Fixing Search Functionality

If you're experiencing issues with the search functionality, make sure:

1. Your Firebase project has the correct security rules deployed (see above)
2. You're logged in to the application
3. Your Firebase project has billing enabled (required for external API calls)
4. The storage bucket URL in your Firebase config is correct (should be `projectId.appspot.com`)

## Real-World API Integration

The application is designed to work with real-world APIs. Here's how to integrate them:

### 1. People Search APIs

To integrate with people search APIs, update the `searchPersonAPI` function in `src/firebase/searchService.ts`:

```typescript
const searchPersonAPI = async (query: string) => {
  try {
    // Example using Clearbit API
    const response = await fetch(`https://person.clearbit.com/v2/people/find?email=${query}@gmail.com`, {
      headers: {
        'Authorization': 'Bearer YOUR_CLEARBIT_API_KEY'
      }
    });
    
    const data = await response.json();
    
    if (data && data.name) {
      return {
        name: `${data.name.givenName} ${data.name.familyName}`,
        image: data.avatar,
        currentPosition: data.employment ? `${data.employment.title} at ${data.employment.name}` : '',
        location: data.geo ? `${data.geo.city}, ${data.geo.country}` : '',
        description: data.bio,
        // Map other fields as needed
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error calling People API:', error);
    return null;
  }
};
```

### 2. Social Media APIs

To integrate with social media APIs, update the `searchSocialMediaAPI` function:

```typescript
const searchSocialMediaAPI = async (query: string, name: string) => {
  const socialProfiles = [];
  
  // Example using Twitter API v2
  try {
    const response = await fetch(`https://api.twitter.com/2/users/by/username/${query.replace(/\s+/g, '')}?user.fields=public_metrics`, {
      headers: {
        'Authorization': 'Bearer YOUR_TWITTER_API_BEARER_TOKEN'
      }
    });
    
    const data = await response.json();
    
    if (data && data.data) {
      socialProfiles.push({
        platform: "Twitter",
        username: data.data.username,
        url: `https://twitter.com/${data.data.username}`,
        followers: data.data.public_metrics.followers_count
      });
    }
  } catch (error) {
    console.error('Error calling Twitter API:', error);
  }
  
  // Add similar blocks for other social media platforms
  
  return socialProfiles;
};
```

### 3. News and Articles APIs

To integrate with news APIs, update the `searchNewsAPI` function:

```typescript
const searchNewsAPI = async (name: string) => {
  try {
    // Example using NewsAPI
    const response = await fetch(`https://newsapi.org/v2/everything?q="${name}"&sortBy=relevancy&pageSize=5&apiKey=YOUR_NEWS_API_KEY`);
    
    const data = await response.json();
    
    if (data && data.articles) {
      return data.articles.map(article => ({
        title: article.title,
        url: article.url,
        source: article.source.name,
        date: article.publishedAt.split('T')[0]
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error calling News API:', error);
    return [];
  }
};
```

### 4. AI-Powered Search with Google Gemini API

For more comprehensive search results, you can integrate with Google's Gemini API:

```typescript
const searchWithGeminiAPI = async (query: string) => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': 'YOUR_GEMINI_API_KEY'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Find comprehensive information about ${query}. Include full name, current position, location, biography, education history, career history, and social media profiles. Format the response as JSON.`
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (data && data.candidates && data.candidates[0].content.parts[0].text) {
      // Parse the JSON response from Gemini
      const geminiData = JSON.parse(data.candidates[0].content.parts[0].text);
      
      // Map the Gemini response to our application's data structure
      return {
        name: geminiData.name,
        image: geminiData.image || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
        currentPosition: geminiData.currentPosition,
        location: geminiData.location,
        description: geminiData.biography,
        education: geminiData.education,
        career: geminiData.career,
        socialProfiles: geminiData.socialProfiles
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};
```

### 5. Integrating Multiple APIs

For the best results, integrate multiple APIs and combine their data:

```typescript
export const performSearch = async (searchQuery: string, userId?: string) => {
  try {
    // Check for cached results first
    if (userId) {
      const cachedResults = await getSearchResults(userId, searchQuery);
      
      if (cachedResults && hasFreshCachedResults(cachedResults)) {
        console.log('Using cached search results');
        return cachedResults.results;
      }
    }
    
    console.log('Performing new search with external APIs');
    
    // Try AI-powered search first
    let results = await searchWithGeminiAPI(searchQuery);
    
    // If AI search fails, try traditional APIs
    if (!results) {
      results = await searchPersonAPI(searchQuery);
      
      if (results) {
        // Enrich with social media data
        const socialProfiles = await searchSocialMediaAPI(searchQuery, results.name);
        if (socialProfiles && socialProfiles.length > 0) {
          results.socialProfiles = socialProfiles;
        }
        
        // Enrich with news articles
        const articles = await searchNewsAPI(results.name);
        if (articles && articles.length > 0) {
          results.articles = articles;
        }
      }
    }
    
    // If all APIs fail, use mock data as fallback
    if (!results) {
      results = getMockDataForQuery(searchQuery.toLowerCase().trim());
    }
    
    // Cache the results
    if (userId && results) {
      await saveSearchResults(userId, searchQuery, results);
    }
    
    return results;
  } catch (error) {
    console.error('Error performing search:', error);
    throw error;
  }
};
```

## API Keys and Security

When integrating with external APIs, it's important to keep your API keys secure:

1. **Never store API keys in client-side code** - Use Firebase Functions or another backend service to make API calls
2. **Set up API key restrictions** - Limit API keys to specific domains and IP addresses
3. **Use environment variables** - Store API keys in environment variables, not in your code

Example Firebase Function for secure API calls:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.searchPerson = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }
  
  const { query } = data;
  
  try {
    // Make API call with server-side API key
    const response = await fetch(`https://api.example.com/search?q=${query}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`
      }
    });
    
    return await response.json();
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error calling external API');
  }
});
```

## License

MIT