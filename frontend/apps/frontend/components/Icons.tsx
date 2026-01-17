import React from 'react';

export const MeditatorIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="currentColor">
    {/* Abstract ink-wash style meditating figure */}
    <path d="M100,40 C110,40 115,50 112,60 C108,75 105,70 100,70 C95,70 92,75 88,60 C85,50 90,40 100,40 Z" opacity="0.9" />
    <path d="M100,75 C120,75 140,85 145,110 C150,135 130,150 100,155 C70,150 50,135 55,110 C60,85 80,75 100,75 Z" opacity="0.8" />
    <path d="M55,110 C40,115 25,125 30,135 C35,145 60,155 80,160" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M145,110 C160,115 175,125 170,135 C165,145 140,155 120,160" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="100" cy="50" r="2" fill="#BFA15F" />
    <circle cx="100" cy="85" r="2" fill="#BFA15F" />
    <circle cx="100" cy="130" r="3" fill="#C96C6C" /> {/* Dantian */}
  </svg>
);

export const CloudIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z"/>
    <path d="M17.5 16c1.7 0 3-1.3 3-3s-1.3-3-3-3-1.4 0-2.6.8-3.3 2.1"/>
    <path d="M11.5 10c0-2.2-1.8-4-4-4s-4 1.8-4 4"/>
  </svg>
);
