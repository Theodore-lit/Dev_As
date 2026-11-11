import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
};

export function BrandLogo({ size = 'md', href = '/' }: BrandLogoProps) {
  const dimensions = sizeMap[size];

  const logo = (
    <Image
      src="/logo.png"
      alt="Question pour un DevAs"
      width={dimensions.width}
      height={dimensions.height}
      priority
      className="object-contain"
    />
  );

  if (href) {
    return <a href={href}>{logo}</a>;
  }

  return <div>{logo}</div>;
}
