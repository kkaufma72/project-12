import React from 'react';
import { Clock, TrendingUp, Zap, Shield } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Save Time',
      description: 'Reduce model development time from months to minutes with our automated platform.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Increase Accuracy',
      description: 'Our AutoML algorithms find the optimal model for your data, often outperforming manually built models.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Boost Productivity',
      description: 'Empower your entire team to build and deploy machine learning models without specialized expertise.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Enterprise Security',
      description: 'Your data and models are protected with enterprise-grade security and compliance features.',
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <section className="section-padding bg-gray-50" id="benefits">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose AutoML Platform?</h2>
          <p className="text-lg text-gray-600">
            Our platform democratizes machine learning, making AI accessible to everyone in your organization.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="card p-6 hover:translate-y-[-5px] transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${benefit.color} flex items-center justify-center mb-4`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-indigo-600 rounded-xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Get Results Faster</h3>
              <p className="mb-6">
                Companies using our AutoML platform see an average of 80% reduction in model development time and 35% improvement in model performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 flex-1">
                  <div className="text-3xl font-bold">80%</div>
                  <div className="text-sm">Faster Development</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 flex-1">
                  <div className="text-3xl font-bold">35%</div>
                  <div className="text-sm">Better Performance</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 flex-1">
                  <div className="text-3xl font-bold">90%</div>
                  <div className="text-sm">Customer Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-transparent"></div>
                <img 
                  src="https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Data visualization" 
                  className="rounded-lg w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;