import React from 'react';
import classNames from 'classnames';

interface Tab {
  name: string;
  current: boolean;
  component: React.ReactNode;
  count?: string;
}

interface TabsComponentProps {
  tabs: Tab[];
  activeTab: number; 
  onTabChange: (index: number) => void;
}

const TabsUserComponent: React.FC<TabsComponentProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-md shadow-md mb-8">
      <div className="sm:hidden p-8 pt-0">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          // defaultValue={tabs[activeTab]?.name}
          value={tabs[activeTab]?.name}
          onChange={(e) => {
            const selectedIndex = tabs.findIndex(tab => tab.name === e.target.value);
            onTabChange(selectedIndex);
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block p-8 pt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-0" aria-label="Tabs">
            {tabs.map((tab, index) => (
              <a
                key={tab.name}
                href="#"
                className={classNames(
                  tab.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                  'w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium'
                )}
                aria-current={tab.current ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onTabChange(index);
                }}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                      'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block'
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabsUserComponent;
