import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { abyssinicaSIL } from '@/app/ui/fonts';

// Sample Ethiopian customer data
const latestTransactions = [
  {
    id: 1,
    name: 'የሱፍ መሐመድ',
    phone: '+251 91 234 5678',
    amount: '25,000 ETB',
    type: 'ብድር ክፍያ',
  },
  {
    id: 2,
    name: 'ሰለሞን አለማየሁ',
    phone: '+251 92 345 6789',
    amount: '12,500 ETB',
    type: 'ቁጠባ አበል',
  },
  {
    id: 3,
    name: 'ማሪያም ወልደሚካኤል',
    phone: '+251 93 456 7890',
    amount: '37,000 ETB',
    type: 'ብድር ክፍያ',
  },
  {
    id: 4,
    name: 'ተስፋዬ ገብረመድህን',
    phone: '+251 94 567 8901',
    amount: '9,500 ETB',
    type: 'ቁጠባ አበል',
  },
  {
    id: 5,
    name: 'ሀዋልት ካሣሁን',
    phone: '+251 95 678 9012',
    amount: '52,000 ETB',
    type: 'ብድር መውሰድ',
  },
];


export default function LatestTransactions() {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${abyssinicaSIL.className} mb-4 text-xl md:text-2xl`}>
        የቅርብ ጊዜ ግብይቶች
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestTransactions.map((transaction, i) => {
            return (
              <div
                key={transaction.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(transaction.name)}&background=random&rounded=true&size=64`}
  alt={`${transaction.name}'s profile`}
  className="mr-4 rounded-full"
  width={32}
  height={32}
/>

                  <div className="min-w-0">
                    <p className={`truncate text-sm font-semibold md:text-base ${abyssinicaSIL.className}`}>
                      {transaction.name}
                    </p>
                    <p className={`hidden text-sm text-gray-500 sm:block ${abyssinicaSIL.className}`}>
                      {transaction.phone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className={`text-sm font-medium md:text-base ${abyssinicaSIL.className}`}>
                    {transaction.amount}
                  </p>
                  <p className={`text-xs text-gray-500 ${abyssinicaSIL.className}`}>
                    {transaction.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className={`ml-2 text-sm text-gray-500 ${abyssinicaSIL.className}`}>
            አሁን ዘምኗል
          </h3>
        </div>
      </div>
    </div>
  );
}