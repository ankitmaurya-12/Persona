import React from 'react';
import { Search, Database, Shield, Clock, Globe, Users } from 'lucide-react';

export default function Features() {
  const features = [
    {
      name: 'Comprehensive Search',
      description: 'Search across multiple platforms including social media, professional networks, blogs, and more.',
      icon: Search,
    },
    {
      name: 'Detailed Profiles',
      description: 'Get comprehensive information including education, career, achievements, and personal details.',
      icon: Database,
    },
    {
      name: 'Privacy Focused',
      description: 'We only collect publicly available information and respect privacy regulations.',
      icon: Shield,
    },
    {
      name: 'Search History',
      description: 'Keep track of your previous searches and easily access them again.',
      icon: Clock,
    },
    {
      name: 'Global Coverage',
      description: 'Find information about people from all around the world.',
      icon: Globe,
    },
    {
      name: 'Identity Verification',
      description: 'Advanced algorithms to verify and match identities across platforms.',
      icon: Users,
    },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to find people
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides comprehensive information about individuals from across the internet.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}