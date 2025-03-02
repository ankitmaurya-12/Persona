import React, { useState } from 'react';
import { Check, X, AlertCircle, ExternalLink } from 'lucide-react';

interface PossibleMatch {
  id: string;
  platform: string;
  username: string;
  profileUrl: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  url: string;
  confidenceScore: number;
  matchReason: string;
}

interface IdentityVerificationProps {
  possibleMatches: PossibleMatch[];
  onConfirm: (confirmedMatches: PossibleMatch[]) => void;
  onSkip: () => void;
}

export default function IdentityVerification({
  possibleMatches,
  onConfirm,
  onSkip,
}: IdentityVerificationProps) {
  const [selectedMatches, setSelectedMatches] = useState<Record<string, boolean>>(
    possibleMatches.reduce((acc, match) => {
      acc[match.id] = match.confidenceScore > 0.7; // Auto-select high confidence matches
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const handleToggleMatch = (id: string) => {
    setSelectedMatches(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  const handleConfirm = () => {
    const confirmedMatches = possibleMatches.filter(match => selectedMatches[match.id]);
    onConfirm(confirmedMatches);
  };
  
  const getConfidenceBadge = (score: number) => {
    if (score >= 0.8) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          High Match
        </span>
      );
    } else if (score >= 0.5) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Possible Match
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Low Confidence
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Identity Verification</h2>
      </div>
      
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                We found multiple possible profiles that might match your search. Please select the ones that you believe belong to the person you're looking for.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {possibleMatches.map((match) => (
            <div 
              key={match.id} 
              className={`border rounded-lg p-4 ${
                selectedMatches[match.id] ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleMatch(match.id)}
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      selectedMatches[match.id]
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300'
                    }`}
                  >
                    {selectedMatches[match.id] && <Check className="h-3 w-3" />}
                  </button>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {match.platform}
                      </span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-sm text-gray-500">@{match.username}</span>
                    </div>
                    <div>
                      {getConfidenceBadge(match.confidenceScore)}
                    </div>
                  </div>
                  
                  {match.bio && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{match.bio}</p>
                  )}
                  
                  {match.location && (
                    <p className="mt-1 text-xs text-gray-500">Location: {match.location}</p>
                  )}
                  
                  <p className="mt-2 text-xs text-gray-500">
                    <span className="font-medium">Match reason:</span> {match.matchReason}
                  </p>
                  
                  <div className="mt-2">
                    <a
                      href={match.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View profile <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X className="h-4 w-4 mr-2" />
            Skip
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}