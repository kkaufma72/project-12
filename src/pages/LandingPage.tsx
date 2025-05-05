import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Code, PieChart, Rocket, Zap, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import PitchDeck from '../components/marketing/PitchDeck';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10"></div>
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">AutoML Platform</span>
              <span className="block text-indigo-600">Democratizing Machine Learning</span>
            </h1>
            <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Build, train, and deploy machine learning models with ease. No coding required.
            </p>
            <div className="max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Button
                  onClick={() => navigate('/signin')}
                  className="w-full px-8 py-3"
                  icon={<ArrowRight className="w-5 h-5 ml-2" />}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-12 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-lg">
                <Book className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Getting Started</h3>
              <p className="text-gray-500">
                Learn the basics of our AutoML platform and train your first model in minutes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-emerald-100 rounded-lg">
                <Code className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">API Reference</h3>
              <p className="text-gray-500">
                Comprehensive documentation for our REST API endpoints and SDKs.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-purple-100 rounded-lg">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Model Training</h3>
              <p className="text-gray-500">
                Learn about model training, optimization, and best practices.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-amber-100 rounded-lg">
                <Rocket className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Deployment</h3>
              <p className="text-gray-500">
                Guide to deploying and managing models in production.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-rose-100 rounded-lg">
                <Zap className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Integration</h3>
              <p className="text-gray-500">
                Learn how to integrate our platform with your existing systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pitch Deck Section */}
      <div className="py-12 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Platform Overview
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Learn about our business model, market opportunity, and growth trajectory
            </p>
          </div>
          <div className="mt-8">
            <PitchDeck />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Create your account today.</span>
          </h2>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button
                onClick={() => navigate('/signin')}
                className="px-8 py-3 text-lg bg-white text-indigo-600 hover:bg-gray-50"
              >
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;