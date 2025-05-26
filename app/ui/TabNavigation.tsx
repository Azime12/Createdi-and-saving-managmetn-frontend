import { ReactNode } from 'react';

interface TabItem {
  id: string;
  icon: ReactNode;
  label: string;
}

interface TabNavigationProps {
  activeTab: string;
  tabs: TabItem[];
  onTabChange: (tabId: string) => void;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
  hoverColor?: string;
}

const TabNavigation = ({
  activeTab,
  tabs,
  onTabChange,
  className = '',
  activeColor = 'blue',
  inactiveColor = 'gray',
  hoverColor = 'gray',
}: TabNavigationProps) => {
  // Color classes mapping
  const colorClasses = {
    blue: {
      active: 'border-blue-500 text-blue-600',
      hover: 'hover:text-blue-700 hover:border-blue-300',
    },
    gray: {
      active: 'border-gray-500 text-gray-600',
      hover: 'hover:text-gray-700 hover:border-gray-300',
    },
    // Add more colors as needed
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? colorClasses[activeColor].active
                  : `border-transparent text-${inactiveColor}-500 ${colorClasses[hoverColor].hover}`
              }`}
            >
              <span className="mr-2 h-4 w-4">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;