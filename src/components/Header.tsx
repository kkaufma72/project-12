import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mr-2">A</div>
              <span className="text-xl font-bold text-gray-900">AutoML</span>
            </a>
            
            <nav className="hidden md:flex ml-10 space-x-8">
              <div className="relative">
                <button 
                  className="flex items-center text-gray-600 hover:text-indigo-600"
                  onClick={() => toggleDropdown('products')}
                >
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'products' && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">AutoML Platform</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">Data Processing</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">Model Deployment</a>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  className="flex items-center text-gray-600 hover:text-indigo-600"
                  onClick={() => toggleDropdown('solutions')}
                >
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'solutions' && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">For Enterprise</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">For Startups</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">For Data Scientists</a>
                    </div>
                  </div>
                )}
              </div>
              
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">Resources</a>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-indigo-600">Sign In</a>
            <a href="#" className="btn btn-primary">Get Started</a>
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-indigo-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <div>
                <button 
                  className="flex items-center justify-between w-full text-gray-600 hover:text-indigo-600"
                  onClick={() => toggleDropdown('mobileProducts')}
                >
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'mobileProducts' && (
                  <div className="mt-2 ml-4 space-y-2">
                    <a href="#" className="block text-sm text-gray-700 hover:text-indigo-600">AutoML Platform</a>
                    <a href="#" className="block text-sm text-gray-700 hover:text-indigo-600">Data Processing</a>
                    <a href="#" className="block text-sm text-gray-700 hover:text-indigo-600">Model Deployment</a>
                  </div>
                )}
              </div>
              
              <div>
                <button 
                  className="flex items-center justify-between w-full text-gray-600 hover:text-indigo-600"
                  onClick={() => toggleDropdown('mobileSolutions')}
                >
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'mobileSolutions' && (
                  <div className="mt-2 ml-4 space-y-2">
                    <a href="#" className="block text-sm text-gray-700 hover:text-indigo-600">For Enterprise</a>
                    <a href="#" className="block text-sm text-gray-700 hover:text-indigo-600">For Startups</a>
                    <a href="#" className="block text-sm text-gray-700 hover:text-indigo-600">For Data Scientists</a>
                  </div>
                )}
              </div>
              
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">Resources</a>
              
              <div className="pt-4 border-t border-gray-200">
                <a href="#" className="block text-gray-600 hover:text-indigo-600 mb-4">Sign In</a>
                <a href="#" className="btn btn-primary w-full">Get Started</a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;