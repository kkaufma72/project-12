import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  Database, 
  Layers, 
  BarChart3, 
  Rocket,
  Settings,
  LifeBuoy
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: HomeIcon },
  { name: 'Data Management', href: '/app/data', icon: Database },
  { name: 'Model Training', href: '/app/train', icon: Layers },
  { name: 'Model Evaluation', href: '/app/evaluate', icon: BarChart3 },
  { name: 'Deployment', href: '/app/deploy', icon: Rocket },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/app/settings', icon: Settings },
  { name: 'Support', href: '/app/support', icon: LifeBuoy },
];

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-1 min-h-0 bg-indigo-700">
          <div className="flex items-center flex-shrink-0 h-16 px-4 bg-indigo-800">
            <span className="text-xl font-bold text-white">AutoML Platform</span>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`${
                          isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                        } mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-150`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="pt-2 mt-6 space-y-1 border-t border-indigo-800">
              {secondaryNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`${
                          isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                        } mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-150`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;