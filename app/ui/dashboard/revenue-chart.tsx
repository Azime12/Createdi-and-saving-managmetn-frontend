'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';
import { abyssinicaSIL } from '@/app/ui/fonts';

// Static data for Ethiopian fiscal year (starting July)
const loanRepayments = [
  { month: 'መስከረም', revenue: 450000 },
  { month: 'ጥቅምት', revenue: 380000 },
  { month: 'ህዳር', revenue: 420000 },
  { month: 'ታህሳስ', revenue: 510000 },
  { month: 'ጥር', revenue: 490000 },
  { month: 'የካቲት', revenue: 620000 },
  { month: 'መጋቢት', revenue: 580000 },
  { month: 'ሚያዝያ', revenue: 650000 },
  { month: 'ግንቦት', revenue: 710000 },
  { month: 'ሰኔ', revenue: 680000 },
  { month: 'ሀምሌ', revenue: 730000 },
  { month: 'ነሃሴ', revenue: 850000 },
];

 function generateYAxis(data: { revenue: number }[], steps = 5) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const stepValue = Math.ceil(maxRevenue / steps);
  const yAxisLabels = Array.from({ length: steps + 1 }, (_, i) => i * stepValue).reverse();

  return {
    topLabel: steps * stepValue,
    yAxisLabels,
  };
}

export default function RevenueChart() {
  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxis(loanRepayments);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${abyssinicaSIL.className} mb-4 text-xl md:text-2xl`}>
        ወርሃዊ የብድር ክፍያዎች
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label} className={abyssinicaSIL.className}>
                {(label / 1000).toFixed(0)}ሺ
              </p>
            ))}
          </div>

          {loanRepayments.map((month) => (
            <div key={month.month} className="col-span-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-green-600"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                  minWidth: '8px',
                }}
              ></div>
              <p
                className={`-rotate-90 text-xs text-gray-400 sm:rotate-0 sm:text-sm ${abyssinicaSIL.className}`}
              >
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className={`ml-2 text-sm text-gray-500 ${abyssinicaSIL.className}`}>
            12 ወራት
          </h3>
        </div>
      </div>
    </div>
  );
}
