import React from 'react';
import { Upload, Zap, BarChart2, Rocket } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: 'Upload Your Data',
      description: 'Connect to your data source or upload your dataset directly to our secure platform.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Automated Training',
      description: 'Our platform automatically tests multiple algorithms to find the best model for your data.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: 'Evaluate Results',
      description: 'Review model performance metrics and visualizations to understand your model.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: 'Deploy to Production',
      description: 'Deploy your model with one click and start making predictions via API or integrations.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <section className="section-padding" id="process">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
          <p className="text-lg text-gray-600">
            Our simple 4-step process takes you from data to production-ready AI in minutes.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="card p-6 text-center">
                <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6`}>
                  {step.icon}
                </div>
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-4">
                  Step {index + 1}
                </span>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 bg-indigo-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Ready to Get Started?</h3>
              <p className="text-gray-700 mb-8">
                Experience the power of AutoML with our free trial. No credit card required, and you'll be up and running in minutes.
              </p>
              <a href="#" className="btn btn-primary">
                Start Free Trial
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-3xl font-bold text-indigo-600 mb-2">5 min</div>
                <p className="text-sm text-gray-600">Average setup time</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-3xl font-bold text-indigo-600 mb-2">10+</div>
                <p className="text-sm text-gray-600">Supported algorithms</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-3xl font-bold text-indigo-600 mb-2">99.9%</div>
                <p className="text-sm text-gray-600">Uptime guarantee</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
                <p className="text-sm text-gray-600">Expert support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;