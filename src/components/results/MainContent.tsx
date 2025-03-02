import React, { useState } from 'react';
import { 
  Award, 
  Briefcase, 
  GraduationCap,
  Heart,
  User
} from 'lucide-react';

interface MainContentProps {
  name?: string;
  lifeStory?: string;
  lifeEvents?: Array<{
    id: string;
    year: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
  }>;
  academicTimeline?: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    location?: string;
    imageUrl?: string;
  }>;
  careerTimeline?: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    location?: string;
    imageUrl?: string;
  }>;
  photos?: Array<{
    id: string;
    url: string;
    caption: string;
    year: string;
    age?: string;
    location?: string;
    tags?: string[];
  }>;
  personalInfo?: Record<string, any>;
}

export default function MainContent({
  lifeStory = '',
  lifeEvents = [],
  academicTimeline = [],
  careerTimeline = [],
  photos = []
}: MainContentProps) {
  const [activeTab, setActiveTab] = useState('biography');
  
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('biography')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'biography'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Biography
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'education'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab('career')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'career'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Career
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'photos'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Photos
            </button>
          </nav>
        </div>
      </div>

      {/* Biography */}
      {activeTab === 'biography' && lifeStory && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Life Story</h2>
          </div>
          <div className="p-6">
            <div className="prose max-w-none">
              {lifeStory.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {activeTab === 'timeline' && lifeEvents && lifeEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Life Events</h2>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {lifeEvents.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== lifeEvents.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              event.category === 'personal'
                                ? 'bg-blue-500'
                                : event.category === 'professional'
                                ? 'bg-green-500'
                                : 'bg-purple-500'
                            }`}
                          >
                            {event.category === 'personal' ? (
                              <User className="h-5 w-5 text-white" />
                            ) : event.category === 'professional' ? (
                              <Briefcase className="h-5 w-5 text-white" />
                            ) : (
                              <Award className="h-5 w-5 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.title}{' '}
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                              {event.description}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={event.year}>{event.year}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {activeTab === 'education' && academicTimeline && academicTimeline.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Education</h2>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {academicTimeline.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== academicTimeline.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <GraduationCap className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.title}{' '}
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                              {event.description}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={event.date}>{event.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Career */}
      {activeTab === 'career' && careerTimeline && careerTimeline.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Career</h2>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {careerTimeline.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== careerTimeline.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <Briefcase className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.title}{' '}
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                              {event.description}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={event.date}>{event.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Photos */}
      {activeTab === 'photos' && photos && photos.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Photos</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-white">
                      {photo.caption}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {photo.year} • Age: {photo.age}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}