import React, { useState } from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small projects',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        '5 models per month',
        '10,000 predictions/month',
        'Basic data preprocessing',
        'Email support',
        'API access',
        'Community forum'
      ],
      cta: 'Start Free Trial',
      highlighted: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing teams and businesses',
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        'Unlimited models',
        '100,000 predictions/month',
        'Advanced data preprocessing',
        'Priority email support',
        'API access',
        'Team collaboration',
        'Model versioning',
        'Custom integrations'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For organizations with advanced needs',
      monthlyPrice: 299,
      annualPrice: 249,
      features: [
        'Unlimited models',
        'Unlimited predictions',
        'Advanced data preprocessing',
        '24/7 dedicated support',
        'API access',
        'Team collaboration',
        'Model versioning',
        'Custom integrations',
        'On-premises deployment',
        'SLA guarantees',
        'Custom model training'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <section className="section-padding" id="pricing">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 mb-8">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${isAnnual ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600"
            >
              <span className="sr-only">Toggle pricing</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual <span className="text-green-500 text-sm font-medium">(Save 20%)</span>
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`card p-6 border ${
                plan.highlighted 
                  ? 'border-indigo-200 shadow-lg relative overflow-visible' 
                  : 'border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-gray-500">/month</span>
                {isAnnual && <span className="block text-sm text-gray-500">billed annually</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <a 
                href="#" 
                className={`btn w-full ${
                  plan.highlighted ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Need a custom solution?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We offer custom enterprise solutions for organizations with specific requirements. Contact our sales team to learn more.
          </p>
          <a href="#" className="btn btn-outline border-indigo-600 text-indigo-600">
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;