import React from 'react';
import { ExternalLink, Github, Calendar, Users } from 'lucide-react';

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

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {projects.map((project) => (
          <div key={project.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {project.startDate} - {project.endDate || 'Present'}
                  </span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Team size: {project.teamSize}</span>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex space-x-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    Code
                  </a>
                )}
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Role:</h4>
              <p className="mt-1 text-sm text-gray-600">{project.role}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Technologies:</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Key Achievements:</h4>
              <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-gray-600">
                {project.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}