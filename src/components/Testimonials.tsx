import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "AutoML has completely transformed how we approach machine learning projects. What used to take weeks now takes hours.",
      author: "Sarah Johnson",
      position: "CTO, TechNova",
      company: "TechNova",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    },
    {
      quote: "The platform is incredibly intuitive. Our marketing team can now build predictive models without any help from data scientists.",
      author: "Michael Chen",
      position: "Marketing Director",
      company: "Global Retail Inc.",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    },
    {
      quote: "We've seen a 40% increase in prediction accuracy since switching to AutoML. The ROI has been incredible.",
      author: "Emma Davis",
      position: "Data Science Lead",
      company: "FinTech Solutions",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 4
    }
  ];

  return (
    <section className="section-padding bg-gray-50" id="testimonials">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted by Industry Leaders</h2>
          <p className="text-lg text-gray-600">
            See what our customers are saying about how AutoML has transformed their businesses.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.position}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#" className="btn btn-secondary">Read More Success Stories</a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;