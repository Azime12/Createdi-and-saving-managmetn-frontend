"use client";

import { darkenColor } from "@/app/lib/colorUtils";

interface LoginIllustrationProps {
  primaryColor: string;
}

export const LoginIllustration = ({ primaryColor }: LoginIllustrationProps) => {
  const darkerColor = darkenColor(primaryColor, 20);

  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="400" rx="40" fill={`url(#gradient_${primaryColor.replace('#', '')})`} />
      <defs>
        <linearGradient
          id={`gradient_${primaryColor.replace('#', '')}`}
          x1="0"
          y1="0"
          x2="400"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={primaryColor} />
          <stop offset="1" stopColor={darkerColor} />
        </linearGradient>
      </defs>
      <path
        d="M100 200C100 145.726 144.726 101 199 101C253.274 101 298 145.726 298 200C298 254.274 253.274 299 199 299C144.726 299 100 254.274 100 200Z"
        fill="white"
        fillOpacity="0.2"
      />
      <path
        d="M199 150C172.386 150 150 172.386 150 199C150 225.614 172.386 248 199 248C225.614 248 248 225.614 248 199C248 172.386 225.614 150 199 150Z"
        fill="white"
      />
      <path
        d="M199 170C180.774 170 166 184.774 166 203C166 221.226 180.774 236 199 236C217.226 236 232 221.226 232 203C232 184.774 217.226 170 199 170Z"
        fill={darkerColor}
      />
      <path
        d="M220 120C220 106.745 208.254 95 195 95C181.746 95 170 106.745 170 120C170 133.255 181.746 145 195 145C208.254 145 220 133.255 220 120Z"
        fill={darkerColor}
      />
    </svg>
  );
};