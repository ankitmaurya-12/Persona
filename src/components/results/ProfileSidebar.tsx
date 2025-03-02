import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  username: string;
  followers: number;
  icon: React.ElementType;
}

interface Activity {
  id: string;
  type: string;
  name: string;
  date: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  location?: string;
}

interface ProfileSidebarProps {
  name?: string;
  image?: string;
  currentPosition?: string;
  location?: string;
  description?: string;
  recentActivities?: Activity[];
  socialLinks?: SocialLink[];
}

export default function ProfileSidebar({
  name = '',
  image = '',
  currentPosition = '',
  location = '',
  description = '',
  recentActivities = [],
  socialLinks = [],
}: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
              <img 
                src={image || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80"} 
                alt={name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              {currentPosition && (
                <p className="text-sm text-gray-600">{currentPosition}</p>
              )}
              {location && (
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {location}
                </div>
              )}
            </div>
          </div>
          {description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      {recentActivities && recentActivities.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                    <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                    {activity.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={activity.imageUrl} 
                          alt={activity.name} 
                          className="h-32 w-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Social Profiles</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-4 flex items-center hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{social.platform}</p>
                    <p className="text-xs text-gray-500">@{social.username}</p>
                  </div>
                  <div className="ml-auto flex items-center text-xs text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {social.followers.toLocaleString()} followers
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}