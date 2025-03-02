import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const tiers = [
    {
      name: 'Basic',
      price: 9.99,
      description: 'Perfect for occasional searches',
      features: [
        '10 searches per month',
        'Basic profile information',
        'Social media profiles',
        'Search history',
      ],
      cta: 'Start with Basic',
      mostPopular: false,
    },
    {
      name: 'Pro',
      price: 24.99,
      description: 'For professionals who need detailed information',
      features: [
        '50 searches per month',
        'Comprehensive profile information',
        'All social media profiles',
        'Professional background',
        'Educational history',
        'Search history with notes',
      ],
      cta: 'Start with Pro',
      mostPopular: true,
    },
    {
      name: 'Enterprise',
      price: 99.99,
      description: 'For organizations with advanced needs',
      features: [
        'Unlimited searches',
        'Complete digital footprint',
        'All social and professional profiles',
        'Advanced analytics',
        'Team collaboration',
        'API access',
        'Priority support',
      ],
      cta: 'Contact Sales',
      mostPopular: false,
    },
  ];

  return (
    <div className="bg-gray-900">
      <div className="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
        <div className="text-center">
          <h2 className="text-lg leading-6 font-semibold text-gray-300 uppercase tracking-wider">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            The right price for your needs
          </p>
          <p className="mt-3 max-w-4xl mx-auto text-xl text-gray-300 sm:mt-5 sm:text-2xl">
            Choose the plan that fits your requirements
          </p>
        </div>
      </div>

      <div className="mt-16 bg-white pb-12 lg:mt-20 lg:pb-20">
        <div className="relative z-0">
          <div className="absolute inset-0 h-5/6 bg-gray-900 lg:h-2/3"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`${
                    tier.mostPopular
                      ? 'bg-white ring-2 ring-indigo-600 shadow-xl'
                      : 'bg-gray-50 lg:mt-8'
                  } rounded-lg shadow-md overflow-hidden lg:min-h-full`}
                >
                  <div className="p-8 text-center">
                    <h3
                      className={`text-2xl font-medium ${
                        tier.mostPopular ? 'text-gray-900' : 'text-gray-900'
                      }`}
                    >
                      {tier.name}
                    </h3>
                    {tier.mostPopular && (
                      <div className="mt-4 flex justify-center">
                        <span className="px-4 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                          Most popular
                        </span>
                      </div>
                    )}
                    <div className="mt-4 flex items-baseline justify-center">
                      <span className="text-5xl font-extrabold tracking-tight">${tier.price}</span>
                      <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                    </div>
                    <p className="mt-5 text-lg text-gray-500">{tier.description}</p>
                  </div>
                  <div className="border-t-2 border-gray-100 pt-6 pb-8 px-6 bg-gray-50 space-y-6 sm:pt-6">
                    <ul className="space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <div className="flex-shrink-0">
                            <Check className="h-6 w-6 text-green-500" aria-hidden="true" />
                          </div>
                          <p className="ml-3 text-base text-gray-700">{feature}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-md shadow">
                      <Link
                        to="/signup"
                        className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${
                          tier.mostPopular
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        {tier.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}