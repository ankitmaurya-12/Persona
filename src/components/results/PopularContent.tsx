import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Eye, Calendar, ExternalLink, Youtube, Twitter, Linkedin } from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'video' | 'post' | 'quote' | 'article';
  platform: string;
  title: string;
  date: string;
  url: string;
  thumbnailUrl?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  content?: string;
}

interface PopularContentProps {
  popularContent: ContentItem[];
}

export default function PopularContent({ popularContent }: PopularContentProps) {
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredContent = activeTab === 'all' 
    ? popularContent 
    : popularContent.filter(item => item.type === activeTab);
  
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'twitter':
      case 'x':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Popular Content</h2>
      </div>
      
      {/* Tabs */}
      <div className="px-6 pt-4 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'video'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'post'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('quote')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'quote'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quotes
          </button>
          <button
            onClick={() => setActiveTab('article')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'article'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Articles
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="divide-y divide-gray-200">
        {filteredContent.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No content available in this category.
          </div>
        ) : (
          filteredContent.map((item) => (
            <div key={item.id} className="p-6">
              {item.type === 'video' && (
                <div>
                  <div className="flex items-start">
                    {item.thumbnailUrl && (
                      <div className="flex-shrink-0 mr-4">
                        <div className="relative">
                          <img 
                            src={item.thumbnailUrl} 
                            alt={item.title} 
                            className="h-32 w-56 object-cover rounded-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                            <div className="h-12 w-12 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-indigo-600 border-b-8 border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-base font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {item.title}
                      </a>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          {getPlatformIcon(item.platform)}
                          <span className="ml-1">{item.platform}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        {item.views !== undefined && (
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{formatNumber(item.views)} views</span>
                          </div>
                        )}
                        {item.likes !== undefined && (
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{formatNumber(item.likes)}</span>
                          </div>
                        )}
                        {item.comments !== undefined && (
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{formatNumber(item.comments)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {item.type === 'post' && (
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      {getPlatformIcon(item.platform)}
                      <span className="ml-1">{item.platform}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  {item.content && (
                    <div className="mb-3 text-gray-700">
                      {item.content}
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {item.likes !== undefined && (
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{formatNumber(item.likes)}</span>
                      </div>
                    )}
                    {item.comments !== undefined && (
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{formatNumber(item.comments)}</span>
                      </div>
                    )}
                    {item.shares !== undefined && (
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span>{formatNumber(item.shares)} shares</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View original post
                    </a>
                  </div>
                </div>
              )}
              
              {item.type === 'quote' && (
                <div>
                  <blockquote className="text-lg italic text-gray-700 border-l-4 border-indigo-500 pl-4 py-2 mb-3">
                    "{item.content}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        {getPlatformIcon(item.platform)}
                        <span className="ml-1">{item.platform}</span>
                      </div>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Source
                    </a>
                  </div>
                </div>
              )}
              
              {item.type === 'article' && (
                <div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {item.title}
                  </a>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      {getPlatformIcon(item.platform)}
                      <span className="ml-1">{item.platform}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  {item.content && (
                    <div className="mt-2 text-gray-700">
                      {item.content.length > 150 ? `${item.content.substring(0, 150)}...` : item.content}
                    </div>
                  )}
                  <div className="mt-2">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Read full article
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}