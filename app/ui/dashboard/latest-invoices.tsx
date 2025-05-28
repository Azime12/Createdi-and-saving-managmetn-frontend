import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';

// Static data for latest loan applications
const latestInvoices = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    amount: '$2,500',
    image_url: '/customers/john-smith.png',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    amount: '$1,200',
    image_url: '/customers/sarah-johnson.png',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@example.com',
    amount: '$3,750',
    image_url: '/customers/michael-brown.png',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    amount: '$950',
    image_url: '/customers/emily-davis.png',
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert@example.com',
    amount: '$5,200',
    image_url: '/customers/robert-wilson.png',
  },
];

export default async function LatestInvoices() {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Loan Applications
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestInvoices.map((invoice, i) => {
            return (
              <div
                key={invoice.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={invoice.image_url}
                    alt={`${invoice.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {invoice.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {invoice.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {invoice.amount}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}