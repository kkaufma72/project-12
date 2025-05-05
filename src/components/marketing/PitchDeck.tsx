import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, BarChart2, Zap, Shield, Cloud, Users, Activity, Target, Rocket, DollarSign, TrendingUp, Globe, Star, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    {
      title: "AutoML Platform",
      subtitle: "Democratizing Machine Learning",
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full">
            <Zap className="w-10 h-10 text-indigo-600" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">AutoML Platform</h2>
            <p className="mt-4 text-xl text-gray-600">
              Empowering businesses to harness the power of AI without the complexity
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The Problem",
      content: (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-red-50 rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-red-900">Market Challenges</h3>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
                  73% of enterprises struggle with ML implementation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
                  Average ML project takes 12+ months to deploy
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
                  $150K+ average cost for ML engineering talent
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
                  87% of ML projects never reach production
                </li>
              </ul>
            </div>
            <div className="p-6 bg-amber-50 rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-amber-900">Business Impact</h3>
              <ul className="space-y-3 text-amber-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-amber-500 rounded-full"></span>
                  Missed revenue opportunities
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-amber-500 rounded-full"></span>
                  Competitive disadvantage
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-amber-500 rounded-full"></span>
                  Resource inefficiency
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-amber-500 rounded-full"></span>
                  Innovation bottlenecks
                </li>
              </ul>
            </div>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="mb-4 text-lg font-semibold text-blue-900">Market Size</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">$15.5B</p>
                <p className="text-sm text-blue-700">TAM</p>
                <p className="mt-1 text-xs text-blue-600">Global AutoML Market</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">$4.2B</p>
                <p className="text-sm text-blue-700">SAM</p>
                <p className="mt-1 text-xs text-blue-600">Enterprise ML Solutions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">$850M</p>
                <p className="text-sm text-blue-700">SOM</p>
                <p className="mt-1 text-xs text-blue-600">Initial Target Market</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Our Solution",
      content: (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Cloud,
                title: "No-Code Platform",
                description: "Build and deploy ML models without writing code"
              },
              {
                icon: BarChart2,
                title: "AutoML Engine",
                description: "Automated model selection and optimization"
              },
              {
                icon: Shield,
                title: "Enterprise Ready",
                description: "Security and compliance built-in"
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "Team-based workflow and knowledge sharing"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 transition-all bg-white rounded-lg shadow-sm hover:shadow-md">
                <feature.icon className="w-8 h-8 text-indigo-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-indigo-50 rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-indigo-900">Technological Innovation</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-indigo-700">
                  <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
                  Proprietary AutoML optimization algorithms
                </li>
                <li className="flex items-center text-indigo-700">
                  <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
                  Automated feature engineering
                </li>
                <li className="flex items-center text-indigo-700">
                  <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
                  Real-time model monitoring
                </li>
                <li className="flex items-center text-indigo-700">
                  <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
                  Distributed training architecture
                </li>
              </ul>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-purple-900">Competitive Advantage</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-purple-700">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  10x faster deployment
                </li>
                <li className="flex items-center text-purple-700">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  80% cost reduction
                </li>
                <li className="flex items-center text-purple-700">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  95% automation rate
                </li>
                <li className="flex items-center text-purple-700">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  Enterprise-grade security
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Market Traction",
      content: (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <Activity className="w-8 h-8 text-green-600" />
              <p className="mt-4 text-3xl font-bold text-gray-900">127%</p>
              <p className="mt-1 text-sm text-gray-500">Monthly Growth</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-blue-600" />
              <p className="mt-4 text-3xl font-bold text-gray-900">50+</p>
              <p className="mt-1 text-sm text-gray-500">Enterprise Clients</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <Target className="w-8 h-8 text-purple-600" />
              <p className="mt-4 text-3xl font-bold text-gray-900">98.5%</p>
              <p className="mt-1 text-sm text-gray-500">Client Retention</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <Globe className="w-8 h-8 text-indigo-600" />
              <p className="mt-4 text-3xl font-bold text-gray-900">12</p>
              <p className="mt-1 text-sm text-gray-500">Countries Served</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-green-900">Growth Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-700">ARR Growth</span>
                  <span className="text-green-900 font-semibold">245%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">User Growth</span>
                  <span className="text-green-900 font-semibold">312%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Model Deployments</span>
                  <span className="text-green-900 font-semibold">518%</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-blue-900">Customer Success</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Time to Value</span>
                  <span className="text-blue-900 font-semibold">-85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Cost Savings</span>
                  <span className="text-blue-900 font-semibold">$2.1M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">ROI</span>
                  <span className="text-blue-900 font-semibold">412%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Business Model",
      content: (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 transition-all bg-white rounded-lg shadow-sm hover:shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Free Tier</h3>
              <p className="mt-2 text-sm text-gray-500">Perfect for experimentation</p>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">$0</p>
                <p className="text-sm text-gray-500">/month</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  3 models
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Community support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Basic analytics
                </li>
              </ul>
            </div>
            <div className="p-6 transition-all bg-indigo-50 rounded-lg shadow-sm hover:shadow-md">
              <h3 className="text-lg font-medium text-indigo-900">Pro</h3>
              <p className="mt-2 text-sm text-indigo-700">For growing teams</p>
              <div className="mt-4">
                <p className="text-3xl font-bold text-indigo-900">$499</p>
                <p className="text-sm text-indigo-700">/month</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-indigo-800">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-indigo-600" />
                  Unlimited models
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-indigo-600" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-indigo-600" />
                  Advanced analytics
                </li>
              </ul>
            </div>
            <div className="p-6 transition-all bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm hover:shadow-md">
              <h3 className="text-lg font-medium text-white">Enterprise</h3>
              <p className="mt-2 text-sm text-indigo-100">Full-scale deployment</p>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">Custom</p>
                <p className="text-sm text-indigo-100">Contact sales</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-white" />
                  Custom solutions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-white" />
                  24/7 support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-white" />
                  Full compliance
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-emerald-50 rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-emerald-900">Revenue Streams</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-emerald-700">
                  <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                  Subscription revenue
                </li>
                <li className="flex items-center text-emerald-700">
                  <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                  Usage-based pricing
                </li>
                <li className="flex items-center text-emerald-700">
                  <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                  Enterprise licensing
                </li>
                <li className="flex items-center text-emerald-700">
                  <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                  Professional services
                </li>
              </ul>
            </div>
            <div className="p-6 bg-amber-50 rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-amber-900">Growth Strategy</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-amber-700">
                  <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
                  Market expansion
                </li>
                <li className="flex items-center text-amber-700">
                  <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
                  Product development
                </li>
                <li className="flex items-center text-amber-700">
                  <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
                  Strategic partnerships
                </li>
                <li className="flex items-center text-amber-700">
                  <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
                  International expansion
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Investment Opportunity",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
            <h3 className="text-xl font-bold mb-4">Funding Round</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-3xl font-bold">$12M</p>
                <p className="text-sm opacity-90">Series A Target</p>
              </div>
              <div>
                <p className="text-3xl font-bold">18mo</p>
                <p className="text-sm opacity-90">Runway Extension</p>
              </div>
              <div>
                <p className="text-3xl font-bold">5x</p>
                <p className="text-sm opacity-90">Growth Multiple</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Use of Funds</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-blue-700">
                  <Rocket className="w-5 h-5 mr-2 text-blue-600" />
                  Product development (40%)
                </li>
                <li className="flex items-center text-blue-700">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Team expansion (30%)
                </li>
                <li className="flex items-center text-blue-700">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Market expansion (20%)
                </li>
                <li className="flex items-center text-blue-700">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Marketing & Sales (10%)
                </li>
              </ul>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Financial Projections</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700">Year 1 Revenue</span>
                  <span className="font-semibold text-purple-900">$5.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-700">Year 2 Revenue</span>
                  <span className="font-semibold text-purple-900">$12.8M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-700">Year 3 Revenue</span>
                  <span className="font-semibold text-purple-900">$28.5M</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Key Milestones</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="font-semibold text-green-900">Q4 2024</p>
                <p className="text-sm text-green-700">International Launch</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="font-semibold text-green-900">Q2 2025</p>
                <p className="text-sm text-green-700">Enterprise Platform</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="font-semibold text-green-900">Q4 2025</p>
                <p className="text-sm text-green-700">100K Users</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="font-semibold text-green-900">Q2 2026</p>
                <p className="text-sm text-green-700">Series B</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h2 className="text-2xl font-bold text-white">{slides[currentSlide].title}</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-white">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white rounded-full hover:bg-white/10"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {slides[currentSlide].content}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border-t">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>
        <Button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          icon={<ChevronRight className="w-4 h-4 ml-2" />}
        >
          Next
        </Button>
      </div>
    </Card>
  );
};

export default PitchDeck;