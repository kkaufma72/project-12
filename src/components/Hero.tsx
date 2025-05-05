import React from 'react';
import { ArrowRight, BarChart2, Database, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white py-20 md:py-32">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4">
              Automated Machine Learning Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Build AI Models <span className="text-indigo-600">Without Code</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              AutoML empowers your team to create, train, and deploy machine learning models without writing a single line of code. Get from data to production in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="btn btn-primary">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#" className="btn btn-secondary">
                Watch Demo
              </a>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-500">
              <span className="flex items-center mr-6">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                14-day free trial
              </span>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10 bg-white rounded-xl shadow-custom-lg p-6 border border-gray-100">
              <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Live Demo
              </div>
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-100 rounded-md w-3/4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-indigo-50 rounded-md flex items-center justify-center">
                    <Database className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div className="h-24 bg-indigo-50 rounded-md flex items-center justify-center">
                    <BarChart2 className="h-8 w-8 text-indigo-500" />
                  </div>
                </div>
                <div className="h-32 bg-gray-100 rounded-md"></div>
                <div className="h-10 bg-indigo-600 rounded-md flex items-center justify-center text-white font-medium">
                  <Zap className="h-5 w-5 mr-2" />
                  Train Model
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full opacity-20 animate-floatUp"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-floatUp" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-200">
          <p className="text-center text-gray-500 mb-8">Trusted by innovative companies worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {['Microsoft', 'Google', 'Amazon', 'IBM', 'Oracle', 'Salesforce'].map((company) => (
              <div key={company} className="text-gray-400 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;