import {
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { abyssinicaSIL } from '@/app/ui/fonts';

const iconMap = {
  collected: CurrencyDollarIcon,
  pending: ClockIcon,
  loans: DocumentTextIcon,
  customers: UserGroupIcon,
};

// Static data for Ethiopian credit union
const cardData = {
  totalCollected: 1254300, // in ETB
  totalPending: 584200,    // in ETB
  activeLoans: 132,
  members: 84,
};

export default function CardWrapper() {
  return (
    <>
      <Card 
        title="ተሰብስበዋል" 
        value={`${cardData.totalCollected.toLocaleString()} ETB`} 
        type="collected" 
      />
      <Card 
        title="በጥበቃ ላይ" 
        value={`${cardData.totalPending.toLocaleString()} ETB`} 
        type="pending" 
      />
      <Card 
        title="ንቁ የብድር ዝርዝር" 
        value={cardData.activeLoans} 
        type="loans" 
      />
      <Card
        title="የአባላት ብዛት"
        value={cardData.members}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'loans' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className={`${abyssinicaSIL.className} ml-2 text-sm font-medium`}>{title}</h3>
      </div>
      <p
        className={`${abyssinicaSIL.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}