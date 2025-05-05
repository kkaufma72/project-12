import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-indigo-600 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business with AI?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using AutoML to build better products, make smarter decisions, and drive business growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="btn bg-white text-indigo-600 hover:bg-gray-100">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href="#" className="btn border border-white text-white hover:bg-indigo-700">
              Schedule Demo
            </a>
          </div>
          <p className="mt-8 text-indigo-200">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;