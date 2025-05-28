import { Inter, Lusitana, Abyssinica_SIL } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const abyssinicaSIL = Abyssinica_SIL({
  weight: '400', // Abyssinica SIL only supports 400
  subsets: ['latin'], // You can also add 'ethiopic' if needed
});
