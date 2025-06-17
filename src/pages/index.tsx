import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { ArrowPathIcon, CurrencyDollarIcon, BanknotesIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            EA-Swap
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Decentralized crypto exchange and microloan platform for East Africa
          </p>
        </div>

        <div className="mt-12">
          <Tab.Group onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>Swap</span>
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5" />
                  <span>Stake</span>
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <BanknotesIcon className="h-5 w-5" />
                  <span>Loans</span>
                </div>
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-6">
              <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Swap Assets</h2>
                  <p className="mt-2 text-gray-600">Swap between BTC, ETH, and XLM with automatic staking</p>
                  {/* Swap component will go here */}
                </div>
              </Tab.Panel>
              <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Your Stakes</h2>
                  <p className="mt-2 text-gray-600">View and manage your staked assets</p>
                  {/* Stake component will go here */}
                </div>
              </Tab.Panel>
              <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Crypto Loans</h2>
                  <p className="mt-2 text-gray-600">Borrow against your staked assets</p>
                  {/* Loan component will go here */}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
} 