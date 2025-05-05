import React from 'react';
import { Database, BarChart2, Cpu, Layers, Zap, Globe, Shield, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Database />,
      title: 'Automated Data Preparation',
      description: 'Automatically clean, transform, and prepare your data for machine learning with just a few clicks.'
    },
    {
      icon: <BarChart2 />,
      title: 'Model Selection & Training',
      description: 'Our platform tests multiple algorithms to find the best model for your specific data and use case.'
    },
    {
      icon: <Cpu />,
      title: 'Hyperparameter Optimization',
      description: 'Automatically tune model parameters to achieve the highest possible performance without manual intervention.'
    },
    {
      icon: <Layers />,
      title: 'Feature Engineering',
      description: 'Intelligent feature selection and engineering to improve model accuracy and performance.'
    },
    {
      icon: <Zap />,
      title: 'One-Click Deployment',
      description: 'Deploy your trained models to production with a single click and start making predictions immediately.'
    },
    {
      icon: <Globe />,
      title: 'API Integration',
      description: 'Easily integrate your models with existing applications through our RESTful API and SDKs.'
    },
    {
      icon: <Shield />,
      title: 'Model Monitoring',
      description: 'Continuously monitor model performance and receive alerts when retraining is needed.'
    },
    {
      icon: <Users />,
      title: 'Collaboration Tools',
      description: 'Team-based workflow with version control, sharing, and collaboration features built-in.'
    }
  ];

  return (
    <section className="section-padding" id="features">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features for Every Team</h2>
          <p className="text-lg text-gray-600">
            Our comprehensive platform provides everything you need to build, deploy, and manage machine learning models at scale.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-20">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">See the Platform in Action</h3>
                <p className="text-gray-600 mb-8">
                  Watch how easy it is to upload your data, train a model, and deploy it to production in just minutes.
                </p>
                <a href="#" className="btn btn-primary">
                  Watch Demo
                </a>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 aspect-video flex items-center justify-center">
                <div className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center cursor-pointer">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;