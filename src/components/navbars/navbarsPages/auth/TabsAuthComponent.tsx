import React from 'react';
import classNames from 'classnames';

interface Tab {
  name: string;
  current: boolean;
  component: React.ReactNode;
}

interface TabsComponentProps {
  tabs: Tab[];
  onTabChange: (index: number) => void;
}

const TabsAuthComponent: React.FC<TabsComponentProps> = ({ tabs, onTabChange }) => {
  const currentTab = tabs.find((tab) => tab.current);

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
          defaultValue={currentTab?.name}
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
                  'w-1/3 border-b-2 py-4 px-1 text-center text-sm font-medium'
                )}
                aria-current={tab.current ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onTabChange(index);
                }}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabsAuthComponent;
