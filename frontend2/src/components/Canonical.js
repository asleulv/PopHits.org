"use client";

import { usePathname } from 'next/navigation';

export default function Canonical() {
  const pathname = usePathname();
  const canonicalUrl = `https://pophits.org${pathname}`;

  return (
    <link rel="canonical" href={canonicalUrl} />
  );
}